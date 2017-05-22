package com.supermap.result;

/**
 * 
 * 结果状态码接口
 * 
 * @author Linhao
 *
 */
public interface ResultInterface extends ResultMessage{
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
	
}