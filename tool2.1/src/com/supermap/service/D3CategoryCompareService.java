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
public class D3CategoryCompareService extends D3Service  {
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
		List<Map<String,String>> idens = null;	//存储指标的单位和名称
		JSONArray[] datas = null;				//存储数据
		
		for(int r = 0,rLen = list.size(); r < rLen; r++){
			List<Object> row = list.get(r); 
			int cLen = row.size();
			
			//第一行（指标）
			if(r == 0){
				heads = new ArrayList<Map<String,String>>();
				for (int i = 1; i < cLen; i++) {
					String title = (String) row.get(i);
					if(title != null && !title.isEmpty()){
						String unit = getUnitByTitle(title);
						Map<String, String> head = new HashMap<String, String>();
						head.put("data_title", title);
						head.put("data_unit", unit);
						heads.add(head);
					}
				}

				//初始化数组
				int headLen = heads.size();
				datas = new JSONArray[headLen];
				for (int i = 0,len = datas.length; i < len; i++) {
					datas[i] = new JSONArray();
				}
			//第二行	
			}else if(r == 1){
				if(heads != null && heads.size() > 0){	
					idens = new ArrayList<Map<String,String>>();
					for (int i = 1; i < cLen; i=i+2) {
						String idenName1 = (String) row.get(i);
						if(i+1 < cLen){	
							String idenName2 = (String) row.get(i+1);
							Map<String, String> iden = new HashMap<String, String>();
							iden.put("iden_name1", idenName1);
							iden.put("iden_name2", idenName2);
							idens.add(iden);
						}
					}
				}
			//数据	
			}else{
				int d = 0;
				if(heads != null && heads.size() > 0){	
					String state = (String) row.get(0);
					for (int i = 1; i < cLen; i=i+2) {
						Object oCompare1 = row.get(i);
						if(i+1 < cLen){	
							//07版
							if(oCompare1 instanceof String){
								Number compare1 = Double.parseDouble((String)oCompare1);
								Number compare2 = Double.parseDouble((String)row.get(i+1)) ;
								Freq freq = new Freq(compare1, compare2);
								datas[d++].add((new Item(state, freq).toJSONObject()));
							}else{
								Number compare1 = (Number) oCompare1;
								if(i+1 < cLen){	
									Number compare2 = (Number) row.get(i+1);
									Freq freq = new Freq(compare1, compare2);
									datas[d++].add((new Item(state, freq).toJSONObject()));
								}
							}
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
		
		if(idens != null){
			for (int i = 0,len = idens.size(); i < len; i++) {
				Map<String,String> map = idens.get(i);
				json.put("data"+(i+1)+"_compare1_title", map.get("iden_name1"));
				json.put("data"+(i+1)+"_compare2_title", map.get("iden_name2"));
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
	protected class Freq implements JSONSerialize {

		public static final String KEY_COMPARE1 = "compare1";

		public static final String KEY_COMPARE2 = "compare2";
		
		public Freq(){
			
		}
		
		public Freq(Number compare1,Number compare2){
			setCompare1(compare1);
			setCompare2(compare2);
		}
		
		private Number compare1;
		
		private Number compare2;
		
		public Number getCompare1() {
			return compare1;
		}

		public void setCompare1(Number compare1) {
			this.compare1 = compare1;
		}

		public Number getCompare2() {
			return compare2;
		}

		public void setCompare2(Number compare2) {
			this.compare2 = compare2;
		}

		public JSONObject toJSONObject() {
			JSONObject json = new JSONObject();
			
			Number compare1 = getCompare1();
			json.put(KEY_COMPARE1, compare1 != null ? compare1 : 0);
			Number compare2 = getCompare2();
			json.put(KEY_COMPARE2, compare2 != null ? compare2 : 0);
			
			return json;
		}
		
	}
	
	
	/**
	 * 内部元素类 
	 * 
	 * @author Linhao
	 *
	 */
	protected class Item implements JSONSerialize {

		public static final String KEY_STATE = "State";

		public static final String KEY_FREQ = "freq";

		private String state;
		
		private Freq freq;
		
		public Item(){}
		
		public Item(String state,Freq freq){
			setState(state);
			setFreq(freq);
		}
		
		public String getState() {
			return state;
		}

		public void setState(String state) {
			this.state = state;
		}

		public Freq getFreq() {
			return freq;
		}

		public void setFreq(Freq freq) {
			this.freq = freq;
		}

		public JSONObject toJSONObject() {
			JSONObject json = new JSONObject();

			String state = getState();
			json.put(KEY_STATE, state != null ? state : "");
			
			Freq freq = getFreq();
			json.put(KEY_FREQ, freq != null ? 
					freq.toJSONObject().toString() : "{\""+Freq.KEY_COMPARE1+"\":0,\""+Freq.KEY_COMPARE2+"\":0}");
			
			return json;
		}
	}


	@SuppressWarnings("unchecked")
	@Override
	public JSONObject d3Format(JSONArray jsonArray) {
		JSONObject json = new JSONObject();
		List<Map<String,String>> heads = null;	//存储指标的单位和名称
		List<Map<String,String>> idens = null;	//存储指标的单位和名称
		JSONArray[] datas = null;				//存储数据
		
		for(int r = 0,rLen = jsonArray.size(); r < rLen; r++){
			List<Object> row = (List<Object>) jsonArray.get(r); 
			int cLen = row.size();
			
			//第一行（指标）
			if(r == 0){
				heads = new ArrayList<Map<String,String>>();
				for (int i = 1; i < cLen; i++) {
					String title = row.get(i).toString();
					if(title != null && !title.isEmpty()){
						String unit = getUnitByTitle(title);
						Map<String, String> head = new HashMap<String, String>();
						head.put("data_title", title);
						head.put("data_unit", unit);
						heads.add(head);
					}
				}

				//初始化数组
				int headLen = heads.size();
				datas = new JSONArray[headLen];
				for (int i = 0,len = datas.length; i < len; i++) {
					datas[i] = new JSONArray();
				}
			//第二行	
			}else if(r == 1){
				if(heads != null && heads.size() > 0){	
					idens = new ArrayList<Map<String,String>>();
					for (int i = 1; i < cLen; i=i+2) {
						String idenName1 = row.get(i).toString();
						if(i+1 < cLen){	
							String idenName2 = row.get(i+1).toString();
							Map<String, String> iden = new HashMap<String, String>();
							iden.put("iden_name1", idenName1);
							iden.put("iden_name2", idenName2);
							idens.add(iden);
						}
					}
				}
			//数据	
			}else{
				int d = 0;
				if(heads != null && heads.size() > 0){	
					String state =  row.get(0).toString();
					for (int i = 1; i < cLen; i=i+2) {
						Object oCompare1 = row.get(i);
						if(i+1 < cLen){	
							//07版
							if(oCompare1 instanceof String){
								Number compare1 = Double.parseDouble(oCompare1.toString());
								Number compare2 = Double.parseDouble(row.get(i+1).toString()) ;
								Freq freq = new Freq(compare1, compare2);
								datas[d++].add((new Item(state, freq).toJSONObject()));
							}else{
								Number compare1 = (Number) oCompare1;
								if(i+1 < cLen){	
									Number compare2 = (Number) row.get(i+1);
									Freq freq = new Freq(compare1, compare2);
									datas[d++].add((new Item(state, freq).toJSONObject()));
								}
							}
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
		
		if(idens != null){
			for (int i = 0,len = idens.size(); i < len; i++) {
				Map<String,String> map = idens.get(i);
				json.put("data"+(i+1)+"_compare1_title", map.get("iden_name1"));
				json.put("data"+(i+1)+"_compare2_title", map.get("iden_name2"));
			}
		}
		
		if(datas != null){
			for (int i = 0,len=datas.length; i < len; i++) {
				JSONArray arr = datas[i];
				json.put("data"+(i+1)+"_data", arr.toString());
			}
		}

		String data = json.toString();
		if(data.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
			return json;
		}
		
		json = new JSONObject();
		json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_OK);
		json.put(Result.JSON_RESULT_MESSAGE, "result.execute.ok");
		json.put("data", data);
		
		return json;
	}
}
