package com.xxl.job.common;

import com.alibaba.fastjson.JSON;
import com.xxl.job.admin.model.TimeZone;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * Function:
 *
 * @author crossoverJie
 * Date: 2019-09-05 15:04
 * @since JDK 1.8
 */
public class JsonTest {

    @Test
    public void test1(){
        TimeZone t1 = new TimeZone("Australia/Sydney","堪培拉,墨尔本,悉尼(UTC+10:00)") ;
        TimeZone t2 = new TimeZone("Asia/Shanghai","北京,重庆,香港特别行政区,乌鲁木齐(UTC+08:00)") ;
        TimeZone t3 = new TimeZone("Asia/Tokyo","大阪,札幌,东京(UTC+09:00)") ;

        List<TimeZone> list = new ArrayList<>() ;
        list.add(t1) ;
        list.add(t2) ;
        list.add(t3) ;

        System.out.println(JSON.toJSONString(list)) ;


        String json = "[{\"name\":\"Australia/Sydney\",\"zhName\":\"堪培拉,墨尔本,悉尼(UTC+10:00)\"},{\"name\":\"Asia/Shanghai\",\"zhName\":\"北京,重庆,香港特别行政区,乌鲁木齐(UTC+08:00)\"},{\"name\":\"Asia/Tokyo\",\"zhName\":\"大阪,札幌,东京(UTC+09:00)\"}]" ;


        List<TimeZone> list1 = JSON.parseArray(json, TimeZone.class);

    }


    @Test
    public void tz(){
        String[] availableIDs = java.util.TimeZone.getAvailableIDs();
        for (String availableID : availableIDs) {
//            System.out.println(availableID);
        }

        java.util.TimeZone timeZone = java.util.TimeZone.getTimeZone("Australia/Sydney");
        System.out.println(timeZone.getDisplayName());
    }


    @Test
    public void mod(){
        int ringSecond = (int)(1567701000L/1000)%60;
        System.out.println(ringSecond);
        System.out.println("=============");
        System.out.println(80%60);
        System.out.println(79%60);
    }
}
