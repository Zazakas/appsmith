package com.appsmith.server.services;

import com.appsmith.server.domains.Notification;
import com.appsmith.server.dtos.ResponseDTO;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;

import java.util.List;

public interface NotificationService extends CrudService<Notification, String> {
    Mono<ResponseDTO<List<Notification>>> getAll(@RequestParam MultiValueMap<String, String> params);
}
