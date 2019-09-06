package com.xxl.job.admin.conf;

import com.alibaba.fastjson.JSON;
import com.xxl.job.admin.model.TimeZone;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Function:
 *
 * @author crossoverJie
 * Date: 2019-09-05 14:44
 * @since JDK 1.8
 */
@Component
@ConfigurationProperties(prefix = "tz")
@PropertySource(value = "tz.properties",encoding = "UTF-8")
public class TimeZoneConfigBean {
    private String value ;

    private List<TimeZone> timeZones ;

    private Map<String,String> relationship ;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }


    /**
     * 格式化为 list 列表
     * @return
     */
    public List<TimeZone> list(){
        if (timeZones != null){
            return timeZones ;
        }else {
           timeZones = JSON.parseArray(this.getValue(), TimeZone.class);
           return timeZones ;
        }
    }






}
