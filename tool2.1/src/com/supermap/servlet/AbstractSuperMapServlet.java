package com.supermap.servlet;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.supermap.system.AuthManager;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.supermap.common.Result;
import com.supermap.http.LocaleManager;
import com.supermap.http.MultipartParameters;
import com.supermap.http.Parameters;
import com.supermap.util.HttpUtil;

import net.sf.json.JSONObject;
import net.sf.json.xml.XMLSerializer;

/**
 * servlet 抽象类
 * 
 * @author Linhao
 * 
 */
public abstract class AbstractSuperMapServlet extends HttpServlet {

	private static final long serialVersionUID = 4603882427845799267L;

	/**
	 * 常量标记：返回的数据类型-json(默认返回的格式)
	 */
	public static final String CONSTANT_JSON_DATATYPE = "json";

	/**
	 * 常量标记：返回的数据类型-xml
	 */
	private static final String CONSTANT_XML_DATATYPE = "xml";

	/**
	 * 请求参数名：action,操作名
	 */
	public static final String KEY_ACTION = "action";

	/**
	 * 请求参数名：响应数据格式
	 */
	public static final String KEY_DATATYPE = "dataType";

	/**
	 * 默认的国家化资源文件:result_<font style='color:#f00;'>语言代号</font>_ <font
	 * style='color:#f00;'>国家代号</font>.properties
	 */
	public static final String DEFAULT_RESULT_RESOURCEBUNDLE = "result";

	/**
	 * 构造函数
	 */
	public AbstractSuperMapServlet() {
		super();
	}

	/**
	 * http请求
	 */
	HttpServletRequest request = null;

	/**
	 * tomcat 下的root 本地目录
	 */
	String tomcatRootLocalPath = null;

	/**
	 * tomcat 下的root url目录
	 */
	String tomcatRootUrlPath = null;

	/**
	 * 初始化Servlet
	 *
	 * @throws ServletException if an error occurs
	 */
	public void init() throws ServletException {
		AuthManager authManager = AuthManager.getInstance(getServletContext());
		authManager.authValidate();
	}

	/**
	 * http的get请求入口
	 * 
	 * @throws IOException
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * http的post请求入口
	 * 
	 * @throws IOException
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.request = request;
		action(request, response);
	}

	/**
	 * action操作
	 * 
	 * @param request
	 * 
	 * @param response
	 * @throws IOException
	 * 
	 */
	protected void action(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		JSONObject json = null;
		String _dataType = CONSTANT_JSON_DATATYPE; // 默认响应为json类型

		Parameters parameters = getParameters(request);
		if (parameters != null) {
			String action = parameters.getParameter(KEY_ACTION);
			String dataType = parameters.getParameter(KEY_DATATYPE);
			if (dataType != null && !dataType.isEmpty()) {
				if (dataType.equals(CONSTANT_XML_DATATYPE))
					_dataType = CONSTANT_XML_DATATYPE; // 标记为xml类型
			}// end if(dataType != null && !dataType.isEmpty())

			json = action(request, response, parameters, action);
		}// end if(parameters != null)
		if (json == null) {
			json = new JSONObject();
			json.element(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
			json.element(Result.JSON_RESULT_MESSAGE,
					getLocaleString("result.execute.fail"));
		}

		if (_dataType.equals(CONSTANT_JSON_DATATYPE)) {
			response.setContentType("text/html;charset=UTF-8");
			PrintWriter writer = response.getWriter();
			BufferedWriter bw = new BufferedWriter(writer);

			if (writer != null)
				bw.write(json.toString());

			bw.close();
		} else {
			response.setContentType("text/xml;charset=UTF-8");
			PrintWriter writer = response.getWriter();
			BufferedWriter bw = new BufferedWriter(writer);

			String xmlString = JSONObjectToXMlString(json);
			if (writer != null)
				bw.write(xmlString);
			bw.close();
		}// end if(_dataType.equals(CONSTANT_JSON_DATATYPE))
	}

	/**
	 * servlet 接口
	 * 
	 * @param request
	 * @param response
	 * @param parameters
	 * @param action
	 * @return
	 */
	protected abstract JSONObject action(HttpServletRequest request,
			HttpServletResponse response, Parameters parameters, String action);

	/**
	 * json对象转xml格式字符串
	 * 
	 * @param json
	 *            json对象
	 * 
	 * @return xml格式字符串
	 */
	protected String JSONObjectToXMlString(JSONObject json) {
		XMLSerializer xmlSerializer = new XMLSerializer();
		return xmlSerializer.write(json).toString();
	}

	/**
	 * 获取http请求参数<br/>
	 * 如果传递的是二进制参数， 如果使用“&ltform enctype="multipart/form-data">”形式提交的参数，
	 * 将采用MultipartParameters类(重载Parameter)进行参数的处理，否则采用Parameter处理
	 * 
	 * @param request
	 * 
	 * @return Http请求参数
	 */
	protected Parameters getParameters(HttpServletRequest request) {
		Parameters parameters = null;
		if (request != null) {
			// http请求参数是否采用二进制的形式
			boolean isMutipart = ServletFileUpload.isMultipartContent(request);
			if (isMutipart)
				parameters = new MultipartParameters(request);
			else
				parameters = new Parameters(request);
		}
		return parameters;
	}

	/**
	 * 获取默认的本地化资源
	 * <p>
	 * 默认的国家化资源文件:result_<font style='color:#f00;'>语言代号</font>_ <font
	 * style='color:#f00;'>国家代号</font>.properties
	 * </p>
	 * 
	 * @param key
	 *            键
	 * @return 本地化key对应value值
	 */
	protected String getLocaleString(String key) {
		return LocaleManager.getLocaleString(request,
				DEFAULT_RESULT_RESOURCEBUNDLE, key);
	}

	/**
	 * 获取指定本地化的本地化资源
	 * <p style='color:#f00;'>
	 * 例如：system_zh_CN.properties 资源文件中:sys.success=成功<br/>
	 * 参数：baseName="system" key="sys.success" <br/>
	 * 返回：成功找到返回“成功”，否则返回“sys.success”
	 * </p>
	 * 
	 * @param key
	 *            键
	 * @return 本地化key对应value值
	 */
	protected String getLocaleString(String baseName, String key) {
		if (baseName == null)
			return getLocaleString(key);
		return LocaleManager.getLocaleString(request, baseName, key);
	}

	/**
	 * 获取tomcat 下的root 本地目录
	 * 
	 * @return
	 */
	protected String getTomcatRootLocalPath() {
		if (tomcatRootLocalPath != null)
			return tomcatRootLocalPath;

		tomcatRootLocalPath = HttpUtil.getRealPath(request, null);
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
	protected String getTomcatRootUrlPath() {
		// if(tomcatRootUrlPath != null)
		// return tomcatRootUrlPath;

		StringBuffer web = request.getRequestURL();
		tomcatRootUrlPath = HttpUtil.getUrlPath(request, null);
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
}
