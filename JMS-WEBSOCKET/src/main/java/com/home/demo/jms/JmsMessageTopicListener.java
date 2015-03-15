package com.home.demo.jms;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import javax.jms.TextMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.async.DeferredResult;

import com.home.demo.model.MessageBroadcast;
import com.home.demo.model.SimpleMessage;
import com.home.demo.util.UserInfo;
import com.home.demo.util.Util;
import com.home.demo.ws.WebSocket;

/**
 * 
 * @author ahmed
 *
 */
public class JmsMessageTopicListener implements MessageListener{

	   @Autowired 
	  private SimpMessagingTemplate simpMessagingTemplate;
	 public void onMessage(Message message) {
	      
	    	if (message instanceof TextMessage) {
	           
			}else if(message instanceof ObjectMessage){
			    ObjectMessage objectMessage = (ObjectMessage) message;
			    UserInfo user = new UserInfo();
			    try {
			        user =  (UserInfo)objectMessage.getObject();
                } catch (JMSException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
			    
                SimpleMessage simpleMessage = new SimpleMessage();
                simpleMessage.setMessage(user.getMessage());
                WebSocket.sendMessage(simpleMessage.getMessage());
           
        
			    
			}
	    	
	    	
	    	
	    	
	    }
		
		
		
		
		
}
