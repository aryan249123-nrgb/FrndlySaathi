package com.example.demo.repository;

import com.example.demo.entity.Contract;
import com.example.demo.entity.Project;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByClientOrderByCreatedAtDesc(User client);
    List<Contract> findByFreelancerOrderByCreatedAtDesc(User freelancer);
    Optional<Contract> findByProject(Project project);
}
