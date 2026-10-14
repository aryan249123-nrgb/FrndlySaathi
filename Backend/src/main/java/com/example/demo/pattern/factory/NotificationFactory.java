package com.example.demo.pattern.factory;

import com.example.demo.entity.Notification;
import com.example.demo.entity.NotificationType;
import com.example.demo.entity.User;
import org.springframework.stereotype.Component;

/**
 * Factory Pattern: Centralizes creation of different notification channels/types.
 */
@Component
public class NotificationFactory {

    public Notification createNotification(User user, NotificationType type, String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type != null ? type : NotificationType.IN_APP);
        notification.setTitle(title);

        switch (notification.getType()) {
            case EMAIL:
                notification.setMessage("[Email Dispatch] " + message);
                break;
            case SMS:
                notification.setMessage("[SMS Alert] " + message);
                break;
            case IN_APP:
            default:
                notification.setMessage(message);
                break;
        }

        return notification;
    }
}
