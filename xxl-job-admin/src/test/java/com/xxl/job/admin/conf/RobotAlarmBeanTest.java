package com.xxl.job.admin.conf;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RobotAlarmBeanTest {

    @Resource
    private RobotAlarmBean robotAlarmBean ;

    @Test
    public void alarm() {

        robotAlarmBean.alarm("hahah") ;

    }
}