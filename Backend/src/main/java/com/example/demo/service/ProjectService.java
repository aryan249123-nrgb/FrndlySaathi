package com.example.demo.service;

import com.example.demo.dto.CreateProjectRequest;
import com.example.demo.dto.ProjectResponse;
import com.example.demo.entity.Project;
import com.example.demo.entity.ProjectStatus;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.ProposalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;

    public ProjectService(ProjectRepository projectRepository, ProposalRepository proposalRepository) {
        this.projectRepository = projectRepository;
        this.proposalRepository = proposalRepository;
    }

    public ProjectResponse createProject(CreateProjectRequest request, User client) {
        if (client.getRole() != Role.CLIENT) {
            throw new BadRequestException("Only clients can post projects");
        }

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setDeadline(request.getDeadline());
        project.setCategory(request.getCategory() != null ? request.getCategory() : "General");
        project.setSkillsRequired(request.getSkillsRequired());
        project.setStatus(ProjectStatus.OPEN);
        project.setClient(client);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    public List<ProjectResponse> getAllProjects(String category, ProjectStatus status, String search) {
        List<Project> projects = projectRepository.findAllByOrderByCreatedAtDesc();

        return projects.stream()
                .filter(p -> status == null || p.getStatus() == status)
                .filter(p -> category == null || category.isBlank() || category.equalsIgnoreCase("All") ||
                        (p.getCategory() != null && p.getCategory().equalsIgnoreCase(category)))
                .filter(p -> search == null || search.isBlank() ||
                        p.getTitle().toLowerCase().contains(search.toLowerCase()) ||
                        p.getDescription().toLowerCase().contains(search.toLowerCase()) ||
                        (p.getSkillsRequired() != null && p.getSkillsRequired().toLowerCase().contains(search.toLowerCase())))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToResponse(project);
    }

    public Project getEntityById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public List<ProjectResponse> getProjectsByClient(User client) {
        return projectRepository.findByClientOrderByCreatedAtDesc(client)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse updateProject(Long id, CreateProjectRequest request, User client) {
        Project project = getEntityById(id);
        if (!project.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("You do not have permission to modify this project");
        }

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setDeadline(request.getDeadline());
        if (request.getCategory() != null) project.setCategory(request.getCategory());
        if (request.getSkillsRequired() != null) project.setSkillsRequired(request.getSkillsRequired());
        project.setUpdatedAt(LocalDateTime.now());

        Project updated = projectRepository.save(project);
        return mapToResponse(updated);
    }

    public void deleteProject(Long id, User client) {
        Project project = getEntityById(id);
        if (!project.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedException("You do not have permission to delete this project");
        }
        project.setStatus(ProjectStatus.CANCELLED);
        projectRepository.save(project);
    }

    public ProjectResponse mapToResponse(Project project) {
        int proposalCount = proposalRepository.findByProject(project).size();
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getBudget(),
                project.getDeadline(),
                project.getStatus(),
                project.getClient().getId(),
                project.getClient().getName(),
                project.getClient().getEmail(),
                project.getCategory(),
                project.getSkillsRequired(),
                project.getCreatedAt(),
                proposalCount
        );
    }
}
