package com.home.demo.controllers;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.home.demo.model.MessageBroadcast;
import com.home.demo.model.SimpleMessage;
import com.home.demo.util.Util;

/**
 * 
 * @author ahmed
 *
 */
@Controller
public class WebSocketBroadcastController {

    private static final Logger LOG = LoggerFactory
            .getLogger(WebSocketBroadcastController.class);

    
    @MessageMapping("/simplemessages")
    @SendTo("/topic/simplemessagesresponse")
    public MessageBroadcast processMessageFromClient(SimpleMessage message,
            Principal principal) throws Exception {
        // Simulate a delay of 3 seconds
        Thread.sleep(3000);
        LOG.info("Sending server side response '{}' for user: {}", message,
                principal.getName());
        return new MessageBroadcast("Server response: Did you send &lt;b&gt;'"
                + message.getMessage() + "'&lt;/b&gt;? (Server Response at: "
                + Util.getSimpleDate() + ")");
    }

    
    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Throwable exception) {
        return exception.getMessage();
    }
}