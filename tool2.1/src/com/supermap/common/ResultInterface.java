package com.supermap.common;

/**
 * 响应结果接口
 * 
 * @author Linhao
 *
 */
public interface ResultInterface {
	
	/**
	 * 获取返回状态码
	 * 
	 * @return 返回状态码
 	 */
	public int getCode();
	
	/**
	 * 设置状态码
	 * 
	 * @param code 状态码
	 */
	public void setCode(int code);
	
	/**
	 * 获取结果消息
	 * 
	 * @return 返回结果消息
 	 */
	public String getMessage();
	
	/**
	 * 设置结果消息
	 * 
	 * @param message 结果消息
	 */
	public void setMessage(String message);

}
