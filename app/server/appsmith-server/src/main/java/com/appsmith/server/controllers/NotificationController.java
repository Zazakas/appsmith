package com.appsmith.server.controllers;

import com.appsmith.server.constants.Url;
import com.appsmith.server.domains.Notification;
import com.appsmith.server.dtos.ResponseDTO;
import com.appsmith.server.services.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(Url.NOTIFICATION_URL)
public class NotificationController extends BaseController<NotificationService, Notification, String> {

    @Autowired
    public NotificationController(NotificationService service) {
        super(service);
    }

    @GetMapping("")
    public Mono<ResponseDTO<List<Notification>>> getAll(@RequestParam MultiValueMap<String, String> params) {
        log.debug("Going to get all resources");
        return service.getAll(params);
    }

}
