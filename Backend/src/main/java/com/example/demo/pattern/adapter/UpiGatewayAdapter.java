package com.example.demo.pattern.adapter;

import com.example.demo.entity.PaymentMethod;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class UpiGatewayAdapter implements PaymentGatewayAdapter {

    @Override
    public PaymentResult executePayment(double amount, String reference) {
        String txnId = "TXN_UPI_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return new PaymentResult(true, txnId, "Instant UPI settlement completed for $" + amount);
    }

    @Override
    public PaymentMethod supportsMethod() {
        return PaymentMethod.UPI;
    }
}
