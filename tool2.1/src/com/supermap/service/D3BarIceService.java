package com.supermap.service;

import java.io.File;
import java.io.IOException;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.supermap.common.Node;
import com.supermap.common.Result;
import com.supermap.util.DataUtil;
import com.supermap.util.JsonFormatTool;

/**
 * 
 * @author Linhao
 *
 */
public class D3BarIceService extends D3Service {

	@Override
	public Result createJsonFileByExcel(File excelFile, File dir,
			String fileName) {
		
		Result result = new Result();
	
		List<List<Object>> list = parseExcel(excelFile,result);
		if(list == null){
			result.setMessage("result.execute.fail.file.no.parse");
			return result;
		}
		
		String title = null;		//取标题
		String unit = null;			//单位
		
		Node root = null;
		for(int r = 0,rLen = list.size(); r < rLen; r++){
			List<Object> row = list.get(r); 
			
			//第一行,取标题、单位
			if(r == 0){
				title = (String) row.get(1);
				unit = getUnitByTitle(title);
			}else{
				//从第二行开始取数据(根)
				if(r == 1){
					Object o = row.get(0);
					String name = o != null ? o.toString() : "";
					
					Object levelObject = row.get(2);
					int level;
					if(levelObject instanceof Double){
						level = (int) ((Double) levelObject).doubleValue();
					}else{
						level = DataUtil.StringToInt((String)levelObject);
					}
					
					Object sizeObject = row.get(1);
					if(sizeObject instanceof Double){
						Number size = (Number) sizeObject;
						root = new Node(title+":"+name+"("+size+")",size,level);
					}else{
						
						//是整数
						if(!((String)sizeObject).contains(".")){
							int size = Integer.parseInt((String)sizeObject);
							root = new Node(title+":"+name+"("+size+")",size,level);
						}else{
							double size = Double.parseDouble((String)sizeObject);
							root = new Node(title+":"+name+"("+size+")",size,level);
						}
						
					}
					
					next(root,list, r,unit);	//获取下一个
					
					break;
				}
			}
		}
		
		if(root == null){
			result.setMessage("result.execute.fail.file.no.create");
			return result;
		}
		
		String content = root.toJSONObject().toString();
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
	 * 
	 * 找下一个节点
	 * 
	 * @param root
	 * 			root 根
	 * @param list
	 * 			excel 数据
	 * @param rowNum
	 * 			当前行数（0开始）
	 * @param unit
	 * 			单位
	 * @return	根节点
	 */
	private void next(Node root,List<List<Object>> list,int rowNum,String unit) {
		if(root == null)
			return;

		int total = list.size();
		int rootLevel = root.getLevel();
	
		for(int i = rowNum+1;i<total;i++){
			List<Object> row = list.get(i); 
			
			Object o = row.get(0);
			String name = o != null ? o.toString() : "";
			
			Object levelObject = row.get(2);
			int level;
			if(levelObject instanceof Double){
				level = (int) ((Double) levelObject).doubleValue();
			}else{
				level = DataUtil.StringToInt((String)levelObject);
			}
			
			//一旦大于等于，代表为另外一类
			if(rootLevel >= level)
				break;
			
			if((level == rootLevel+1)){	//找到子节点
				Object sizeObject = row.get(1);
				if(sizeObject instanceof Double){
					Number size = (Number) sizeObject;
					Node node = new Node(name+"("+size+unit+")",size,level);
					next(node, list, i,unit);			//继续查找
					root.appendNode(node);
				}else{

					Node node = null;
					//是整数
					if(!((String)sizeObject).contains(".")){
						int size = Integer.parseInt((String)sizeObject);
						node = new Node(name+"("+size+unit+")",size,level);
					}else{
						double size = Double.parseDouble((String)sizeObject);
						node = new Node(name+"("+size+unit+")",size,level);
					}
					next(node, list, i,unit);			//继续查找
					root.appendNode(node);
				}
			}
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject d3Format(JSONArray jsonArray) {
		JSONObject json = new JSONObject();
		
		String title = null;		//取标题
		String unit = null;			//单位
		
		Node root = null;
		for(int r = 0,rLen = jsonArray.size(); r < rLen; r++){
			List<Object> row = (List<Object>) jsonArray.get(r); 
			
			//第一行,取标题、单位
			if(r == 0){
				title =  row.get(1).toString();
				unit = getUnitByTitle(title);
			}else{
				//从第二行开始取数据(根)
				if(r == 1){
					Object o = row.get(0);
					String name = o != null ? o.toString() : "";
					
					Object levelObject = row.get(2);
					int level;
					if(levelObject instanceof Double){
						level = (int) ((Double) levelObject).doubleValue();
					}else{
						level = DataUtil.StringToInt(levelObject.toString());
					}
					
					Object sizeObject = row.get(1);
					if(sizeObject instanceof Double){
						Number size = (Number) sizeObject;
						root = new Node(title+":"+name+"("+size+")",size,level);
					}else{
						String siseStr = sizeObject.toString();
						//是整数
						if(!siseStr.contains(".")){
							int size = Integer.parseInt(siseStr);
							root = new Node(title+":"+name+"("+size+")",size,level);
						}else{
							double size = Double.parseDouble(siseStr);
							root = new Node(title+":"+name+"("+size+")",size,level);
						}
					}
					
					d3FormatNext(root,jsonArray, r,unit);	//获取下一个
					
					break;
				}
			}
		}
		
		if(root == null){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
			return json;
		}
		
		String data = root.toJSONObject().toString();
		json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_OK);
		json.put(Result.JSON_RESULT_MESSAGE, "result.execute.ok");
		json.put("data", data);
		return json;
	}

	@SuppressWarnings("unchecked")
	private void d3FormatNext(Node root, JSONArray jsonArray, int rowNum, String unit) {
		if(root == null)
			return;

		int total = jsonArray.size();
		int rootLevel = root.getLevel();
	
		for(int i = rowNum+1;i<total;i++){
			List<Object> row = (List<Object>) jsonArray.get(i); 
			
			Object o = row.get(0);
			String name = o != null ? o.toString() : "";
			
			Object levelObject = row.get(2);
			int level;
			if(levelObject instanceof Double){
				level = (int) ((Double) levelObject).doubleValue();
			}else{
				level = DataUtil.StringToInt(levelObject.toString());
			}
			
			//一旦大于等于，代表为另外一类
			if(rootLevel >= level)
				break;
			
			if((level == rootLevel+1)){	//找到子节点
				Object sizeObject = row.get(1);
				if(sizeObject instanceof Double){
					Number size = (Number) sizeObject;
					Node node = new Node(name+"("+size+unit+")",size,level);
					d3FormatNext(node, jsonArray, i,unit);			//继续查找
					root.appendNode(node);
				}else{
					Node node = null;
					
					String siseStr = sizeObject.toString();
					//是整数
					if(!siseStr.contains(".")){
						int size = Integer.parseInt(siseStr);
						node = new Node(name+"("+size+unit+")",size,level);
					}else{
						double size = Double.parseDouble(siseStr);
						node = new Node(name+"("+size+unit+")",size,level);
					}
					
					d3FormatNext(node, jsonArray, i,unit);			//继续查找
					root.appendNode(node);
				}
			}
		}
	}
}
