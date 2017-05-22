package com.supermap.util;

import java.util.Enumeration;
import java.util.Hashtable;

/**
 * 	字符串存储哈希表
 * <br/>
 * 	Copyright: Copyright (c) 2013
 * <br/>
 * @author Linhao-2013-12-31
 * @version 1.0
 * 
 */
public class StringHashUtil extends Hashtable<String, String>{

	private static final long serialVersionUID = -5122754010942967337L;
	
	
	/**
	 * 通过键获取value值
	 * 
	 * @param key
	 * 			键
	 * @return
	 * 		  value值
	 */
	public String get(String key){
		String value = null;
		if(key != null){
			value = super.get(key);
		}//end if(key != null)
		return value;
	}
	
	/**
	 * 存储键和value值（去掉前后空格）
	 * 
	 * @param key
	 * 			键
	 * @return
	 * 		  value值
	 */
	public String put(String key,String value){
		if(key == null || value == null)
			return null;
		else 
			return super.put(key.trim(), value.trim());
	}
	
	/**
	 * 存储键和value值（去掉前后空格）
	 * 
	 * @param key
	 * 			键
	 * @return
	 * 		  value值
	 */
	public String put(String key,int value){
		return put(key, ""+value);
	}
	
	/**
	 * 存储键和value值（去掉前后空格）
	 * 
	 * @param key
	 * 			键
	 * @return
	 * 		  value值
	 */
	public String put(String key,long value){
		return put(key, ""+value);
	}
	
	/**
	 * 存储键和value值（去掉前后空格）
	 * 
	 * @param key
	 * 			键
	 * @return
	 * 		  value值
	 */
	public String put(String key,double value){
		return put(key, ""+value);
	}
	
	/**
	 * 存储键和value值（去掉前后空格）
	 * 
	 * @param key
	 * 			键值
	 * @return
	 * 		  value值
	 */
	public String put(String key,boolean value){
		if(value)
			return put(key, "1");
		else
			return put(key, "0");
	}
	
	/**
	 * 删除键和对应的value值
	 * 
	 * @param key
	 * 			键
	 */
	public void remove(String key){
		if(key != null)
			super.remove(key);
	}
	
	/**
	 * 拷贝一份StringHash
	 * 
	 * @return 
	 * 		拷贝的StringHash
	 */
	public StringHashUtil copy(){
		StringHashUtil newStringHash = new StringHashUtil();
		Enumeration<String> en = keys();	//获取所有的哈希表中的keys
		while (en.hasMoreElements()) {
			String key =  en.nextElement();
			newStringHash.put(key, get(key));
		}//end while (en.hasMoreElements()) 
		return newStringHash;
	}
}