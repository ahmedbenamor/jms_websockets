package com.home.demo.controllers;

import java.security.Principal;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.home.demo.util.Util;

/**
 * 
 * @author ahmed
 *
 */
@Controller
public class HomeController {

    private static final Logger LOG = LoggerFactory
            .getLogger(HomeController.class);

    
    @RequestMapping("/")
    public String handleIndex(Model model, Locale locale) {
        LOG.info("Request for default url processed at {}",
                Util.getSimpleDate());
        return "login";
    }

   
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout() {
        LOG.info("Request for /logout url processed at {}",
                Util.getSimpleDate());
        return "logout";
    }

   
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        LOG.info("Request for /login url processed at {}",
                Util.getSimpleDate());
        return "login";
    }

    
    @RequestMapping("/secured/basicDemo")
    public String basicDemo(Model model, Principal principal,
            Locale locale) {

        String formattedDate = Util.getSimpleDate(locale);
        String userName = principal.getName();
        model.addAttribute("username", userName);
        model.addAttribute("time", formattedDate);

        LOG.info(
                "Request from user:{} for /secured/basicDemo url processed at time:{}",
                userName, formattedDate);

        return "secured/basicDemo";
    }
}