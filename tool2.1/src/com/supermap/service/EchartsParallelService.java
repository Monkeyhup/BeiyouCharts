package com.supermap.service;

import com.supermap.common.Node;
import com.supermap.common.Result;
import com.supermap.util.DataUtil;
import com.supermap.util.JsonFormatTool;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author lmy
 * 
 */
public class EchartsParallelService extends EchartsService {
	@Override
	public Result createJsonFileByExcel(File excelFile, File dir,
										String fileName) {

		Result result = new Result();

		List<List<Object>> re = parseExcel(excelFile, result);
		if (re == null) {
			return result;
		}
		int len=re.size();
		JSONObject json = new JSONObject();
		List CityName=new ArrayList(); //储存城市名称
		//取得多个指标名，放在一个数组里面
		for(int i=0;i<len;i++){
			List<Object> rowList = (List<Object>) re.get(i);
			if(rowList.size()==1){
				CityName.add(rowList.get(0).toString());
			}
		}
		List<Object> rowList_0 = (List<Object>) re.get(0);  //第一行数据名称
		int CityNameLen=CityName.size();
		int DataNum=(len-1)/CityNameLen;
		Map key_0 = null;//储存0级数据
		List key_4 = null; // 储存四级数据
		List key_5 = new ArrayList(); // 储存5级数据
		for(int i=1;i<len;i++){
			List<Object> rowList = (List<Object>) re.get(i);
			if(i%DataNum==1) {
				key_4 = new ArrayList();
				key_0 = new HashMap();
				key_0.put("name", rowList.get(0));
			}
			else{
				Map key_1 = new HashMap();//储存1级数据
				List key_2 = new ArrayList(); // 储存二级数据
				key_1.put("date", retainThree(Double.parseDouble(rowList.get(0).toString())));
				for(int j=1;j<rowList.size();j++){
					Map key_3 = new HashMap();//储存3级数据
					if(j==rowList.size()-1){
						key_3.put("name", rowList_0.get(j).toString());
						key_3.put("value",rowList.get(j).toString());
					}else{
						key_3.put("name", rowList_0.get(j).toString());
						key_3.put("value",retainThree(Double.parseDouble(rowList.get(j).toString())));
					}
					key_2.add(key_3);
					key_1.put("children", key_2);
				}
				key_4.add(key_1);
			}
			key_0.put("children",key_4);
			if(i%DataNum==0){
				key_5.add(key_0);
			}
		}
		json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_OK);
		json.put(Result.JSON_RESULT_MESSAGE, "result.execute.ok");
		json.put("data", key_5);

		String content = JsonFormatTool.formatJson(json.toString());

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
	@Override
	public JSONObject EchartsFormat(JSONArray jsonArray) {
		int len = jsonArray.size();
		JSONObject json = new JSONObject();

		if (jsonArray == null) {
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
			return json;
		}

		List CityName = new ArrayList(); //储存城市名称
		//取得多个指标名，放在一个数组里面
		for (int i = 0; i < len; i++) {
			List<Object> rowList = (List<Object>) jsonArray.get(i);
			if (rowList.size() == 1) {
				CityName.add(rowList.get(0).toString());
			}
		}
		List<Object> rowList_0 = (List<Object>) jsonArray.get(0);  //第一行数据名称
		int CityNameLen = CityName.size();
		int DataNum = (len-1) / CityNameLen;
		Map key_0 = null;//储存0级数据
		List key_4 = null; // 储存四级数据
		List key_5 = new ArrayList(); // 储存5级数据
		for (int i = 1; i < len; i++) {
			List<Object> rowList = (List<Object>) jsonArray.get(i);
			if (i % DataNum == 1) {
				key_4 = new ArrayList();
				key_0 = new HashMap();
				key_0.put("name", rowList.get(0));
			} else {
				Map key_1 = new HashMap();//储存1级数据
				List key_2 = new ArrayList(); // 储存二级数据
				key_1.put("date", Double.parseDouble(rowList.get(0).toString()));
				for (int j = 1; j < rowList.size(); j++) {
					Map key_3 = new HashMap();//储存3级数据
					if (j == rowList.size() - 1) {
						key_3.put("name", rowList_0.get(j).toString());
						key_3.put("value", rowList.get(j).toString());
					} else {
						key_3.put("name", rowList_0.get(j).toString());
						key_3.put("value", Double.parseDouble(rowList.get(j).toString()));
					}
					key_2.add(key_3);
					key_1.put("children", key_2);
				}
				key_4.add(key_1);
			}
			key_0.put("children", key_4);
			if (i % DataNum == 0) {
				key_5.add(key_0);
			}
		}
		json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_OK);
		json.put(Result.JSON_RESULT_MESSAGE, "result.execute.ok");
		json.put("data", key_5);
		return json;
	}
	}
