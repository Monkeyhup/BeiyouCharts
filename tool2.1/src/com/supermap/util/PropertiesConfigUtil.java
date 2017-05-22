package com.supermap.util;

import java.io.FileNotFoundException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * 读取properties配置文件
 *
 * Created by Linhao on 2015/12/8.
 */
public class PropertiesConfigUtil {

	/**默认的属性文件名**/
	private static final String DEFAULT_PROPERTIES = "chart.name.config.properties";

	/**默认的属性key的后缀：.name**/
	public static final String DEFAULT_SUFFIX_NAME = ".name";

	/**默认的属性key的后缀：.service**/
	public static final String DEFAULT_SUFFIX_SERVICE = ".service";

	/**
	 * 静态的配置类变量
	 */
	private static Properties properties = new Properties();

	static{
		try {
			properties.load(Thread.currentThread().getContextClassLoader()
					.getResourceAsStream(DEFAULT_PROPERTIES));
		} catch (FileNotFoundException e) {
			System.out.println("\n");
			System.out.println("****************************************************");
			System.out.println("系统错误：【可视化制图工具】配置文件chart.name.config.properties未找到！");
			System.out.println("****************************************************");
			System.out.println("\n");
			e.printStackTrace();
		}catch (Exception e) {
			System.out.println("\n");
			System.out.println("****************************************************");
			System.out.println("系统错误：【可视化制图工具】配置文件chart.name.config.properties读取错误！");
			System.out.println("****************************************************");
			System.out.println("\n");

			e.printStackTrace();
		}
	}

	/**
	 * 通过键值获取value
	 *
	 * @param key
	 * 			键值
	 * @return
	 * 			键值对应的value
	 */
	public static String getValue(String key){
		return properties.getProperty(key);
	}

	/**
	 * 是否包含key
	 * @param key
	 * @return
	 */
	public static boolean contains(String key){
		return properties.containsKey(key);
	}

	/**
	 * 通过键值修改对应的value
	 *
	 * @param key
	 * 			键值
	 * @param value
	 * 			新的value值
	 */
	public static void updateProperties(String key,String value) {
		properties.setProperty(key, value);
	}
}
