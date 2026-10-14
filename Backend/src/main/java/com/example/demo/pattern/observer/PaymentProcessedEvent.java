package com.example.demo.pattern.observer;

import com.example.demo.entity.Payment;

public class PaymentProcessedEvent {
    private final Payment payment;

    public PaymentProcessedEvent(Payment payment) {
        this.payment = payment;
    }

    public Payment getPayment() {
        return payment;
    }
}
