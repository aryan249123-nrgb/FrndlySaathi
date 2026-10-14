package com.example.demo.service;

import com.example.demo.dto.CreateProposalRequest;
import com.example.demo.dto.ProposalResponse;
import com.example.demo.entity.*;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.pattern.facade.HiringFacade;
import com.example.demo.pattern.observer.ProposalSubmittedEvent;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.ProposalRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final HiringFacade hiringFacade;
    private final ApplicationEventPublisher eventPublisher;

    public ProposalService(ProposalRepository proposalRepository,
                           ProjectRepository projectRepository,
                           HiringFacade hiringFacade,
                           ApplicationEventPublisher eventPublisher) {
        this.proposalRepository = proposalRepository;
        this.projectRepository = projectRepository;
        this.hiringFacade = hiringFacade;
        this.eventPublisher = eventPublisher;
    }

    public ProposalResponse submitProposal(Long projectId, CreateProposalRequest request, User freelancer) {
        if (freelancer.getRole() != Role.FREELANCER) {
            throw new BadRequestException("Only freelancers can submit proposals");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new BadRequestException("This project is not open for new proposals");
        }

        if (proposalRepository.existsByProjectAndFreelancer(project, freelancer)) {
            throw new BadRequestException("You have already submitted a proposal for this project");
        }

        Proposal proposal = new Proposal();
        proposal.setProject(project);
        proposal.setFreelancer(freelancer);
        proposal.setCoverLetter(request.getCoverLetter());
        proposal.setBidAmount(request.getBidAmount());
        proposal.setEstimatedDays(request.getEstimatedDays());
        proposal.setStatus(ProposalStatus.PENDING);
        proposal.setCreatedAt(LocalDateTime.now());

        Proposal saved = proposalRepository.save(proposal);

        // Observer Pattern: Publish domain event to trigger client notification
        eventPublisher.publishEvent(new ProposalSubmittedEvent(saved));

        return mapToResponse(saved);
    }

    public List<ProposalResponse> getProposalsForProject(Long projectId, User client) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (!project.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("Only the project owner can view proposals");
        }

        return proposalRepository.findByProjectOrderByCreatedAtDesc(project)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProposalResponse> getMyProposals(User freelancer) {
        return proposalRepository.findByFreelancerOrderByCreatedAtDesc(freelancer)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProposalResponse getProposalById(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found with id: " + id));
        return mapToResponse(proposal);
    }

    public ProposalResponse acceptProposal(Long id, User client) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found with id: " + id));

        // Facade Pattern handles accept -> contract -> project status -> event notification
        hiringFacade.hireFreelancer(proposal, client);

        return mapToResponse(proposal);
    }

    public ProposalResponse rejectProposal(Long id, User client) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found with id: " + id));

        if (!proposal.getProject().getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("Only the project owner can reject proposals");
        }

        proposal.setStatus(ProposalStatus.REJECTED);
        Proposal updated = proposalRepository.save(proposal);
        return mapToResponse(updated);
    }

    public ProposalResponse mapToResponse(Proposal proposal) {
        return new ProposalResponse(
                proposal.getId(),
                proposal.getProject().getId(),
                proposal.getProject().getTitle(),
                proposal.getFreelancer().getId(),
                proposal.getFreelancer().getName(),
                proposal.getFreelancer().getEmail(),
                proposal.getCoverLetter(),
                proposal.getBidAmount(),
                proposal.getEstimatedDays(),
                proposal.getStatus(),
                proposal.getCreatedAt()
        );
    }
}
