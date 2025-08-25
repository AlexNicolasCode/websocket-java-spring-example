package com.chat.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import com.chat.domain.ChatOutput;


@Controller
public class LiveChatController {

    @MessageMapping("/{chatId}/messages")
    @SendTo("/chats/{chatId}")
    public ChatOutput addMessage(@DestinationVariable String chatId, String message) {
        return new ChatOutput(HtmlUtils.htmlEscape(message), chatId);
    }
}