package com.example.demo.repository;

import com.example.demo.entity.Project;
import com.example.demo.entity.Proposal;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByProject(Project project);
    List<Proposal> findByProjectOrderByCreatedAtDesc(Project project);
    List<Proposal> findByFreelancerOrderByCreatedAtDesc(User freelancer);
    boolean existsByProjectAndFreelancer(Project project, User freelancer);
    Optional<Proposal> findByProjectAndFreelancer(Project project, User freelancer);
}
