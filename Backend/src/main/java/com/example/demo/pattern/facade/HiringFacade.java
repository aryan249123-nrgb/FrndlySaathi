package com.example.demo.pattern.facade;

import com.example.demo.entity.*;
import com.example.demo.exception.BadRequestException;
import com.example.demo.pattern.observer.ContractCreatedEvent;
import com.example.demo.repository.ContractRepository;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.ProposalRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Facade Pattern: Coordinates complex multi-step hiring workflow:
 * Validating proposal -> Changing proposal status -> Creating Contract ->
 * Updating Project state to IN_PROGRESS -> Emitting ContractCreatedEvent.
 */
@Component
public class HiringFacade {

    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final ApplicationEventPublisher eventPublisher;

    public HiringFacade(ProposalRepository proposalRepository,
                        ProjectRepository projectRepository,
                        ContractRepository contractRepository,
                        ApplicationEventPublisher eventPublisher) {
        this.proposalRepository = proposalRepository;
        this.projectRepository = projectRepository;
        this.contractRepository = contractRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public Contract hireFreelancer(Proposal proposal, User client) {
        Project project = proposal.getProject();

        if (!project.getClient().getId().equals(client.getId())) {
            throw new BadRequestException("Only the project owner can hire freelancers for this project");
        }

        if (proposal.getStatus() == ProposalStatus.ACCEPTED) {
            throw new BadRequestException("This proposal has already been accepted");
        }

        // 1. Accept proposal
        proposal.setStatus(ProposalStatus.ACCEPTED);
        proposalRepository.save(proposal);

        // 2. Transition project to IN_PROGRESS
        project.setStatus(ProjectStatus.IN_PROGRESS);
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);

        // 3. Create active Contract
        Contract contract = new Contract();
        contract.setProject(project);
        contract.setClient(client);
        contract.setFreelancer(proposal.getFreelancer());
        contract.setAgreedAmount(proposal.getBidAmount());
        contract.setStartDate(LocalDate.now().toString());
        contract.setEndDate(LocalDate.now().plusDays(proposal.getEstimatedDays()).toString());
        contract.setStatus(ContractStatus.ACTIVE);
        contract.setCreatedAt(LocalDateTime.now());

        Contract savedContract = contractRepository.save(contract);

        // 4. Fire domain event (Observer pattern)
        eventPublisher.publishEvent(new ContractCreatedEvent(savedContract));

        return savedContract;
    }
}
