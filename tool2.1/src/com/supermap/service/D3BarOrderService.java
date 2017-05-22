package com.supermap.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.supermap.common.JSONSerialize;
import com.supermap.common.Result;
import com.supermap.util.JsonFormatTool;

/**
 * 
 * @author Linhao
 *
 */
public class D3BarOrderService extends D3Service {
	
	/**
	 * 
	 * @param jsonArray
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@Override
	public JSONObject d3Format(JSONArray jsonArray){
		JSONObject json = new JSONObject();
		
		List<Map<String,String>> heads = null;	//存储指标的单位和名称
		JSONArray[] datas = null;				//存储数据
		
		for(int r = 0,rLen = jsonArray.size(); r < rLen; r++){
			List<Object> row = (List<Object>) jsonArray.get(r); 
			
			//第一行,取标题、单位
			if(r == 0){
				if(row == null || row.size() < 1){
					json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
					json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
					return json;
				}
				heads = new ArrayList<Map<String,String>>();
				//取出指标头
				for (int c = 1,cLen = row.size(); c < cLen; c++) {
					String title =  row.get(c).toString();
					String unit = getUnitByTitle(title);
					
					Map<String, String> head = new HashMap<String, String>();
					head.put("data_title", title);
					head.put("data_unit", unit);
					heads.add(head);
				}
				
				//初始化数组
				int headLen = heads.size();
				datas = new JSONArray[headLen];
				for (int i = 0,len = datas.length; i < len; i++) {
					datas[i] = new JSONArray();
				}
			}else{
				//第二行为合计
				if(r < 2)
					continue;
				
				if(heads != null && heads.size() > 0){
					
					String letter = row.get(0).toString();
					letter = letter != null ? letter : "";
					//取出数据
					for (int c = 1,cLen = row.size(); c < cLen; c++) {
						Object frequencyObject = row.get(c);
						if(frequencyObject instanceof Double){
							Number frequency = (Number) frequencyObject;
							datas[c-1].add((new Item(frequency, letter).toJSONObject()));
						}else{
							double frequency = Double.parseDouble(frequencyObject.toString());
							datas[c-1].add((new Item(frequency, letter).toJSONObject()));
						}
					}		
				}
			}
		}
		
		if(heads != null){
			for (int i = 0,len = heads.size(); i < len; i++) {
				Map<String,String> map = heads.get(i);
				json.put("data"+(i+1)+"_title", map.get("data_title"));
				json.put("data"+(i+1)+"_unit", map.get("data_unit"));
			}
		}
		
		if(datas != null){
			for (int i = 0,len=datas.length; i < len; i++) {
				JSONArray arr = datas[i];
				json.put("data"+(i+1)+"_data", arr.toString());
			}
		}
		
		String data = json.toString();
		json = new JSONObject();
		json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_OK);
		json.put(Result.JSON_RESULT_MESSAGE, "result.execute.ok");
		json.put("data", data);
	
		
		return json;
	}

	@Override
	public Result createJsonFileByExcel(File excelFile, File dir,
			String fileName) {
		Result result = new Result();
		
		List<List<Object>> list = parseExcel(excelFile,result);
		if(list == null){
			result.setMessage("result.execute.fail.file.no.parse");
			return result;
		}
		
		
		JSONObject json = new JSONObject();
		List<Map<String,String>> heads = null;	//存储指标的单位和名称
		JSONArray[] datas = null;				//存储数据
		
		for(int r = 0,rLen = list.size(); r < rLen; r++){
			List<Object> row = list.get(r); 
			
			//第一行,取标题、单位
			if(r == 0){
				if(row == null || row.size() < 1){
					result.setMessage("result.execute.fail.file.no.create");
					return result;
				}
				heads = new ArrayList<Map<String,String>>();
				//取出指标头
				for (int c = 1,cLen = row.size(); c < cLen; c++) {
					String title = (String) row.get(c);
					String unit = getUnitByTitle(title);
					
					Map<String, String> head = new HashMap<String, String>();
					head.put("data_title", title);
					head.put("data_unit", unit);
					heads.add(head);
				}
				
				//初始化数组
				int headLen = heads.size();
				datas = new JSONArray[headLen];
				for (int i = 0,len = datas.length; i < len; i++) {
					datas[i] = new JSONArray();
				}
			}else{
				//第二行为合计
				if(r < 2)
					continue;
				
				if(heads != null && heads.size() > 0){
					
					String letter = (String) row.get(0);
					letter = letter != null ? letter : "";
					//取出数据
					for (int c = 1,cLen = row.size(); c < cLen; c++) {
						Object frequencyObject = row.get(c);
						if(frequencyObject instanceof Double){
							Number frequency = (Number) frequencyObject;
							datas[c-1].add((new Item(frequency, letter).toJSONObject()));
						}else{
							double frequency = Double.parseDouble((String)frequencyObject);
							datas[c-1].add((new Item(frequency, letter).toJSONObject()));
						}
					}		
				}
			}
		}
		
		if(heads != null){
			for (int i = 0,len = heads.size(); i < len; i++) {
				Map<String,String> map = heads.get(i);
				json.put("data"+(i+1)+"_title", map.get("data_title"));
				json.put("data"+(i+1)+"_unit", map.get("data_unit"));
			}
		}
		
		if(datas != null){
			for (int i = 0,len=datas.length; i < len; i++) {
				JSONArray arr = datas[i];
				json.put("data"+(i+1)+"_data", arr.toString());
			}
		}
		
		String content = json.toString();
		if(content.isEmpty()){
			result.setMessage("result.execute.fail.file.no.create");
			return result;
		}
		content = JsonFormatTool.formatJson(content);
		
		try {
			writeFile(new File(dir,fileName), content);
			
			result.setCode(Result.RESULT_EXECUTE_OK);
			result.setMessage("result.execute.ok");
		} catch (IOException e) {
			e.printStackTrace();
			result.setMessage("result.execute.fail.file.no.create");
		}
		
		
		return result;
	}
	
	/**
	 * 内部元素类 
	 * 
	 * @author Linhao
	 *
	 */
	protected class Item implements JSONSerialize {

		public static final String KEY_LETTER = "letter";

		public static final String KEY_FREQUENCY = "frequency";
		
		private String letter;
		
		private Number frequency;
		
		public Item(){}
		
		public Item(Number frequency,String letter){
			setFrequency(frequency);
			setLetter(letter);
		}
		
		public String getLetter() {
			return letter;
		}
		
		public void setLetter(String letter) {
			this.letter = letter;
		}

		public Number getFrequency() {
			return frequency;
		}
		
		public void setFrequency(Number frequency) {
			this.frequency = frequency;
		}

		public JSONObject toJSONObject() {
			JSONObject json = new JSONObject();

			Number frequency = getFrequency();
			json.put(KEY_FREQUENCY, frequency != null ? frequency : 0);
			
			String letter = getLetter();
			json.put(KEY_LETTER, letter != null ? letter : "");
			
			return json;
		}
	}
}
