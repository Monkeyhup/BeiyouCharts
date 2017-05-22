package com.supermap.common;

import net.sf.json.JSONObject;

/**
 * 返回操作结果
 * 
 * @author Linhao
 *
 */
public class Result implements ResultInterface,JSONSerialize {
	
	/**
	 *  json状态码键
	 */
	public static final String JSON_RESULT_CODE = "code";
	
	/**
	 * message键 
	 */
	public static final String JSON_RESULT_MESSAGE = "message";
	

	/**
	 * 对象名键：objectName 
	 */
	public static final String JSON_RESULT_OBJECT_NAME = "objectName";
	
	/**
	 * 返回状态码：成功
	 */
	public static final int RESULT_EXECUTE_OK = 0;
	
	/**
	 * 执行错误--失败
	 */
	public static final int RESULT_EXECUTE_FAIL = 417;
	
	/**
	 * 返回状态码：没有权限
	 */
	public static final int RESULT_EXECUTE_NO_RIGHT = 403;
	
	/**
	 * 返回的结果码 (默认417)
	 */
	private int code = RESULT_EXECUTE_FAIL;
	

	/**
	 * 返回的结果消息
	 */
	private String message;
	
	
	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public JSONObject toJSONObject() {
		JSONObject json = new JSONObject();
		json.put(JSON_RESULT_CODE, getCode());
		json.put(JSON_RESULT_MESSAGE, getMessage());
		return json;
	}
}
