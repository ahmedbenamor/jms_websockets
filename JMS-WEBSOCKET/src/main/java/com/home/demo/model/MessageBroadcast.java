package com.home.demo.model;

/**
 * 
 * @author ahmed
 *
 */
public class MessageBroadcast {

    private String messageContent;

     public MessageBroadcast() {

    }

     public MessageBroadcast(String messageContent) {
        this.messageContent = messageContent;
    }

   public String getMessageContent() {
        return messageContent;
    }

     public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

}
