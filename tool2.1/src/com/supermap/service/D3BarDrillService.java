package com.supermap.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
public class D3BarDrillService extends D3Service {
	@Override
	public Result createJsonFileByExcel(File excelFile, File dir,
			String fileName) {

		Result result = new Result();

		List<List<Object>> list = parseExcel(excelFile, result);
		if (list == null) {
			result.setMessage("result.execute.fail.file.no.parse");
			return result;
		}

		JSONObject json = new JSONObject();
		List<Map<String, String>> heads = null; // 存储指标的单位和名称
		Node[] datas = null; // 存储数据

		for (int r = 0, rLen = list.size(); r < rLen; r++) {
			List<Object> row = list.get(r);
			int cLen = row.size(); // 列长

			// 第一行,取标题、单位
			if (r == 0) {
				// 至少包括，名称和级别
				if (row == null || cLen < 2) {
					result.setMessage("result.execute.fail.file.no.create");
					return result;
				}

				heads = new ArrayList<Map<String, String>>();
				// 取出指标头（第一列和最后一列不取）
				for (int c = 1; c < cLen - 1; c++) {
					String title = (String) row.get(c);
					String unit = getUnitByTitle(title);

					Map<String, String> head = new HashMap<String, String>();
					head.put("data_title", title);
					head.put("data_unit", unit);
					heads.add(head);
				}

				// 初始化数组
				int headLen = heads.size();
				datas = new Node[headLen];
			} else {
				// 从第二行开始取数据(根)
				if (r == 1) {
					if (heads != null && heads.size() > 0) {

						String name = (String) row.get(0);
						name = name != null ? name : "";
						
						Object levelObject = row.get(cLen - 1);
						int level;
						if(levelObject instanceof Double){
							level = (int) ((Double) levelObject).doubleValue();
						}else{
							level = DataUtil.StringToInt((String)levelObject);
						}

						// 取出数据
						for (int c = 1; c < cLen - 1; c++) {
							String title = heads.get(c - 1).get("data_title");
							
							Object sizeObject = row.get(c);
							if(sizeObject instanceof Double){
								Number size = (Number) sizeObject;
								datas[c - 1] = new Node(title + ":" + name + "("
										+ size + ")", size, level);
							}else{
								double size = Double.parseDouble((String)sizeObject);
								datas[c - 1] = new Node(title + ":" + name + "("
										+ size + ")", size, level);
							}
						}

						next(datas, list, r, heads); // 获取下一个

						break;
					}
				}//end if (r == 1) 
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
				Node node = datas[i];
				json.put("data"+(i+1)+"_data", node.toJSONObject());
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
	 * 
	 * 找下一个节点
	 * 
	 * @param root
	 *            root 根
	 * @param list
	 *            excel 数据
	 * @param rowNum
	 *            当前行数（0开始）
	 * @param heads
	 * @return 根节点
	 */
	protected void next(Node[] datas, List<List<Object>> list, int rowNum,
			List<Map<String, String>> heads) {
		if (datas == null)
			return;

		int total = list.size();
		int rootLevel = datas[0].getLevel();

		for (int i = rowNum + 1; i < total; i++) {
			List<Object> row = list.get(i);
			int cLen = row.size(); // 列长

			String name = (String) row.get(0);
			name = name != null ? name : "";

			Object levelObject = row.get(cLen - 1);
			int level;
			if(levelObject instanceof Double){
				level = (int) ((Double) levelObject).doubleValue();
			}else{
				level = DataUtil.StringToInt((String)levelObject);
			}

			// 一旦大于等于，代表为另外一类
			if (rootLevel >= level)
				break;

			if ((level == rootLevel + 1)) { // 找到子节点

				Node[] nodes = new Node[datas.length];

				// 取出数据
				for (int c = 1; c < cLen - 1; c++) {
					String unit = heads.get(c - 1).get("data_unit");
					
					Object sizeObject = row.get(c);
					if(sizeObject instanceof Double){
						Number size = (Number) sizeObject;
						nodes[c - 1] = new Node(name + "(" + size + unit + ")",
								size, level);
					}else{
						double size = Double.parseDouble((String)sizeObject);
						nodes[c - 1] = new Node(name + "(" + size + unit + ")",
								size, level);
					}
				}

				next(nodes, list, i, heads); // 继续查找

				for (int j = 0, len = nodes.length; j < len; j++) {
					datas[j].appendNode(nodes[j]);
				}
			}
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject d3Format(JSONArray jsonArray) {
		JSONObject json = new JSONObject();
		
		List<Map<String, String>> heads = null; // 存储指标的单位和名称
		Node[] datas = null; // 存储数据

		for (int r = 0, rLen = jsonArray.size(); r < rLen; r++) {
			List<Object> row = (List<Object>) jsonArray.get(r);
			int cLen = row.size(); // 列长

			// 第一行,取标题、单位
			if (r == 0) {
				// 至少包括，名称和级别
				if (row == null || cLen < 2) {
					json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
					json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
					return json;
				}

				heads = new ArrayList<Map<String, String>>();
				// 取出指标头（第一列和最后一列不取）
				for (int c = 1; c < cLen - 1; c++) {
					String title = row.get(c).toString();
					String unit = getUnitByTitle(title);

					Map<String, String> head = new HashMap<String, String>();
					head.put("data_title", title);
					head.put("data_unit", unit);
					heads.add(head);
				}

				// 初始化数组
				int headLen = heads.size();
				datas = new Node[headLen];
			} else {
				// 从第二行开始取数据(根)
				if (r == 1) {
					if (heads != null && heads.size() > 0) {

						String name = row.get(0).toString();
						name = name != null ? name : "";
						
						Object levelObject = row.get(cLen - 1);
						int level;
						if(levelObject instanceof Double){
							level = (int) ((Double) levelObject).doubleValue();
						}else{
							level = DataUtil.StringToInt(levelObject.toString());
						}

						// 取出数据
						for (int c = 1; c < cLen - 1; c++) {
							String title = heads.get(c - 1).get("data_title");
							
							Object sizeObject = row.get(c);
							if(sizeObject instanceof Double){
								Number size = (Number) sizeObject;
								datas[c - 1] = new Node(title + ":" + name + "("
										+ size + ")", size, level);
							}else{
								double size = Double.parseDouble(sizeObject.toString());
								datas[c - 1] = new Node(title + ":" + name + "("
										+ size + ")", size, level);
							}
						}

						d3FormatNext(datas, jsonArray, r, heads); // 获取下一个

						break;
					}
				}//end if (r == 1) 
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
				Node node = datas[i];
				json.put("data"+(i+1)+"_data", node.toJSONObject());
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

	@SuppressWarnings("unchecked")
	private void d3FormatNext(Node[] datas, JSONArray jsonArray, int rowNum,
			List<Map<String, String>> heads) {
		if (datas == null)
			return;

		int total = jsonArray.size();
		int rootLevel = datas[0].getLevel();

		for (int i = rowNum + 1; i < total; i++) {
			List<Object> row = (List<Object>) jsonArray.get(i);
			int cLen = row.size(); // 列长

			String name =  row.get(0).toString();
			name = name != null ? name : "";

			Object levelObject = row.get(cLen - 1);
			int level;
			if(levelObject instanceof Double){
				level = (int) ((Double) levelObject).doubleValue();
			}else{
				level = DataUtil.StringToInt(levelObject.toString());
			}

			// 一旦大于等于，代表为另外一类
			if (rootLevel >= level)
				break;

			if ((level == rootLevel + 1)) { // 找到子节点

				Node[] nodes = new Node[datas.length];

				// 取出数据
				for (int c = 1; c < cLen - 1; c++) {
					String unit = heads.get(c - 1).get("data_unit");
					
					Object sizeObject = row.get(c);
					if(sizeObject instanceof Double){
						Number size = (Number) sizeObject;
						nodes[c - 1] = new Node(name + "(" + size + unit + ")",
								size, level);
					}else{
						double size = Double.parseDouble(sizeObject.toString());
						nodes[c - 1] = new Node(name + "(" + size + unit + ")",
								size, level);
					}
				}

				d3FormatNext(nodes, jsonArray, i, heads); // 继续查找

				for (int j = 0, len = nodes.length; j < len; j++) {
					datas[j].appendNode(nodes[j]);
				}
			}
		}
	}

}
