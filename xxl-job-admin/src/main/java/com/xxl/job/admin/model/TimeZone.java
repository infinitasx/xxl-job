package com.xxl.job.admin.model;

/**
 * Function:
 *
 * @author crossoverJie
 * Date: 2019-09-05 14:57
 * @since JDK 1.8
 */
public class TimeZone {


    /**
     * between : -2
     * name : melb
     */
    private String name;
    private String zhName ;
    private String shortName ;

    public TimeZone(String name,String zhName) {
        this.name = name;
        this.zhName = zhName ;
        this.shortName = name.split("/")[1] ;
    }

    public String getZhName() {
        return zhName;
    }

    public void setZhName(String zhName) {
        this.zhName = zhName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortName() {
        return shortName;
    }
}
