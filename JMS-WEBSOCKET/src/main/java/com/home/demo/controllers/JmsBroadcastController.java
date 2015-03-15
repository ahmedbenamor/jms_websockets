package com.home.demo.controllers;

import java.security.Principal;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.ObjectMessage;
import javax.jms.Session;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.home.demo.util.UserInfo;
/**
 * 
 * @author ahmed
 *
 */

@Controller
public class JmsBroadcastController {

    @Autowired
    private JmsTemplate mJmsTemplate;

    @RequestMapping(value = "/jms", method = RequestMethod.GET)
    @ResponseBody
    public String sendJms(HttpServletRequest request, Principal principale) {
        final UserInfo user = new UserInfo();
        String message = request.getParameter("message");
        user.setName(principale.getName());
        user.setMessage(message);
        
        this.mJmsTemplate.send(new MessageCreator() {
            public Message createMessage(Session session) throws JMSException {
                ObjectMessage messageReturned = session.createObjectMessage();

                messageReturned.setObject(user);
                return messageReturned;
            }

        });
        return "OK";
    }

}
