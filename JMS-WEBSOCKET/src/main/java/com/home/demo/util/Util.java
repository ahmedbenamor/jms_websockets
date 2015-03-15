package com.home.demo.util;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Locale.Category;

/**
 * 
 * @author ahmed
 *
 */
public final class Util {
 public static String getSimpleDate() {
        return getSimpleDate(null);
    }

  
    public static String getSimpleDate(Locale locale) {
        Date date = new Date();
        DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.SHORT, DateFormat.MEDIUM,
                ((locale == null) ? Locale.getDefault(Category.DISPLAY) : locale));
        String formattedDate = dateFormat.format(date);
        return formattedDate;
    }
}
