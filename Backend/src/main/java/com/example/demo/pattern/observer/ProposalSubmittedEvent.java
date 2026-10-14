package com.example.demo.pattern.observer;

import com.example.demo.entity.Proposal;

public class ProposalSubmittedEvent {
    private final Proposal proposal;

    public ProposalSubmittedEvent(Proposal proposal) {
        this.proposal = proposal;
    }

    public Proposal getProposal() {
        return proposal;
    }
}
