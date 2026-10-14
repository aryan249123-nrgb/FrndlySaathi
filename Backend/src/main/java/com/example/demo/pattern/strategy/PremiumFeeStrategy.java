package com.example.demo.pattern.strategy;

import org.springframework.stereotype.Component;

@Component("premiumFeeStrategy")
public class PremiumFeeStrategy implements PaymentFeeStrategy {

    @Override
    public double calculateFee(double amount) {
        // 5% discounted platform commission for premium tier
        return Math.round((amount * 0.05) * 100.0) / 100.0;
    }

    @Override
    public String getTierName() {
        return "PREMIUM";
    }
}
