package com.supermap.service;

import com.supermap.common.Result;
import com.supermap.util.DataUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Excel数据转换service
 * 
 * @author Linhao
 *
 */
public class ExcelDataToJsonDataService {
	
	/**
	 * echarts 数据格式化
	 * 
	 * @param jsonArray
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static JSONObject echartsFormat(JSONArray jsonArray, String type){
		JSONObject json = new JSONObject();
		EchartsService service = EchartsServiceFactory.getServiceInstance(type);
		if(service != null){
			json = service.EchartsFormat(jsonArray);
			if(json == null){
				json = new JSONObject();
				json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
				json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
			}
		}else{
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
		}
		return json;
	}

	/**
	 * fusioncharts 数据格式化
	 *
	 * @param jsonArray
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static JSONObject fusionchartsFormat(JSONArray jsonArray, String type){
		JSONObject json = new JSONObject();
		FusionchartsService service = FusionchartsServiceFactory.getServiceInstance(type);
		if(service != null){
			json = service.FusionchartsFormat(jsonArray);
			if(json == null){
				json = new JSONObject();
				json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
				json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
			}
		}else{
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
		}
		return json;
	}

	/**
	 ** d3数据格式化
	 * @param jsonArray
	 * @param type
	 * @return
	 */
	public static JSONObject d3Format(JSONArray jsonArray, String type) {
		JSONObject json = new JSONObject();
		D3Service service = D3ServiceFactory.getServiceInstance(type);
		if(service != null){
			json = service.d3Format(jsonArray);
			if(json == null){
				json = new JSONObject();
				json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
				json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
			}
		}else{
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
		}
		return json;
	}

	/**
	 * highcharts 数据格式化
	 *
	 * @param jsonArray
	 * @return
	 */
	public static JSONObject highchartsFormat(JSONArray jsonArray){
		JSONObject json = new JSONObject();

		if(jsonArray == null){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
			return json;
		}

		// 取行
		JSONArray reJsonArray = new JSONArray();
		JSONObject reJson = null;
		String[] keys = { "name", "value" };

		for (int i = 0, len = jsonArray.size(); i < len; i++) {
			reJson = new JSONObject();

			List<Object> rowList = (List<Object>) jsonArray.get(i);
			int len2 = rowList.size();
			// 多指标时
			if (len2 > 2) {
				List<List<Object>> newRe = new ArrayList<List<Object>>();
				for (int k = 0; k < len; k++) {
					List<Object> oldRowList = (List<Object>) jsonArray.get(k);
					List<Object> newRowList = new ArrayList<Object>();
					for (int m = 0; m < len2; m++) {
						Object o = oldRowList.get(m);
						// 03
						if (o instanceof Double) {
							Number value = (Number) o;
							newRowList.add(value);
						} else {
							// 07
							String valueStr = o.toString();
							boolean isNumber = DataUtil.isNumber(valueStr);
							if (isNumber) {
								double value = 0;
								if (valueStr.equals("")) {
									value = 0;
								} else {
									value = retainOne(Double.parseDouble(valueStr));
								}
								newRowList.add(value);
							} else {
								valueStr = DataUtil.stringAllReplace(valueStr,
										"（", "(");
								valueStr = DataUtil.stringAllReplace(valueStr,
										"）", ")");
								newRowList
										.add(valueStr != null ? valueStr : "");
							}
						}
					}
					newRe.add(newRowList);
				}
				reJson.put(keys[i], newRe);
				reJsonArray.add(reJson);
				break; // 多指标时处理完毕，跳出循环.
				// 单指标时
			} else {
				for (int j = 0; j < len2; j++) {
					Object object = rowList.get(j);
					if (j > 0) {
						// 03
						if (object instanceof Double) {
							Number value = (Number) object;
							reJson.put(keys[j], value != null ? value : 0);
						} else {
							// 07
							String valueStr = object.toString();
							boolean isNumber = DataUtil.isNumber(valueStr);
							if (isNumber) {
								double value = retainOne(Double.parseDouble(valueStr));
								reJson.put(keys[j], value);
							} else {
								valueStr = DataUtil.stringAllReplace(valueStr,
										"（", "(");
								valueStr = DataUtil.stringAllReplace(valueStr,
										"）", ")");
								reJson.put(keys[j], valueStr != null ? valueStr
										: "");
							}
						}
					} else {
						String valueStr = object.toString();
						valueStr = DataUtil
								.stringAllReplace(valueStr, "（", "(");
						valueStr = DataUtil
								.stringAllReplace(valueStr, "）", ")");
						// 文字
						reJson.put(keys[j], object != null ? object.toString()
								: "");
					}
				}
				reJsonArray.add(reJson);
			}// end if (len2 > 2)
		}

		json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_OK);
		json.put(Result.JSON_RESULT_MESSAGE, "result.execute.ok");
		json.put("data", reJsonArray.toString());

		return json;
	}


	/**
	 * 保留一位有效数字
	 */
	private static double retainOne(double d) {
		BigDecimal b = new BigDecimal(d);
		double f1 = b.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

		return f1;
	}
}