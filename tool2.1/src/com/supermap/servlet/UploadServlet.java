//package com.supermap.servlet;
//
//import com.supermap.common.Result;
//import com.supermap.http.MultipartParameters;
//import com.supermap.http.Parameters;
//import com.supermap.service.*;
//import com.supermap.util.DataUtil;
//import net.sf.json.JSONObject;
//import org.apache.commons.fileupload.FileItem;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.File;
//import java.io.IOException;
//import java.io.InputStream;
package com.supermap.servlet;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;

import net.sf.json.JSONObject;

import com.supermap.common.Result;
import com.supermap.http.MultipartParameters;
import com.supermap.http.Parameters;
import com.supermap.service.D3Service;
import com.supermap.service.D3ServiceFactory;
import com.supermap.service.EchartsService;
import com.supermap.service.EchartsServiceFactory;
import com.supermap.service.FusionchartsService;
import com.supermap.service.FusionchartsServiceFactory;
import com.supermap.service.Service;
import com.supermap.util.DataUtil;
import com.supermap.service.HighchartsService;
/**
 * 上传文件servlet
 * 
 * @author Linhao
 *
 */
public class UploadServlet extends AbstractSuperMapServlet {

	private static final long serialVersionUID = 3355488964008163388L;
	
	protected static final String ACTION_D3 = "d3";
	
	protected static final String ACTION_ECHARTS = "echarts";

	protected static final String ACTION_HIGHCHARTS = "highcharts";

	protected static final String ACTION_FUSIONCHARTS = "fusioncharts";

	@Override
	protected JSONObject action(HttpServletRequest request,
                                HttpServletResponse response, Parameters parameters, String action) {
		JSONObject json = new JSONObject();
		
		boolean isMulti = parameters instanceof MultipartParameters;
        if(!isMulti){
        	json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
            json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.isnomulti"));
            return json;
        }
		
		if(action == null){
        	json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, "action-"
					+getLocaleString("result.execute.fail.param.null"));
		}else if(action.equals(ACTION_D3)){
			json = d3Action(request, response, parameters);
		}else if(action.equals(ACTION_ECHARTS)){
			json = echartAction(request, response, parameters);
		}else if(action.equals(ACTION_HIGHCHARTS)){
			json = highchartAction(request, response, parameters);
		}else if(action.equals(ACTION_FUSIONCHARTS)) {
			json = fusionchartAction(request, response, parameters);
		}else{
        	json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
            json.put(Result.JSON_RESULT_MESSAGE, "action-"
                    +getLocaleString("result.execute.fail.param.null"));
        }
		
