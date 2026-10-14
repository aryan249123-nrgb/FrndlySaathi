package com.example.demo.pattern.observer;

import com.example.demo.entity.Contract;

public class ContractCreatedEvent {
    private final Contract contract;

    public ContractCreatedEvent(Contract contract) {
        this.contract = contract;
    }

    public Contract getContract() {
        return contract;
    }
}
