package com.example.demo.pattern.observer;

import com.example.demo.entity.Notification;
import com.example.demo.entity.NotificationType;
import com.example.demo.pattern.factory.NotificationFactory;
import com.example.demo.repository.NotificationRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern: Reacts to domain events across the platform and dispatches notifications.
 */
@Component
public class NotificationEventListener {

    private final NotificationRepository notificationRepository;
    private final NotificationFactory notificationFactory;

    public NotificationEventListener(NotificationRepository notificationRepository,
                                     NotificationFactory notificationFactory) {
        this.notificationRepository = notificationRepository;
        this.notificationFactory = notificationFactory;
    }

    @EventListener
    public void onProposalSubmitted(ProposalSubmittedEvent event) {
        // Notify the client who posted the project
        Notification clientNotification = notificationFactory.createNotification(
                event.getProposal().getProject().getClient(),
                NotificationType.IN_APP,
                "New Proposal Received",
                event.getProposal().getFreelancer().getName() + " submitted a proposal for \"" +
                        event.getProposal().getProject().getTitle() + "\" with bid $" + event.getProposal().getBidAmount()
        );
        notificationRepository.save(clientNotification);
    }

    @EventListener
    public void onContractCreated(ContractCreatedEvent event) {
        // Notify the freelancer they were hired
        Notification freelancerNotification = notificationFactory.createNotification(
                event.getContract().getFreelancer(),
                NotificationType.IN_APP,
                "Congratulations! You Were Hired",
                "You have been hired by " + event.getContract().getClient().getName() +
                        " for project \"" + event.getContract().getProject().getTitle() + "\" at $" +
                        event.getContract().getAgreedAmount()
        );
        notificationRepository.save(freelancerNotification);

        // Notify client
        Notification clientNotification = notificationFactory.createNotification(
                event.getContract().getClient(),
                NotificationType.IN_APP,
                "Contract Activated",
                "Contract with " + event.getContract().getFreelancer().getName() +
                        " is now active for \"" + event.getContract().getProject().getTitle() + "\"."
        );
        notificationRepository.save(clientNotification);
    }

    @EventListener
    public void onPaymentProcessed(PaymentProcessedEvent event) {
        // Notify freelancer of funds
        Notification freelancerNotification = notificationFactory.createNotification(
                event.getPayment().getContract().getFreelancer(),
                NotificationType.IN_APP,
                "Payment Received",
                "Received $" + event.getPayment().getNetAmount() + " for contract #" +
                        event.getPayment().getContract().getId() + " via " + event.getPayment().getPaymentMethod()
        );
        notificationRepository.save(freelancerNotification);

        // Notify client of successful charge
        Notification clientNotification = notificationFactory.createNotification(
                event.getPayment().getContract().getClient(),
                NotificationType.IN_APP,
                "Payment Successful",
                "Payment of $" + event.getPayment().getAmount() + " processed successfully (Txn: " +
                        event.getPayment().getTransactionId() + ")."
        );
        notificationRepository.save(clientNotification);
    }
}
