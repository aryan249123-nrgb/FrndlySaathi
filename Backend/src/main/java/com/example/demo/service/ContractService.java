package com.example.demo.service;

import com.example.demo.dto.ContractResponse;
import com.example.demo.entity.*;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.repository.ContractRepository;
import com.example.demo.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final ProjectRepository projectRepository;

    public ContractService(ContractRepository contractRepository, ProjectRepository projectRepository) {
        this.contractRepository = contractRepository;
        this.projectRepository = projectRepository;
    }

    public List<ContractResponse> getUserContracts(User user) {
        List<Contract> list;
        if (user.getRole() == Role.CLIENT) {
            list = contractRepository.findByClientOrderByCreatedAtDesc(user);
        } else {
            list = contractRepository.findByFreelancerOrderByCreatedAtDesc(user);
        }
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ContractResponse getContractById(Long id, User user) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + id));

        if (!contract.getClient().getId().equals(user.getId()) &&
                !contract.getFreelancer().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have access to this contract");
        }

        return mapToResponse(contract);
    }

    @Transactional
    public ContractResponse completeContract(Long id, User client) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + id));

        if (!contract.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("Only the client can mark the contract as completed");
        }

        if (contract.getStatus() == ContractStatus.COMPLETED) {
            throw new BadRequestException("Contract is already marked completed");
        }

        contract.setStatus(ContractStatus.COMPLETED);
        Contract saved = contractRepository.save(contract);

        Project project = contract.getProject();
        project.setStatus(ProjectStatus.COMPLETED);
        projectRepository.save(project);

        return mapToResponse(saved);
    }

    public ContractResponse mapToResponse(Contract contract) {
        return new ContractResponse(
                contract.getId(),
                contract.getProject().getId(),
                contract.getProject().getTitle(),
                contract.getClient().getId(),
                contract.getClient().getName(),
                contract.getFreelancer().getId(),
                contract.getFreelancer().getName(),
                contract.getAgreedAmount(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getStatus(),
                contract.getCreatedAt()
        );
    }
}
