package com.example.demo.service;

import com.example.demo.dto.PaymentResponse;
import com.example.demo.dto.ProcessPaymentRequest;
import com.example.demo.entity.*;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.pattern.adapter.PaymentGatewayAdapter;
import com.example.demo.pattern.adapter.PaymentResult;
import com.example.demo.pattern.observer.PaymentProcessedEvent;
import com.example.demo.pattern.strategy.PaymentFeeStrategy;
import com.example.demo.repository.ContractRepository;
import com.example.demo.repository.PaymentRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ContractRepository contractRepository;
    private final Map<String, PaymentFeeStrategy> feeStrategies;
    private final List<PaymentGatewayAdapter> gatewayAdapters;
    private final ApplicationEventPublisher eventPublisher;

    public PaymentService(PaymentRepository paymentRepository,
                          ContractRepository contractRepository,
                          Map<String, PaymentFeeStrategy> feeStrategies,
                          List<PaymentGatewayAdapter> gatewayAdapters,
                          ApplicationEventPublisher eventPublisher) {
        this.paymentRepository = paymentRepository;
        this.contractRepository = contractRepository;
        this.feeStrategies = feeStrategies;
        this.gatewayAdapters = gatewayAdapters;
        this.eventPublisher = eventPublisher;
    }

    public PaymentResponse processPayment(ProcessPaymentRequest request, User client) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + request.getContractId()));

        if (!contract.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("Only the contract client can initiate payment");
        }

        // 1. Strategy Pattern: select fee calculation strategy based on tier
        String strategyBeanName = "PREMIUM".equalsIgnoreCase(request.getUserTier()) ?
                "premiumFeeStrategy" : "standardFeeStrategy";
        PaymentFeeStrategy feeStrategy = feeStrategies.getOrDefault(strategyBeanName, feeStrategies.get("standardFeeStrategy"));
        double feeAmount = feeStrategy.calculateFee(request.getAmount());
        double netAmount = Math.round((request.getAmount() - feeAmount) * 100.0) / 100.0;

        // 2. Adapter Pattern: delegate to appropriate payment provider adapter
        PaymentMethod method = request.getPaymentMethod() != null ? request.getPaymentMethod() : PaymentMethod.CARD;
        PaymentGatewayAdapter adapter = gatewayAdapters.stream()
                .filter(a -> a.supportsMethod() == method)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Unsupported payment method: " + method));

        PaymentResult result = adapter.executePayment(request.getAmount(), "CONTRACT_" + contract.getId());

        // 3. Save Payment entity
        Payment payment = new Payment();
        payment.setContract(contract);
        payment.setAmount(request.getAmount());
        payment.setFeeAmount(feeAmount);
        payment.setNetAmount(netAmount);
        payment.setStatus(result.isSuccess() ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        payment.setPaymentMethod(method);
        payment.setTransactionId(result.getTransactionId());
        payment.setCreatedAt(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);

        // 4. Observer Pattern: emit domain event
        if (result.isSuccess()) {
            eventPublisher.publishEvent(new PaymentProcessedEvent(saved));
        }

        return mapToResponse(saved);
    }

    public List<PaymentResponse> getPaymentsForContract(Long contractId, User user) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + contractId));

        if (!contract.getClient().getId().equals(user.getId()) &&
                !contract.getFreelancer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have access to these payment records");
        }

        return paymentRepository.findByContractOrderByCreatedAtDesc(contract)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getMyPayments(User user) {
        return paymentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(p -> p.getContract().getClient().getId().equals(user.getId()) ||
                             p.getContract().getFreelancer().getId().equals(user.getId()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getContract().getId(),
                payment.getContract().getProject().getTitle(),
                payment.getAmount(),
                payment.getFeeAmount(),
                payment.getNetAmount(),
                payment.getStatus(),
                payment.getPaymentMethod(),
                payment.getTransactionId(),
                payment.getCreatedAt()
        );
    }
}
