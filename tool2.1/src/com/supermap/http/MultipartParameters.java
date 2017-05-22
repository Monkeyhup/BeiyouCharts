package com.supermap.http;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.supermap.util.DataUtil;
import com.supermap.util.StringHashUtil;


/**
 * 二进制型的http请求参数的处理类（通过重载Parameters类）
 * <br/>
 * 例如：“&ltform enctype="multipart/form-data">”形式提交的参数
 * 
 * @author Linhao-2014-01-02
 * @version 1.0
 *
 */
public class MultipartParameters extends Parameters {
	/**
	 * 
	 */
	private List<FileItem> fileItems = null;
	
	/**
	 * 构造函数
	 * @param request
	 */
	public MultipartParameters(HttpServletRequest request){
		super(request);
	}
	
	/**
	 * 获取“&ltform enctype="multipart/form-data">”形式提交的参数项
	 * 
	 * @return 参数项
	 */
	@SuppressWarnings("unchecked")
	public List<FileItem> getFileItems(){
		if(fileItems != null)
			return fileItems;
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		if(isMultipart){
			FileItemFactory factory = new DiskFileItemFactory();
			ServletFileUpload upload = new ServletFileUpload(factory);
			upload.setHeaderEncoding(CHARSET);
			
			try {
				fileItems = upload.parseRequest(request);
			} catch (FileUploadException e) {
				e.printStackTrace();
			}
		}//end if(isMultipart)
			
		return fileItems;
	}
	
	/**
	 * 参数中是否包含指定的键
	 * 
	 * @param key
	 * 			键
	 * @return http请求参数包含指定的键返回true,否则返回false
	 */
	public boolean containsKey(String key){
		if(key == null)
			return false;
		List<FileItem> fileItems= getFileItems();
		
		if(fileItems != null && fileItems.size() > 0){
			for (FileItem fileItem : fileItems) {
				if(fileItem == null || !fileItem.isFormField())
					continue;
				String fieldName= fileItem.getFieldName();
				if(fieldName != null && fieldName.equals(key))
					return false;
			}//end for (FileItem fileItem : fileItems)  
			return false;
		}else {
			return super.containsKey(key);
		}//end if(fileItems != null && fileItems.size() > 0) else
	}
	
	/**
	 * 通过key获取其参数value,value的多个和值用“；”隔开
	 * <p style='color:#f00;'>
	 * 		例如：id = aa;bb;cc
	 * </p>
	 * <p style='color:#f00;'>
	 * 	注意：只获取普通字符串参数，无法获取上传的文件流
	 * </p>
	 * @param key
	 * @return
	 */
	public String getParameter(String key){
		List<FileItem> fileItems= getFileItems();
		
		if(fileItems != null && !fileItems.isEmpty()){
			List<String> valueList = new ArrayList<String>();
			for(FileItem f : fileItems){
				if(f == null || !f.isFormField())
					continue;
				String fieldName = f.getFieldName();
				if(fieldName != null && fieldName.equals(key)){
					try {
						String value = f.getString(CHARSET);
						if(value != null && !value.isEmpty() && !value.equals("null"))
							valueList.add(value);
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}
				}//end if(fieldName != null && fieldName.equals(key))
			}//end for(FileItem f : fileItems)
			
			int size = valueList.size();
			if(size > 0){
				StringBuilder sb = new StringBuilder();
				boolean delim = false;	//判断是否为第一个
				for (String value : valueList) {
					if (delim)
						sb.append(";");
					else 
						delim = true;
					sb.append(value);
				}//end for (String value : valueList) 
				return sb.toString();
			}else
				return null;
		}else{
			return super.getParameter(key);
		}//end //if(fileItems != null && !fileItems.isEmpty()) else
	}
	
	/**
	 * 获取所有的请求参数的参数名
	 * 
	 * <p style='color:#f00;'>
	 * 	注意：只获取普通字符串参数，无法获取上传的文件流
	 * </p>
	 * @return 所有的请求参数的参数名
	 */
	public String[] getParameterNames(){
		List<FileItem> fileItems= getFileItems();
		
		if(fileItems != null && !fileItems.isEmpty()){
			List<String> valueList = new ArrayList<String>();
			for(FileItem f : fileItems){
				if(f == null || !f.isFormField())
					continue;
				String fieldName = f.getFieldName();
				if(fieldName != null && !fieldName.isEmpty()){
					valueList.add(fieldName);
				}//end if(fieldName != null && fieldName.equals(key))
			}//end for(FileItem f : fileItems)
			return valueList.toArray(new String[valueList.size()]);
		}else{
			return super.getParameterNames();
		}//end //if(fileItems != null && !fileItems.isEmpty()) else
	}
	
