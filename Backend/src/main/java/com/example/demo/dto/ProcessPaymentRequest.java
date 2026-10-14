package com.example.demo.dto;

import com.example.demo.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProcessPaymentRequest {

    @NotNull(message = "Contract ID is required")
    private Long contractId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    private PaymentMethod paymentMethod = PaymentMethod.CARD;

    private String userTier = "STANDARD"; // For Strategy pattern: STANDARD or PREMIUM

    public ProcessPaymentRequest() {
    }

    public ProcessPaymentRequest(Long contractId, Double amount, PaymentMethod paymentMethod, String userTier) {
        this.contractId = contractId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.userTier = userTier;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getUserTier() {
        return userTier;
    }

    public void setUserTier(String userTier) {
        this.userTier = userTier;
    }
}
