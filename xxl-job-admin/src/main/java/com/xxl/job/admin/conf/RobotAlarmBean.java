package com.xxl.job.admin.conf;

import com.alibaba.fastjson.JSONObject;
import okhttp3.ConnectionPool;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Function:
 *
 * @author crossoverJie
 * Date: 2020-05-21 17:25
 * @since JDK 1.8
 */
@Component
public class RobotAlarmBean {

    private static Logger logger = LoggerFactory.getLogger(RobotAlarmBean.class);

    @Value("${alarm.robot.url}")
    private String url;

    @Value("${alarm.robot.accessKey}")
    private String accessKey;

    @Value("${alarm.robot.secretKey}")
    private String secretKey;

    @Value("${alarm.robot.domain}")
    private String urlPrefix;

    private OkHttpClient client;

    public RobotAlarmBean() {
        client = (new okhttp3.OkHttpClient.Builder()).readTimeout(10L, TimeUnit.SECONDS).
                connectTimeout(10L, TimeUnit.SECONDS).
                writeTimeout(10L, TimeUnit.SECONDS).
                connectionPool(new ConnectionPool(10, 10L, TimeUnit.MINUTES))
                .build();
    }

    public boolean alarm(String msg) {
        try {
            msg = URLEncoder.encode(msg, "utf-8") ;
        } catch (UnsupportedEncodingException e) {
            return false ;
        }
        Request.Builder requestBuilder = (new Request.Builder()).headers(Headers.of(buildHeader(url, "GET", null)));
        String url = urlPrefix + this.url + "?msg=" + msg;
        logger.info("alarm url={}", url);
        Request req = requestBuilder.url(url).build();

        try {
            Response response = client.newCall(req).execute();
            String res;
            try {
                res = response.body().string();
            } catch (Exception e) {
                return false;
            } finally {
                if (response != null) {
                    response.close();
                }

            }
            logger.info("alarm api res={}", res);
            PyResult pyResult = JSONObject.parseObject(res, PyResult.class);
            if (pyResult.getCode() != 0) {
                return false;
            } else {
                return true;
            }
        } catch (Exception e) {
            logger.error("alarm error={}", e);
            return false;
        }
    }


    private String buildSign(String url, String method, String body, String nonce, String timestamp) {
        List<String> list = new ArrayList();
        list.add(url);
        list.add(method);
        list.add(accessKey);
        list.add(secretKey);
        list.add(nonce);
        list.add(timestamp);
        DigestUtils.sha1Hex(String.join("#&#", list));
        if (null != body && !body.isEmpty()) {
            list.add(body);
        }

        Collections.sort(list);
        return DigestUtils.md5Hex(String.join("#&#", list)).toUpperCase();
    }

    private Map<String, String> buildHeader(String url, String method, String body) {
        Map<String, String> headers = new HashMap();
        String timestamp = System.currentTimeMillis() + "";
        String nonce = UUID.randomUUID().toString().replaceAll("-", "");
        headers.put("accessKey", accessKey);
        headers.put("nonce", nonce);
        headers.put("timestamp", timestamp);
        headers.put("sign", buildSign(url, method, body, nonce, timestamp));
        return headers;

    }

    private static class PyResult {


        /**
         * code : 900
         * data : check online order pay status error
         */

        private int code;
        private String data;

        public int getCode() {
            return code;
        }

        public void setCode(int code) {
            this.code = code;
        }

        public String getData() {
            return data;
        }

        public void setData(String data) {
            this.data = data;
        }
    }

}
