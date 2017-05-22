package com.supermap.controller;

import javax.servlet.http.HttpServletRequest;

import com.supermap.common.CGalleryUser;
import com.supermap.modal.TGalleryUser;
import com.supermap.result.Result;
import com.supermap.system.AuthManager;

import java.io.File;
import java.util.StringTokenizer;

/**
 * 基础接口
 * <p style="font-weight:bold;">
 * 		说明：提供基本用户信息方法
 * </p>
 * @author Linhao
 *
 */
public abstract class BaseController {
	/**全局判断是否初始化构造方法*/
	private static boolean isHasInit = false;

	/**
	 * tomcat 下的root 本地目录
	 */
	static String tomcatRootLocalPath = null;

	/**
	 * tomcat 下的root url目录
	 */
	static String tomcatRootUrlPath = null;

	/**
	 * http请求
	 */
	static HttpServletRequest request = null;

	/**
	 * 上传文件图库首页图片存放相对本地目录
	 */
	public static final String UPLOAD_PICTURE_FILE_DIR = "uploads"+File.separator+"picture";

	/**
	 * 无参构造方法，spring扫面controller时会执行
	 */
	public BaseController(){
		if(!isHasInit){
			isHasInit = true;
			//授权认证
			AuthManager authManager = AuthManager.getInstance(null);
			authManager.authValidate();
		}
	};


	
	/**
	 * 获取用户的登录信息
	 * @param request
	 * 			http请求
	 * @return 当前登录的用户信息，未登录返回null
	 */
	protected TGalleryUser getSessionUser(HttpServletRequest request){
		return (TGalleryUser)request.getSession().getAttribute(CGalleryUser.USER_SESSION_KEY);
	}
	
	/**
	 * 设置用户登录信息
	 * @param request
	 * @param tGalleryUser
	 */
	protected void setSessionUser(HttpServletRequest request,TGalleryUser tGalleryUser){
		request.getSession().setAttribute(CGalleryUser.USER_SESSION_KEY, tGalleryUser);
	}
	
	/**
     * 删除session里的用户信息
     *
     * @param request
     *            http 请求
     */
    public void removeSessionUser(HttpServletRequest request) {
        request.getSession().removeAttribute(CGalleryUser.USER_SESSION_KEY);
    }
	
	/**
	 * 取得未登录的信息
	 * 	
	 * @return
	 */
	protected Result getNoLoginResult() {
		return new Result(Result.RESULT_EXCUTE_FAIL,"用户未登录或者已登录超时！");
	}

	/**
	 * 获取tomcat 下的root 本地目录
	 *
	 * @return
	 */
	public static String getTomcatRootLocalPath(HttpServletRequest request) {
		if (tomcatRootLocalPath != null)
			return tomcatRootLocalPath;

		tomcatRootLocalPath = getRealPath(request, null);
		if (tomcatRootLocalPath != null) {
			File file = new File(tomcatRootLocalPath);
			String parent = file.getParent();
			tomcatRootLocalPath = parent + File.separator + "ROOT"
					+ File.separator;
		}

		return tomcatRootLocalPath;
	}

	/**
	 * 获取tomcat 下的root 本地目录(不带ROOT)
	 *
	 * @return
	 */
	public static String getTomcatRootUrlPath() {
		// if(tomcatRootUrlPath != null)
		// return tomcatRootUrlPath;

		StringBuffer web = request.getRequestURL();
		tomcatRootUrlPath = getUrlPath(request, null);
		if (web != null) {
			String url = web.toString();

			int loc = url.indexOf(tomcatRootUrlPath);
			if (loc > -1) {
				tomcatRootUrlPath = url.substring(0, loc);
				if (!tomcatRootUrlPath.endsWith("/"))
					tomcatRootUrlPath += "/";
			}
		}
		return tomcatRootUrlPath;
	}


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

		String fullServerRootPath = request.getSession().getServletContext().getRealPath("../ROOT/");	//完整的服务器的根目录
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

}
