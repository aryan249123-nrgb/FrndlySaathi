package com.example.demo.pattern.strategy;

import org.springframework.stereotype.Component;

@Component("standardFeeStrategy")
public class StandardFeeStrategy implements PaymentFeeStrategy {

    @Override
    public double calculateFee(double amount) {
        // 10% standard platform commission
        return Math.round((amount * 0.10) * 100.0) / 100.0;
    }

    @Override
    public String getTierName() {
        return "STANDARD";
    }
}
