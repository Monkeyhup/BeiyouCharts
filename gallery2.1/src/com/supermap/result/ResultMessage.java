package com.supermap.result;

/**
 * 
 * 操作消息接口
 * 
 * @author Linhao
 *
 */
public interface ResultMessage {
	/**
	 * 设置消息
	 * 
	 * @param message
	 */
	public void setMessage(String message);
	
	/**
	 * 追加消息
	 * 
	 * @param message
	 * @return
	 */
	public ResultMessage append(String message);
	
	/**
	 * 追加消息并换行
	 * 
	 * @param message
	 * @return
	 */
	public ResultMessage appendln(String message);
	
	/**
	 * 取得消息
	 * 
	 * @return
	 */
	public String getMessage();
}
