package com.supermap.service;

import com.supermap.util.PropertiesConfigUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.math.BigDecimal;

/**
 * fusionchart 服务
 * 
 * @author Linhao,Fan Weihua
 * 
 */
public abstract class FusionchartsService extends Service {
	/**
	 * 判断参数是否正确
	 * 
	 * @param type
	 * @return
	 */
	public static final boolean isRightFusionchartsType(String type){
		if(type == null || type.isEmpty())
			return false;
		
		type = type.toLowerCase();

		String key = type+ PropertiesConfigUtil.DEFAULT_SUFFIX_NAME;
		return PropertiesConfigUtil.contains(key);
	}



	/**
	 * excel数据格式化
	 * @param jsonArray
	 * @return
	 */
	public abstract JSONObject FusionchartsFormat(JSONArray jsonArray);

	/**
	 * 保留一位有效数字
	 */
	public double retainOne(double d) {
		BigDecimal b = new BigDecimal(d);
		double f1 = b.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

		return f1;
	}
	/**
	 * 保留三位有效数字
	 */
	public double retainThree(double d) {
		BigDecimal b = new BigDecimal(d);
		double f1 = b.setScale(1, BigDecimal.ROUND_HALF_UP).doubleValue();

		return f1;
	}


}
