package com.example.demo.pattern.strategy;

/**
 * Strategy Pattern: Defines calculation of platform processing fee and net amounts.
 */
public interface PaymentFeeStrategy {
    double calculateFee(double amount);
    String getTierName();
}
