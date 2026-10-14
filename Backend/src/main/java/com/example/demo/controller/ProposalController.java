package com.example.demo.controller;

import com.example.demo.dto.CreateProposalRequest;
import com.example.demo.dto.ProposalResponse;
import com.example.demo.entity.User;
import com.example.demo.service.ProposalService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class ProposalController {

    private final ProposalService proposalService;
    private final UserService userService;

    public ProposalController(ProposalService proposalService, UserService userService) {
        this.proposalService = proposalService;
        this.userService = userService;
    }

    @PostMapping("/api/projects/{projectId}/proposals")
    public ResponseEntity<ProposalResponse> submitProposal(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateProposalRequest request) {
        User freelancer = userService.getCurrentAuthenticatedUser();
        ProposalResponse response = proposalService.submitProposal(projectId, request, freelancer);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/projects/{projectId}/proposals")
    public ResponseEntity<List<ProposalResponse>> getProposalsForProject(@PathVariable Long projectId) {
        User client = userService.getCurrentAuthenticatedUser();
        List<ProposalResponse> proposals = proposalService.getProposalsForProject(projectId, client);
        return ResponseEntity.ok(proposals);
    }

    @GetMapping("/api/proposals/my-proposals")
    public ResponseEntity<List<ProposalResponse>> getMyProposals() {
        User freelancer = userService.getCurrentAuthenticatedUser();
        List<ProposalResponse> proposals = proposalService.getMyProposals(freelancer);
        return ResponseEntity.ok(proposals);
    }

    @GetMapping("/api/proposals/{id}")
    public ResponseEntity<ProposalResponse> getProposalById(@PathVariable Long id) {
        ProposalResponse proposal = proposalService.getProposalById(id);
        return ResponseEntity.ok(proposal);
    }

    @PutMapping("/api/proposals/{id}/accept")
    public ResponseEntity<ProposalResponse> acceptProposal(@PathVariable Long id) {
        User client = userService.getCurrentAuthenticatedUser();
        ProposalResponse response = proposalService.acceptProposal(id, client);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/proposals/{id}/reject")
    public ResponseEntity<ProposalResponse> rejectProposal(@PathVariable Long id) {
        User client = userService.getCurrentAuthenticatedUser();
        ProposalResponse response = proposalService.rejectProposal(id, client);
        return ResponseEntity.ok(response);
    }
}
