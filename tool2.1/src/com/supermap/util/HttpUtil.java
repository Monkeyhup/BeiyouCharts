package com.supermap.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;

/**
 * htpp 相关常用
 * 
 * @author Linhao
 *
 */
public class HttpUtil {
	
	
	/**
	 * 获取服务端指定子路径下的真实路径
	 * <p style='color:#f00;'>
	 * 	注意：返回的路径分隔符我为当期操作系统分隔符,window为‘\\’，unix 为‘/’
	 * </p>
	 * @param request
	 * 			http请求
	 * @param childPath
	 * 			子路径
	 * @return 服务器下的真实路径
	 */
	@SuppressWarnings("deprecation")
	public static String getRealPath(HttpServletRequest request,String childPath){
		StringBuilder sb = null;
		String realPath = null;
		if(request == null)
			return realPath;
		String fullServerRootPath = request.getRealPath("/");	//完整的服务器的根目录
		if(childPath == null || childPath.isEmpty())
			return fullServerRootPath;
		if(fullServerRootPath != null && fullServerRootPath.length() >0){
			sb = new StringBuilder();
			sb.append(fullServerRootPath);
			if(!fullServerRootPath.endsWith(File.separator))
				sb.append(File.separator);	//路劲分隔符 window:'\' Linux:'/'
			sb.append(childPath);
			if(childPath.indexOf(".") < 0 && !childPath.endsWith(File.separator))
				sb.append(File.separator);
		}//end if(fullServerRootPath != null)
		if(sb != null)
			realPath = sb.toString();
		return realPath;
	} 
	
	/**
	 * 获取服务端指定子路径下的相对路径
	 * <p style='color:#f00;'>
	 * 	说明：一般用于存入数据库中作为服务器端文件的路径
	 * </p>
	 * @param request
	 * 			http请求
	 * @param childPath
	 * 			子路径
	 * @return 服务器下的相对路径
	 */
	public static String getUrlPath(HttpServletRequest request,String childPath){
		StringBuilder sb = null;
		String urlPath = null;
		if(request == null)
			return urlPath;
		String absoluateServerRootPath = request.getContextPath();	//相对的服务器的根目录
		
		if(absoluateServerRootPath != null && absoluateServerRootPath.length() >0){
			sb = new StringBuilder();
			sb.append(absoluateServerRootPath);
			if(!absoluateServerRootPath.endsWith("/"))
				sb.append("/");
			if(childPath != null && !childPath.isEmpty()){
				sb.append(childPath);
				if(childPath.indexOf(".") < 0 && !childPath.endsWith("/"))
					sb.append("/");
			}//end if(childPath != null && !childPath.isEmpty())
		}else{
			//win server 操作系统无法获取项目名字（request.getContextPath() 返回null）
			//通过 getRealPath() 截取项目名
			String realPath = getRealPath(request, null);	//获取服务器本地路径
			if(realPath != null && !realPath.isEmpty()){
				if(realPath.endsWith(File.separator))
					realPath = realPath.substring(0, realPath.length()-1);
				
				int loc = realPath.lastIndexOf(File.separator);
				if(loc >= 0)
					realPath = realPath.substring(loc+1,realPath.length());
				sb = new StringBuilder();
				if(!realPath.startsWith("/"))
					sb.append("/");
				sb.append(realPath);
				if(!realPath.endsWith("/"))
					sb.append("/");
				if(childPath != null && !childPath.isEmpty()){
					sb.append(childPath);
					if(childPath.indexOf(".") < 0 && !childPath.endsWith("/"))
						sb.append("/");
				}//end if(childPath != null && !childPath.isEmpty())
			}//end if(realPath != null && !realPath.isEmpty())
			
		}//end if(fullServerRootPath != null)

		if(sb != null)
			urlPath = sb.toString();
		return urlPath;
	}

	/**
	 * 获取客户端的ip地址(真实IP)
	 * 
	 * @param request
	 *            http请求
	 * @return 客户端请求ip
	 */
	public static String getRequestIp(HttpServletRequest request) {
		String ip = null;
		if (request == null)
			return ip;
		ip = request.getHeader("x-frowarded-for");
		if (ip == null || ip.length() == 0 || "unkown".equalsIgnoreCase(ip))
			ip = request.getHeader("Proxy-Client-IP");
		if (ip == null || ip.length() == 0 || "unkown".equalsIgnoreCase(ip))
			ip = request.getHeader("WL-Proxy-Client-IP");
		if (ip == null || ip.length() == 0 || "unkown".equalsIgnoreCase(ip))
			ip = request.getRemoteAddr();

		if (ip != null) {
			StringTokenizer st = new StringTokenizer(ip, ",;");
			if (st != null && st.hasMoreTokens())
				ip = st.nextToken();
		}// end if(ip != null)
		return ip;
	}

	/**
	 * 获取客户端操作系统信息
	 * 
	 * @param request
	 * @return
	 */
	public static String getRequestOs(HttpServletRequest request) {
		String os = null;
		if (request != null) {
			os = request.getHeader("User-Agent");
			if (os == null || os.length() == 0 || os.equalsIgnoreCase("unkown"))
				os = request.getHeader("user-agent");
		}// end if(request != null)
		return os;
	}


	/**
	 * 将文件字节数组保存到指定目录和指定文件名的文件（覆盖已存在的文件）
	 * 
	 * @param dir
	 *            文件目录
	 * @param fileName
	 *            保存的文件名
	 * @param bytes
	 *            要保存的文件字节
	 * @return 生成的文件
	 */
	public static File saveFile(File dir, String fileName, byte[] bytes) {
		if (dir == null || !dir.exists() || !dir.isDirectory())
			return null;
		if (fileName == null || fileName.isEmpty())
			return null;
		if (bytes == null || bytes.length <= 1)
			return null;
		File file = new File(dir, fileName);
		if (file.exists()) // 删除已存在的
			file.delete();
		try {
			BufferedOutputStream bos = new BufferedOutputStream(
					new FileOutputStream(file));
			bos.write(bytes);
			bos.close();
		} catch (IOException e) {
			System.out.println("HTTPUtil:" + e.getMessage());
		}
		return file;
	}
}
