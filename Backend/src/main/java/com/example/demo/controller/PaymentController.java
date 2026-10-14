package com.example.demo.controller;

import com.example.demo.dto.PaymentResponse;
import com.example.demo.dto.ProcessPaymentRequest;
import com.example.demo.entity.User;
import com.example.demo.service.PaymentService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    public PaymentController(PaymentService paymentService, UserService userService) {
        this.paymentService = paymentService;
        this.userService = userService;
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentResponse> processPayment(
            @Valid @RequestBody ProcessPaymentRequest request) {
        User client = userService.getCurrentAuthenticatedUser();
        PaymentResponse response = paymentService.processPayment(request, client);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsForContract(@PathVariable Long contractId) {
        User user = userService.getCurrentAuthenticatedUser();
        List<PaymentResponse> list = paymentService.getPaymentsForContract(contractId, user);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my-payments")
    public ResponseEntity<List<PaymentResponse>> getMyPayments() {
        User user = userService.getCurrentAuthenticatedUser();
        List<PaymentResponse> list = paymentService.getMyPayments(user);
        return ResponseEntity.ok(list);
    }
}
