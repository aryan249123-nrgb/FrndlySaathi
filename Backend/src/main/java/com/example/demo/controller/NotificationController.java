package com.example.demo.controller;

import com.example.demo.dto.NotificationResponse;
import com.example.demo.entity.User;
import com.example.demo.service.NotificationService;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getUserNotifications() {
        User user = userService.getCurrentAuthenticatedUser();
        List<NotificationResponse> list = notificationService.getUserNotifications(user);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount() {
        User user = userService.getCurrentAuthenticatedUser();
        long count = notificationService.getUnreadCount(user);
        Map<String, Object> map = new HashMap<>();
        map.put("unreadCount", count);
        return ResponseEntity.ok(map);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        User user = userService.getCurrentAuthenticatedUser();
        NotificationResponse response = notificationService.markAsRead(id, user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead() {
        User user = userService.getCurrentAuthenticatedUser();
        notificationService.markAllAsRead(user);
        Map<String, String> map = new HashMap<>();
        map.put("message", "All notifications marked as read");
        return ResponseEntity.ok(map);
    }
}
