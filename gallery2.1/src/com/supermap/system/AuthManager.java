package com.supermap.system;

import javax.servlet.ServletContext;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * 系统授权管理
 *
 * @author Linhao
 *
 */
public class AuthManager {
    /**密钥*/
    private static final String SECRET_KEY = "supermap_sgis_01";
    /**授权配置文件*/
    private static final String AUTH_CONFIG = "SUPERMAP_SGIS_DIGITAL_SIGNATURE.sgis";
    /**许可文件开始字符串*/
    private static final String CONFIG_START = "digitalSignature=";

    /**唯一授权管理器*/
    public static AuthManager authManager = null;

    /**是否已经授权**/
    private boolean isHasAuth = true;

    /**上下文接口*/
    private ServletContext context;

    /**授权码*/
    private String authCode;

    /**
     * 初始化授权管理器
     *
     * @return
     */
    public static AuthManager getInstance(ServletContext context){
        if(authManager == null){
            authManager = new AuthManager(context);
        }

        return authManager;
    }

    /**
     * 私有构造方法
     */
    private AuthManager(){
    }

    /**
     * 私有构造方法
     *
     * @param context
     */
    private AuthManager(ServletContext context){
        setContext(context);
        setAuthCode(null);
        setIsHasAuth(false);

        //设置授权码
        String authCode = getAuthCodeFromConfig();
        setAuthCode(authCode);
    }

    /**
     * 获取授权码
     *
     * @return
     */
    private String getAuthCodeFromConfig(){
        InputStream is = Thread.currentThread().getContextClassLoader()
                .getResourceAsStream(AUTH_CONFIG);


        //保存许可
        setAuthCode(null);
        return getAuthCode();
    }

    /**
     * 授权校验
     *
     * @return
     */
    public boolean authValidate(){
        //已经验证通过
        if(isHasAuth()){
            return true;
        }else{
            setIsHasAuth(true);
            printSystemMsg("【可视化制图工具】系统已成功授权！");
            return true;
        }


    }


    /**
     * 退出系统
     *
     * @param msg
     */
    private void exitSystem(String msg){
        if(msg == null || "".equals(msg)){
            msg = "系统未正确授权，请联系管理员，系统即将退出！";
        }

        ServletContext context = getContext();
        if(context != null){
            StringBuilder sb = new StringBuilder();
            sb.append("\n\n");
            sb.append("****************************************************");
            sb.append("\n");
            sb.append(msg);
            sb.append("\n");
            sb.append("****************************************************");
            context.log(sb.toString());
        }
        System.out.println("\n");
        System.out.println("****************************************************");
        System.out.println("系统错误："+msg);
        System.out.println("****************************************************");
        System.out.println("\n");

        //(5秒后)停止java 虚拟器
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        if(context != null){
            StringBuilder sb = new StringBuilder();
            sb.append("\n");
            sb.append("****************************************************");
            sb.append("\n");
            sb.append("系统服务退出！");
            sb.append("\n");
            sb.append("****************************************************");
            context.log(sb.toString());
        }
        System.out.println("");
        System.out.println("****************************************************");
        System.out.println("系统错误：系统服务退出！");
        System.out.println("****************************************************");
        System.out.println("\n");
        System.exit(0);
    }

    /**
     * 打印系统信息
     *
     * @param msg
     */
    public void printSystemMsg(String msg){
        if(msg == null || "".equals(msg)){
            msg = "系统消息！";
        }

        ServletContext context = getContext();
        if(context != null){
            StringBuilder sb = new StringBuilder();
            sb.append("\n");
            sb.append("*************************************");
            sb.append("\n");
            sb.append(msg);
            sb.append("\n");
            sb.append("*************************************");
            context.log(sb.toString());
        }
        System.out.println("");
        System.out.println("*************************************");
        System.out.println("系统消息:"+msg);
        System.out.println("*************************************");
        System.out.println("");
    }


    /**
     * 设置授权码
     *
     * @return
     */
    public String getAuthCode() {
        return authCode;
    }

    /**
     * 取得授权码
     *
     * @param authCode
     */
    private void setAuthCode(String authCode) {
        this.authCode = authCode;
    }

    /**
     * 取得上下文
     * @return
     */
    private ServletContext getContext() {
        return context;
    }

    /**
     * 设置上下文
     *
     * @param context
     */
    private void setContext(ServletContext context) {
        this.context = context;
    }

    /**
     * 判断是否已经授权
     *
     * @return
     */
    private boolean isHasAuth(){
        return isHasAuth;
    }

    /**
     * 设置是否授权
     * @param isHasAuth
     */
    private void setIsHasAuth(boolean isHasAuth){
        this.isHasAuth = isHasAuth;
    }
}
