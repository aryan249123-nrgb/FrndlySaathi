package com.example.demo.controller;

import com.example.demo.dto.CreateProjectRequest;
import com.example.demo.dto.ProjectResponse;
import com.example.demo.entity.ProjectStatus;
import com.example.demo.entity.User;
import com.example.demo.service.ProjectService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        User client = userService.getCurrentAuthenticatedUser();
        ProjectResponse response = projectService.createProject(request, client);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String search) {
        List<ProjectResponse> projects = projectService.getAllProjects(category, status, search);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        ProjectResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        User client = userService.getCurrentAuthenticatedUser();
        List<ProjectResponse> projects = projectService.getProjectsByClient(client);
        return ResponseEntity.ok(projects);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody CreateProjectRequest request) {
        User client = userService.getCurrentAuthenticatedUser();
        ProjectResponse response = projectService.updateProject(id, request, client);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        User client = userService.getCurrentAuthenticatedUser();
        projectService.deleteProject(id, client);
        return ResponseEntity.noContent().build();
    }
}
