package com.supermap.http;

import java.util.Enumeration;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletRequest;

/**
 * 国际化（本地化）资源管理相关操作
 * 
 * @author Linhao 2014-01-09
 * @version 1.0
 */
public class LocaleManager{
	
	/**
	 * 获取服务器操作系统的默认本地化对象
	 * 
	 * @return 本地化对象
	 */
	public static final Locale getOSDefaultLocale(){
		return Locale.getDefault();
	} 
	
	/**
	 * 覆盖默认的Locale
	 * 
	 * @param newLocale
	 * 				新的Locale对象
	 */
	public static final void CoverOSDefaultLocale(Locale newLocale){
		if(newLocale != null)
			Locale.setDefault(newLocale);
	}
	
	/**
	 * 获取客户端浏览器的第一个Locale
	 * 
	 * @return 客户端浏览器的第一个Locale对象
	 */
	public static final Locale getRequestFirstLocale(HttpServletRequest request){
		if(request == null)
			return null;
		return request.getLocale();
	}
	
	/**
	 * 获取客户端浏览器所有的Locale对象
	 * 
	 * @param request
	 * 				http请求
	 * @return 客户端浏览器所有的Locale对象
	 */
	@SuppressWarnings("unchecked")
	public static final Enumeration<Locale> getRequestLocales(HttpServletRequest request){
		if(request == null)
			return null;
		return request.getLocales();
	}
	
	/**
	 * 通过字符串key取得国际化资源中的内容value
	 * <p style='color:#f00;'>
	 * 	例如：system_zh_CN.properties 资源文件中:sys.success=成功<br/>
	 *  参数：baseName="system"
	 *       key="sys.success"
	 *  <br/>
	 *  返回：成功找到返回“成功”，否则返回“sys.success”
	 * </p>
	 * @return http请求
	 * @param baseName 资源文件路径（一般放在WEB-INF/classes下）
	 * @param key 资源文件中的key
	 * 
	 * @return 返回key对应的value，有可能为key或者""
	 */
	public static final String getLocaleString(HttpServletRequest request,String baseName,String key){
		if(key == null)
			return "";
		if(baseName != null){ 
			Locale l = null;
			if(request != null)
				l = getRequestFirstLocale(request);
			else
				l = getOSDefaultLocale();
			ResourceBundle rb = null;
			try{
				rb = ResourceBundle.getBundle(baseName, l);
				String s = null;
				if(rb != null)
					s = rb.getString(key);
				if(s != null && !s.isEmpty() && !s.equals("null"))
					key = s;
			}catch (MissingResourceException e) {
				//找不到资源文件，或者找不到key
				System.out.println("Not Found："+e.getMessage());	
			}
		}//end if(baseName != null)
		return key;
	}
}
