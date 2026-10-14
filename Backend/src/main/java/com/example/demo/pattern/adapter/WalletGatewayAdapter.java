package com.example.demo.pattern.adapter;

import com.example.demo.entity.PaymentMethod;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class WalletGatewayAdapter implements PaymentGatewayAdapter {

    @Override
    public PaymentResult executePayment(double amount, String reference) {
        String txnId = "TXN_WLT_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return new PaymentResult(true, txnId, "Digital wallet debit confirmed for $" + amount);
    }

    @Override
    public PaymentMethod supportsMethod() {
        return PaymentMethod.WALLET;
    }
}
