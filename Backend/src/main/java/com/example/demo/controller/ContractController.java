package com.example.demo.controller;

import com.example.demo.dto.ContractResponse;
import com.example.demo.entity.User;
import com.example.demo.service.ContractService;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;
    private final UserService userService;

    public ContractController(ContractService contractService, UserService userService) {
        this.contractService = contractService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ContractResponse>> getUserContracts() {
        User user = userService.getCurrentAuthenticatedUser();
        List<ContractResponse> contracts = contractService.getUserContracts(user);
        return ResponseEntity.ok(contracts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContractById(@PathVariable Long id) {
        User user = userService.getCurrentAuthenticatedUser();
        ContractResponse contract = contractService.getContractById(id, user);
        return ResponseEntity.ok(contract);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ContractResponse> completeContract(@PathVariable Long id) {
        User client = userService.getCurrentAuthenticatedUser();
        ContractResponse contract = contractService.completeContract(id, client);
        return ResponseEntity.ok(contract);
    }
}
