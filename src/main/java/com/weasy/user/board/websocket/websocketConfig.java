package com.weasy.user.board.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
public class websocketConfig implements WebSocketConfigurer{

    private final websocketHandler webSocketHandler;

    public websocketConfig(websocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/realTimeCheck")
        		.addInterceptors(new HttpSessionHandshakeInterceptor())
        		.setAllowedOrigins("*");
    }
    
}
