package com.xxl.job.common;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Function:
 *
 * @author crossoverJie
 * Date: 2021/3/5 10:24
 * @since JDK 11
 */
public class TTLTest implements Runnable{
    private int count = 1;

    /**
     * 每秒解析1次 www.baidu.com 的 IP
     */
    @Override
    public void run() {
        while (true) {
            System.out.println(count);
            printIp("www.baidu.com");

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            count = count + 1;
            System.out.print("\r\n");
        }
    }

    /**
     * 解析并打印 IP
     */
    private void printIp(String host) {
        InetAddress address = null;
        try {
            address = Inet4Address.getByName(host);
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }

        if (address == null) {
            return;
        }

        System.out.println(address.getHostAddress());
        System.out.println(address.getHostName());
    }

    public static void main(String[] args) {
        Thread thread = new Thread(new TTLTest());
        thread.start();
    }
}
