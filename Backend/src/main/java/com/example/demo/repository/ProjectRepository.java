package com.example.demo.repository;

import com.example.demo.entity.Project;
import com.example.demo.entity.ProjectStatus;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClient(User client);
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByClientOrderByCreatedAtDesc(User client);
    List<Project> findAllByOrderByCreatedAtDesc();
}
