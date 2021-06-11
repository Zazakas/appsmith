package com.appsmith.server.services;

import com.appsmith.server.domains.Notification;
import com.appsmith.server.dtos.NotificationsResponseDTO;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;

public interface NotificationService extends CrudService<Notification, String> {
    Mono<NotificationsResponseDTO> getAll(@RequestParam MultiValueMap<String, String> params);

}
