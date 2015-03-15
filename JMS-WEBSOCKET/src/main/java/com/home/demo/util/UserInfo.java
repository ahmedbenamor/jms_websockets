package com.home.demo.util;

import java.io.Serializable;
import java.security.Principal;

/**
 * 
 * @author ahmed
 *
 */
public class UserInfo implements Serializable{
	
	private static final long serialVersionUID = 1L;
	private Long id;
	private String name;
	private String password;
    private String message;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	
	
	public String getName() {
		
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
   
	
	

}
