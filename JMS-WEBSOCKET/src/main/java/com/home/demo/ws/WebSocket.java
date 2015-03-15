package com.home.demo.ws;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.home.demo.controllers.HomeController;
import com.home.demo.util.Util;
/**
 * 
 * @author ahmed
 *
 */
@ServerEndpoint(value = "/simplemessages")
public class WebSocket {
    private static final Logger LOG = LoggerFactory
            .getLogger(WebSocket.class);
	private static final ObjectMapper JSON_MAPPER;
	private static final Set<Session> SESSIONS;
	static {
		SESSIONS = Collections.synchronizedSet(new HashSet<Session>());
		JSON_MAPPER = new ObjectMapper();
	}

	public WebSocket() {

	}

	@OnOpen
	public void onOpen(Session session) {
	    LOG.info("new session opened at {}",
                Util.getSimpleDate());
		SESSIONS.add(session);
	}

	@OnClose
	public void onClose(Session session) {
	    LOG.info("session id {} closed at {}",session.getId(),
                Util.getSimpleDate());
		SESSIONS.remove(session);
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
	    LOG.info("error from session id {} at {}",session.getId(),
                Util.getSimpleDate());
	}

	@OnMessage
	public String onHelloMessage(String message) {
	    LOG.info("new message received {} at {}",message,
                Util.getSimpleDate());
		return "Message received = " + message;
	}

	public static void sendMessage(String message) {
	    LOG.info("send message {} to all opened session ",message,
                Util.getSimpleDate());
		try {
			for (Session currentSession : SESSIONS) {
				currentSession.getBasicRemote().sendText(message);
			}
		} catch (IOException e) {

		}
	}
}
