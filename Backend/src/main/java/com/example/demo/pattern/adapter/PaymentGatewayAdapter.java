package com.example.demo.pattern.adapter;

import com.example.demo.entity.PaymentMethod;

/**
 * Adapter Pattern: Normalizes external payment provider interactions into a unified platform contract.
 */
public interface PaymentGatewayAdapter {
    PaymentResult executePayment(double amount, String reference);
    PaymentMethod supportsMethod();
}