	/**
	 *	获取所有的参数,(一个key若有多个value,用“；”隔开)
	 * <p style='color:#f00;'>
	 * 		例如：id = aa;bb;cc  
	 *      <br/> &nbsp;&nbsp;&nbsp;&nbsp;
	 *      	  &nbsp;&nbsp;&nbsp;
	 *      name=example
	 * </p>
	 * <p style='color:#f00;'>
	 * 	注意：只获取普通字符串参数，无法获取上传的文件流
	 * </p>
	 * @param request
	 */
	public StringHashUtil getAllParameters(){
		List<FileItem> fileItems= getFileItems();
		
		if(fileItems != null && !fileItems.isEmpty()){
			StringHashUtil parameters = new StringHashUtil();
			for(FileItem f : fileItems){
				if(f == null || !f.isFormField())
					continue;
				String fieldName = f.getFieldName();
				if(fieldName != null && !fieldName.isEmpty()){
					try {
						String value = f.getString(CHARSET);
						if(value != null && !value.isEmpty() && !value.equals("null")){
							String s = parameters.get(fieldName);	//通过key判断是否已经存在
							String[] array = DataUtil.StringToArray(s, ";");
							if(array != null && array.length > 0){
								for(String string : array){
									if(value.equals(string))	//value值已经存在
										continue;
								}
								parameters.put(fieldName,new StringBuilder(s).append(";")
										.append(value).toString());
							}else{
								parameters.put(fieldName, value);
							}//end if(array != null && array.length > 0) else
						}//end if(value != null && !value.isEmpty() && !value.equals("null"))
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}
				}//end if(fieldName != null && fieldName.equals(key))
			}//end for(FileItem f : fileItems)
			return parameters;
		}else{
			return super.getAllParameters();
		}//end //if(fileItems != null && !fileItems.isEmpty()) else
	}
	
	/**
	 * 通过key获取value参数数组（可能为null，一个或者多个）
	 * <p style='color:#f00;'>
	 * 	注意：只获取普通字符串参数，无法获取上传的文件流
	 * </p>
	 * @param key
	 * @return
	 */
	public String[] getParameterValues(String key){
		List<FileItem> fileItems= getFileItems();
		
		if(fileItems != null && !fileItems.isEmpty()){
			List<String> values = new ArrayList<String>();
			for(FileItem f : fileItems){
				if(f == null || !f.isFormField())
					continue;
				String fieldName = f.getFieldName();
				if(fieldName != null && !parameter.containsKey(fieldName) && fieldName.equals(key)){
					try {
						String value = f.getString(CHARSET);
						if(value != null && !value.isEmpty() && !value.equals("null")){
							if(!values.contains(value))	//防止重复添加
								values.add(value);
						}//end if(value != null && !value.isEmpty() && !value.equals("null"))
					}catch(UnsupportedEncodingException e){
						e.printStackTrace();
					}
				}//end if(fieldName != null && !parameter.containsKey(fieldName) && fieldName.equals(key))
			}//end for(FileItem f : fileItems)
			
			int size = values.size();
			if(size > 0)
				return values.toArray(new String[size]);
			else 
				return null;
		}else
			return super.getParameterValues(key);
		
	}
	
	/**
	 * 通过键值获取指定的参数项
	 * 
	 * @param key
	 * 			键
	 * @return	指定键的参数项，可能为null
	 */
	public FileItem getFileItem(String key){
		List<FileItem> fileItems = getFileItems();
		if(fileItems != null && !fileItems.isEmpty()){
			for(FileItem f : fileItems){
				if(f == null || f.isFormField())
					continue;
				String fieldName = f.getFieldName();
				if(fieldName != null && fieldName.equals(key))
					return f;
			}
		}//end if(fileItems != null && !fileItems.isEmpty())
		return null;
	}
	
	/**
	 * 获取参数二进制流
	 * <p style='color:#f00;'>
	 * 	例如：文件流
	 * </p>
	 * @param key
	 * 			键
	 * @return 二进制流
	 */
	public InputStream getInputStream(String key){
		InputStream is = null;
		
		if(key != null){
			List<FileItem> fileItems = getFileItems();
			if(fileItems != null && !fileItems.isEmpty()){
				for(FileItem f : fileItems){
					if(f == null || f.isFormField())
						continue;
					String fieldName = f.getFieldName();
					if(fieldName != null && fieldName.equals(key)){
						try {
							is = f.getInputStream();
							break;
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
				}//end for(FileItem f : fileItems)
			}//end if(fileItems != null && !fileItems.isEmpty())
		}//end if(key != null)
		
		return is;
	}
}
