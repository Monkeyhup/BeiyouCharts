package com.supermap.common;

import net.sf.json.JSONObject;

/**
 * 转换为JSON对象的接口
 * 
 * @author Linhao-2014-02-21
 *
 */
public interface JSONSerialize {

	/**
	 * 转换为json对象
	 * 
	 * @return json对象
	 */
	public JSONObject toJSONObject();
}
