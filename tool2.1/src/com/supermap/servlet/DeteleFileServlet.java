package com.supermap.servlet;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import com.supermap.http.Parameters;
import com.supermap.service.DeleteFileServer;
import com.supermap.service.Service;

/**
 * @author weihua 定时删除文件控制器
 */
public class DeteleFileServlet extends AbstractSuperMapServlet {

	private static final long serialVersionUID = -1079915445222889885L;

	/**ROOT相对目录*/
	private static final String ROOT_DIR = "webapps"+File.separator+"ROOT"+File.separator;

	/**删除文件服务*/
	private DeleteFileServer deleteFileServer = null;

	@Override
	public void init(ServletConfig config) throws ServletException {

		String catalinaHome = System.getProperty("catalina.home");
		StringBuilder pathBuilder = new StringBuilder(catalinaHome);
		if (!catalinaHome.endsWith(File.separator)) {
			pathBuilder.append(File.separator);
		}
		pathBuilder.append(ROOT_DIR);

		String filePathExcel = pathBuilder.toString() + Service.UPLOAD_EXCEL_FILE_DIR;
		String filePathJson = pathBuilder.toString() + Service.CREATE_JSON_FILE_DIR;

		if (deleteFileServer == null) {
			deleteFileServer = new DeleteFileServer(filePathExcel, filePathJson);
		}
		//启动服务
		deleteFileServer.startServer();

		super.init(config);
	}

	@Override
	public void destroy() {
		if(deleteFileServer != null){
			//停止服务
			deleteFileServer.stopServer();
			deleteFileServer = null;
		}
		super.destroy();
	}

	/**
	 * http的get请求入口
	 * 
	 * @throws IOException
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		return;
	}

	/**
	 * http的post请求入口
	 * 
	 * @throws IOException
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		return;
	}

	@Deprecated
	@Override
	protected JSONObject action(HttpServletRequest request,
			HttpServletResponse response, Parameters parameters, String action) {
		return null;
	}
}