		return json;
	}
	
	/**
	 * echart 
	 * 
	 * @param request
	 * @param response
	 * @param parameters
	 * @return
	 */
	private JSONObject echartAction(HttpServletRequest request,
                                    HttpServletResponse response, Parameters parameters) {
		JSONObject json = new JSONObject();
		
		String chartTypeChart = parameters.getParameter("chart-type-chart");
		if(chartTypeChart == null || chartTypeChart.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.param.null")
					+"-chart-type-chart");
			return json;
		}

		EchartsService service = EchartsServiceFactory.getServiceInstance(chartTypeChart);
		
		FileItem fileItem = ((MultipartParameters)parameters).getFileItem("file");
		if(fileItem != null){
			String fileName = fileItem.getName();
			String suffix = DataUtil.getFileNameSuffix(fileName);
			if(suffix != null && (suffix.equalsIgnoreCase("xls") ||
					suffix.equalsIgnoreCase("xlsx"))){
				try {
					InputStream is = fileItem.getInputStream();
					String current = service.getCurrentYYYYMMddHHmmSS();
					String newExcelName = "echarts_excel_"+current+"."+suffix;
					String excelDir =  getTomcatRootLocalPath()+ Service.UPLOAD_EXCEL_FILE_DIR;
					Result result = service.saveFile(is, new File(excelDir),newExcelName);
					System.out.print(getTomcatRootLocalPath());
					if(result != null){
						result.setMessage(getLocaleString(result.getMessage()));
						json = result.toJSONObject();
						if(result.getCode() == Result.RESULT_EXECUTE_OK){
							String createJsonName = "echarts_json_"+current+".json";
							String jsonDir = getTomcatRootLocalPath()+ Service.CREATE_JSON_FILE_DIR;

							result = new Result();
							result = service.createJsonFileByExcel(new File(excelDir,newExcelName),
										new File(jsonDir), createJsonName);
							if(result != null){
								result.setMessage(getLocaleString(result.getMessage()));
								json = result.toJSONObject();
								json.put("chartTypeChart", chartTypeChart);
								json.put("fileName", createJsonName);
								//获取exce元数据
								json.put("excelFileName", service.parseExcel(new File(excelDir,newExcelName), new Result()));
							}else{
								json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
								json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.avail"));
							}
						}
					}
				} catch (IOException e) {
					json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
					json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.avail"));
				}
			}else{
				json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
				json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.lagel"));
			}
		}else{
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.no.file"));
		}
		
		return json;
	}

	/**
	 * fusionchart
	 *
	 * @param request
	 * @param response
	 * @param parameters
	 * @return
	 */
	private JSONObject fusionchartAction(HttpServletRequest request,
                                         HttpServletResponse response, Parameters parameters) {
		JSONObject json = new JSONObject();

		String chartTypeChart = parameters.getParameter("chart-type-chart");
		if(chartTypeChart == null || chartTypeChart.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.param.null")
					+"-chart-type-chart");
			return json;
		}

		FusionchartsService service = FusionchartsServiceFactory.getServiceInstance(chartTypeChart);

		FileItem fileItem = ((MultipartParameters)parameters).getFileItem("file");
		if(fileItem != null){
			String fileName = fileItem.getName();
			String suffix = DataUtil.getFileNameSuffix(fileName);
			if(suffix != null && (suffix.equalsIgnoreCase("xls") ||
					suffix.equalsIgnoreCase("xlsx"))){
				try {
					InputStream is = fileItem.getInputStream();
					String current = service.getCurrentYYYYMMddHHmmSS();
					String newExcelName = "fusioncharts_excel_"+current+"."+suffix;
					String excelDir =  getTomcatRootLocalPath()+ Service.UPLOAD_EXCEL_FILE_DIR;
					Result result = service.saveFile(is, new File(excelDir),newExcelName);
					System.out.print(getTomcatRootLocalPath());
					if(result != null){
						result.setMessage(getLocaleString(result.getMessage()));
						json = result.toJSONObject();
						if(result.getCode() == Result.RESULT_EXECUTE_OK){
							String createJsonName = "fusioncharts_json_"+current+".json";
							String jsonDir = getTomcatRootLocalPath()+ Service.CREATE_JSON_FILE_DIR;

							result = new Result();
							result = service.createJsonFileByExcel(new File(excelDir,newExcelName),
									new File(jsonDir), createJsonName);
							if(result != null){
								result.setMessage(getLocaleString(result.getMessage()));
								json = result.toJSONObject();
								json.put("chartTypeChart", chartTypeChart);
								json.put("fileName", createJsonName);
								//获取exce元数据
								json.put("excelFileName", service.parseExcel(new File(excelDir,newExcelName), new Result()));
							}else{
								json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
								json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.avail"));
							}
						}
					}
				} catch (IOException e) {
					json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
					json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.avail"));
				}
			}else{
				json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
				json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.lagel"));
			}
		}else{
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.no.file"));
		}

		return json;
	}

	/**
	 * d3
	 * 
	 * @param request
	 * @param response
	 * @param parameters
	 * @return
	 */
	private JSONObject d3Action(HttpServletRequest request,
                                HttpServletResponse response, Parameters parameters){
		JSONObject json = new JSONObject();
		
		String chartTypeChart = parameters.getParameter("chart-type-chart");
		if(chartTypeChart == null || chartTypeChart.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.param.null")
					+"-chart-type-chart");
			return json;
		}
		
		D3Service service = D3ServiceFactory.getServiceInstance(chartTypeChart);
		if(service != null){
			FileItem fileItem = ((MultipartParameters)parameters).getFileItem("file");
			if(fileItem != null){
				String fileName = fileItem.getName();
				String suffix = DataUtil.getFileNameSuffix(fileName);
				if(suffix != null && (suffix.equalsIgnoreCase("xls") ||
						suffix.equalsIgnoreCase("xlsx"))){
					try {
						InputStream is = fileItem.getInputStream();
						String current = service.getCurrentYYYYMMddHHmmSS();
						String newExcelName = "d3_excel_"+current+"."+suffix;
						String excelDir =  getTomcatRootLocalPath()+ Service.UPLOAD_EXCEL_FILE_DIR;
						Result result = service.saveFile(is, new File(excelDir),newExcelName);
						if(result != null){
							result.setMessage(getLocaleString(result.getMessage()));
							json = result.toJSONObject();
							if(result.getCode() == Result.RESULT_EXECUTE_OK){
								String createJsonName = "d3_json_"+current+".json";
								String jsonDir = getTomcatRootLocalPath()+ Service.CREATE_JSON_FILE_DIR;

								result = new Result();
								result = service.createJsonFileByExcel(new File(excelDir,newExcelName),
										new File(jsonDir), createJsonName);
								if(result != null){
									result.setMessage(getLocaleString(result.getMessage()));
									json = result.toJSONObject();
									json.put("chartTypeChart", chartTypeChart);
									json.put("fileName", createJsonName);
									//获取exce元数据
									json.put("excelFileName", service.parseExcel(new File(excelDir,newExcelName), new Result()));
								}else{
									json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
									json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.avail"));
								}
							}
						}
					} catch (IOException e) {
						json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
						json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.avail"));
					}
				}else{
					json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
					json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.lagel"));
				}
			}else{
				json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
				json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.no.file"));
			}
		}else{
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.no.service"));
		}
		
		return json;
	}

	/**
	 * highcharts
	 *
	 * @param request
	 * @param response
	 * @param parameters
	 * @return
	 */
	private JSONObject highchartAction(HttpServletRequest request,
                                       HttpServletResponse response, Parameters parameters) {
		JSONObject json = new JSONObject();

		String chartTypeChart = parameters.getParameter("chart-type-chart");
		if(chartTypeChart == null || chartTypeChart.isEmpty()){
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.param.null")
					+"-chart-type-chart");
			return json;
		}

		Service service = new HighchartsService();

		FileItem fileItem = ((MultipartParameters)parameters).getFileItem("file");
		if(fileItem != null){
			String fileName = fileItem.getName();
			String suffix = DataUtil.getFileNameSuffix(fileName);
			if(suffix != null && (suffix.equalsIgnoreCase("xls") ||
					suffix.equalsIgnoreCase("xlsx"))){
				try {
					InputStream is = fileItem.getInputStream();
					String current = service.getCurrentYYYYMMddHHmmSS();
					String newExcelName = "highcharts_excel_"+current+"."+suffix;
					String excelDir =  getTomcatRootLocalPath()+ Service.UPLOAD_EXCEL_FILE_DIR;
					Result result = service.saveFile(is, new File(excelDir),newExcelName);
					if(result != null){
						result.setMessage(getLocaleString(result.getMessage()));
						json = result.toJSONObject();
						if(result.getCode() == Result.RESULT_EXECUTE_OK){
							String createJsonName = "highcharts_json_"+current+".json";
							String jsonDir = getTomcatRootLocalPath()+ Service.CREATE_JSON_FILE_DIR;

							result = new Result();
							result = service.createJsonFileByExcel(new File(excelDir,newExcelName),
									new File(jsonDir), createJsonName);
							if(result != null){
								result.setMessage(getLocaleString(result.getMessage()));
								json = result.toJSONObject();
								json.put("chartTypeChart", chartTypeChart);
								json.put("fileName", createJsonName);
								//获取exce元数据
								json.put("excelFileName", service.parseExcel(new File(excelDir,newExcelName), new Result()));
							}else{
								json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
								json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.avail"));
							}
						}
					}
				} catch (IOException e) {
					json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
					json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.avail"));
				}
			}else{
				json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
				json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.file.no.lagel"));
			}
		}else{
			json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.put(Result.JSON_RESULT_MESSAGE, getLocaleString("result.execute.fail.no.file"));
		}

		return json;
	}

}
