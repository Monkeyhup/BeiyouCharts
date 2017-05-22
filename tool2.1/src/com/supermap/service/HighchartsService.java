package com.supermap.service;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.supermap.util.PropertiesConfigUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.supermap.common.Result;
import com.supermap.util.DataUtil;
import com.supermap.util.JsonFormatTool;

/**
 * Highcharts 服务
 *
 * @author Linhao,Fan Weihua
 *
 */
public class HighchartsService extends Service {
	/**
	 * 判断参数是否正确
	 *
	 * @param type
	 * @return
	 */
	public static final boolean isRightHighchartsType(String type){
		if(type == null || type.isEmpty())
			return false;

		type = type.toLowerCase();

		String key = type+PropertiesConfigUtil.DEFAULT_SUFFIX_NAME;
		return PropertiesConfigUtil.contains(key);
	}

	@Override
	public Result createJsonFileByExcel(File excelFile, File dir,
										String fileName) {

		Result result = new Result();

		List<List<Object>> re = parseExcel(excelFile, result);
		if (re == null) {
			return result;
		}

		// 取行
		JSONArray jsonArray = new JSONArray();
		JSONObject json = null;
		String[] keys = { "name", "value" };
		for (int i = 0, len = re.size(); i < len; i++) {
			json = new JSONObject();
			List<Object> rowList = re.get(i);
			int len2 = rowList.size();
			// 多指标时
			if (len2 > 2) {
				List<List<Object>> newRe = new ArrayList<List<Object>>();
				for (int k = 0; k < len; k++) {
					List<Object> oldRowList = re.get(k);
					List<Object> newRowList = new ArrayList<Object>();
					for (int m = 0; m < len2; m++) {
						Object o = oldRowList.get(m);
						// 03
						if (o instanceof Double) {
							Number value = (Number) o;
							newRowList.add(value);
						} else {
							// 07
							String valueStr = (String) o;
							boolean isNumber = DataUtil.isNumber(valueStr);
							if (isNumber) {
								double value = 0;
								if (valueStr.equals("")) {
									value = 0;
								} else {
									value = retainOne(Double
											.parseDouble(valueStr));
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
				json.put(keys[i], newRe);
				jsonArray.add(json);
				break; // 多指标时处理完毕，跳出循环.
				// 单指标时
			} else {
				for (int j = 0; j < len2; j++) {
					Object object = rowList.get(j);
					if (j > 0) {
						// 03
						if (object instanceof Double) {
							Number value = (Number) object;
							json.put(keys[j], value != null ? value : 0);
						} else {
							// 07
							String valueStr = (String) object;
							boolean isNumber = DataUtil.isNumber(valueStr);
							if (isNumber) {
								double value = retainOne(Double
										.parseDouble(valueStr));
								json.put(keys[j], value);
							} else {
								valueStr = DataUtil.stringAllReplace(valueStr,
										"（", "(");
								valueStr = DataUtil.stringAllReplace(valueStr,
										"）", ")");
								json.put(keys[j], valueStr != null ? valueStr
										: "");
							}
						}
					} else {
						String valueStr = (String) object;
						valueStr = DataUtil
								.stringAllReplace(valueStr, "（", "(");
						valueStr = DataUtil
								.stringAllReplace(valueStr, "）", ")");
						// 文字
						json.put(keys[j], object != null ? object.toString()
								: "");
					}
				}
				jsonArray.add(json);
			}// end if (len2 > 2)
		}
		String content = JsonFormatTool.formatJson(jsonArray.toString());

		try {
			writeFile(new File(dir, fileName), content);
			result.setCode(Result.RESULT_EXECUTE_OK);
			result.setMessage("result.execute.ok");
		} catch (IOException e) {
			e.printStackTrace();
			result.setMessage("result.execute.fail.file.no.create");
		}

		return result;
	}

	/**
	 * 保留一位有效数字
	 */
	public double retainOne(double d) {
		BigDecimal b = new BigDecimal(d);
		double f1 = b.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();

		return f1;
	}
}
