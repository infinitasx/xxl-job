package com.xxl.job.common;

import com.alibaba.fastjson.JSON;
import com.xxl.job.admin.model.TimeZone;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
        TimeZone t1 = new TimeZone("melb","墨尔本","-2") ;
        TimeZone t2 = new TimeZone("syd","悉尼","-3") ;

        List<TimeZone> list = new ArrayList<>() ;
        list.add(t1) ;
        list.add(t2) ;

        System.out.println(JSON.toJSONString(list)) ;


        String json = "[{\"between\":\"-2\",\"name\":\"melb\"},{\"between\":\"-3\",\"name\":\"syd\"}]" ;


        List<TimeZone> list1 = JSON.parseArray(json, TimeZone.class);

        Map map = JSON.parseObject(json);

    }
}
