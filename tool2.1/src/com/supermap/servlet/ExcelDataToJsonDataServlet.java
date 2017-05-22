package com.supermap.servlet;

import com.supermap.common.Result;
import com.supermap.http.Parameters;
import com.supermap.service.ExcelDataToJsonDataService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;

/**
 * Excel转json数据
 * 
 * @author Linhao
 *
 */
public class ExcelDataToJsonDataServlet extends AbstractSuperMapServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4612046559748197295L;
	
	private static final String ACTION_ECHARTS_FORMAT = "echarts.format";
	
	private static final String ACTION_D3_FORMAT = "d3.format";

	private static final String ACTION_HIGHCHARTS_FORMAT = "highcharts.format";

	private static final String ACTION_FUSIONCHARTS_FORMAT = "fusioncharts.format";

	@Override
	protected JSONObject action(HttpServletRequest request,
                                HttpServletResponse response, Parameters parameters, String action) {
		JSONObject json = new JSONObject();
		
		if(action == null){
        	json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, "action-"
					+getLocaleString("result.execute.fail.param.null"));
		}else if(action.equals(ACTION_ECHARTS_FORMAT)){
			json = echartsFormat(request, response, parameters);
		}else if(action.equals(ACTION_D3_FORMAT)){
			json = d3Format(request, response, parameters);
		}else if(action.equals(ACTION_HIGHCHARTS_FORMAT)){
			json = highchartsFormat(request, response, parameters);
		}else if(action.equals(ACTION_FUSIONCHARTS_FORMAT)) {
			json = fusionchartsFormat(request, response, parameters);
		}else{
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
            json.put(Result.JSON_RESULT_MESSAGE, "action-"
                    +getLocaleString("result.execute.fail.param.null"));
		}
		
		return json;
	}

	/**
	 * echarts数据转换
	 * 
	 * @param request
	 * @param response
	 * @param parameters
	 * @return
	 */
	private JSONObject echartsFormat(HttpServletRequest request,
                                     HttpServletResponse response, Parameters parameters) {
		JSONObject json = new JSONObject();
		String data = parameters.getParameter("data");
		String type = parameters.getParameter("type");
		
		if(data == null || data.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.param.null")
					+"-data");
			return json;
		}
		
		JSONArray jsonArray = JSONArray.fromObject(data);
		
		json = ExcelDataToJsonDataService.echartsFormat(jsonArray,type);
		json.put(Result.JSON_RESULT_MESSAGE, getLocaleString(json.getString(Result.JSON_RESULT_MESSAGE)));

		return json;
	}

	/**
	 * fusioncharts数据转换
	 *
	 * @param request
	 * @param response
	 * @param parameters
	 * @return
	 */
	private JSONObject fusionchartsFormat(HttpServletRequest request,
                                          HttpServletResponse response, Parameters parameters) {
		JSONObject json = new JSONObject();
		String data = parameters.getParameter("data");
		String type = parameters.getParameter("type");

		if(data == null || data.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.param.null")
					+"-data");
			return json;
		}

		JSONArray jsonArray = JSONArray.fromObject(data);

		json = ExcelDataToJsonDataService.fusionchartsFormat(jsonArray,type);
		json.put(Result.JSON_RESULT_MESSAGE, getLocaleString(json.getString(Result.JSON_RESULT_MESSAGE)));

		return json;
	}
	/**
	 * d3数据转换
	 * @param request
	 * @param response
	 * @param parameters
	 * @return
	 */
	private JSONObject d3Format(HttpServletRequest request,
                                HttpServletResponse response, Parameters parameters) {
		JSONObject json = new JSONObject();
		
		String data = parameters.getParameter("data");
		String type = parameters.getParameter("type");
		
		if(data == null || data.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.param.null")
					+"-data");
			return json;
		}
		
		if(type == null || type.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.param.null")
					+"-type");
			return json;
		}
		
		JSONArray jsonArray = JSONArray.fromObject(data);
		
		json = ExcelDataToJsonDataService.d3Format(jsonArray, type);
		json.put(Result.JSON_RESULT_MESSAGE, getLocaleString(json.getString(Result.JSON_RESULT_MESSAGE)));
		
		return json;
	}

	/**
	 * highcharts数据转换
	 *
	 * @param request
	 * @param response
	 * @param parameters
	 * @return
	 */
	private JSONObject highchartsFormat(HttpServletRequest request,
                                        HttpServletResponse response, Parameters parameters) {
		JSONObject json = new JSONObject();
		String data = parameters.getParameter("data");

		if(data == null || data.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.param.null")
					+"-data");
			return json;
		}

		JSONArray jsonArray = JSONArray.fromObject(data);

		json = ExcelDataToJsonDataService.highchartsFormat(jsonArray);
		json.put(Result.JSON_RESULT_MESSAGE, getLocaleString(json.getString(Result.JSON_RESULT_MESSAGE)));

		return json;
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
