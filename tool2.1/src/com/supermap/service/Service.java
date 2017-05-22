package com.supermap.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import com.supermap.common.Result;
import com.supermap.util.ExcelUtil;

/**
 * 基本服务
 * 
 * @author Linhao
 *
 */
public abstract class Service {
	/**
	 * 服务所在的包名
	 */
	public static final String SERVICE_PACKAGE_NAME = "com.supermap.service";
	
	/**
	 * 上传文件excel 存放相对本地目录
	 */
	public static final String UPLOAD_EXCEL_FILE_DIR = "uploads"+File.separator+"excel";
	
	/**
	 * 创建的json文件 存放相对本地目录
	 */
	public static final String CREATE_JSON_FILE_DIR = "uploads"+File.separator+"json";
	
	/**
	 * 创建的json文件的相对url目录
	 */
	public static final String CREATE_JSON_FILE_URL_DIR = "uploads/json/";
	
	
	/**
	 * 将excel 文件生成json文件
	 * 
	 * @param excelFile
	 * 			excel 文件
	 * @param dir	
	 * 			保存的目录
	 * @param fileName
	 * 			文件名
	 * @return
	 */
	public abstract Result createJsonFileByExcel(File excelFile,File dir,String fileName);

	
	/**
	 * excel 解析 (默认第一个sheet)
	 * 
	 * @param excelFile
	 * 			excel 文件
	 * @param result
	 * 			result错误消息监听
	 * @return
	 */
	public List<List<Object>> parseExcel(File excelFile,Result result) {
		String sheetName = null;
		
		if(result == null)
			result = new Result();
		
		if(excelFile == null || !excelFile.exists()){
			result.setMessage("result.execute.fail.file.no.exist");
			return null;
		}
		
		String path = excelFile.getParent();
		if(!path.endsWith(File.separator))
			path += File.separator;
		
		String fileName = excelFile.getName();
		// 获得excel表中的工作铺，返回
		List<Map<String, String>> list = ExcelUtil.getSheets(
				path, fileName );
		
		if(list == null){
			result.setMessage("result.execute.fail.file.no.parse");
			return null;
		}
		
		
		// Map<String, String> map 为初始工作铺
		for (Map<String, String> map : list) {
			sheetName = map.get("name");
			break;
		}
		
		List<List<Object>> re = null;
		if(sheetName != null){
			re = ExcelUtil.readExcel(path, 
					fileName, sheetName, true);
		}else{
			result.setMessage("result.execute.fail.file.no.parse");
		}
		
		return re;
	}
	
	/**
	 * 保存文件
	 * 
	 * @param is
     *
	 * @return
	 */
	public Result saveFile(InputStream is, File dir, String fileName) {
		Result result = new Result();
		
		if(is == null || dir == null || fileName == null){
			result.setMessage("result.execute.fail");
			return result;
		}
		
		if(!dir.exists())
			dir.mkdirs();
		
		File file = new File(dir, fileName);
		if(file.exists())
			file.delete();
		
		try {
			if(is.available() <= 0){
				result.setMessage("result.execute.fail.file.no.avail");
				return result;
			}
		} catch (IOException e) {
			result.setMessage("result.execute.fail.file.no.avail");
			return result;
		}
		
		
		FileOutputStream os;
		try {
			os = new FileOutputStream(file);
		} catch (FileNotFoundException e) {
			result.setMessage("result.execute.fail");
			return result;
		}

		if (os != null) {
			byte[] buffer = new byte[4 * 1024];
			try {
				while (is.read(buffer) != -1) {
					os.write(buffer);
				}// end while
				result.setCode(Result.RESULT_EXECUTE_OK);
				result.setMessage("result.execute.ok");
			} catch (IOException e) {
				result.setMessage("result.execute.fail");
			}
			
			try {
				os.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}// end if(os != null)
		
		return result;
	}

	/**
	 * 将字符串写入json文件
	 * 
	 * @param jsonFile
	 * @param content
	 * @throws IOException
	 */
	protected void writeFile(File jsonFile, String content) throws IOException {
		if(jsonFile.exists())
			jsonFile.delete();
		
		File dir = new File(jsonFile.getParent());
		if(!dir.exists())
			dir.mkdirs();
		
		jsonFile.createNewFile();
		
		OutputStream out = new FileOutputStream(jsonFile);
		out.write(content.getBytes("UTF-8"));
		if (out != null) {
			out.close();
		}
	}
	
	/**
	 * 取得当前时间的年月日时分秒_毫秒
	 * 
	 * @return
	 */
	public String getCurrentYYYYMMddHHmmSS(){
		String re = null;
		
		Calendar calen = Calendar.getInstance();
		// 得到年
		int year = calen.get(Calendar.YEAR);
		// 得到月
		int month = calen.get(Calendar.MONTH)+1;
		// 得到日
		int date = calen.get(Calendar.DATE);
		// 得到小时
		int hour = calen.get(Calendar.HOUR);
		// 得到分钟
		int minute = calen.get(Calendar.MINUTE);
		// 得到秒
		int second = calen.get(Calendar.SECOND);
		//毫秒
		int millisecond = calen.get(Calendar.MILLISECOND);
		
		
		StringBuilder sb = new StringBuilder();
		sb.append(year);
		sb.append(month < 10 ? ("0"+month) : (""+month));
		sb.append(date < 10 ? ("0"+date) : (""+date));
		sb.append(hour < 10 ? ("0"+hour) : (""+hour));
		sb.append(minute < 10 ? ("0"+minute) : (""+minute));
		sb.append(second < 10 ? ("0"+second) : (""+second));
		
		sb.append("_");
		sb.append(""+millisecond);
		
		re = sb.toString();
		
		return re;
	}
	
	/**
	 * 从括号（）中获取指标单位
	 * 
	 * @param title
	 * @return
	 */
	public String getUnitByTitle(String title){
		String re = null;
		
		if(title != null){
			int loc1 = title.lastIndexOf("(");
			int loc2 = -1;
			if(loc1 == -1){
				loc1 = title.lastIndexOf("（");
				if(loc1 != -1){
					loc2 = title.lastIndexOf("）");
				}
			}else{
				loc2 = title.lastIndexOf(")");
			}
			
			if(loc1 != -1 && loc2 != -1 && loc1 < loc2){
				re = title.substring(loc1+1,loc2);
			}
		}
			
		return re;
	}
	
	
}
