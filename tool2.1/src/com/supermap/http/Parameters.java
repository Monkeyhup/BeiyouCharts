package com.supermap.http;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.supermap.util.DataUtil;
import com.supermap.util.MessyCodeCheckUtil;
import com.supermap.util.StringHashUtil;

/**
 * http 请求参数操作类
 * 
 * @author Linhao 2013-12-31
 * @version 1.0
 * 
 */
public class Parameters {
	
	/**
	 * 常量值：字符集
	 */
	protected static final String CHARSET = "utf-8";

	/**
	 * StringHash 对象
	 */
	StringHashUtil parameter = null;

	/**
	 * http请求对象
	 */
	HttpServletRequest request = null;

	/**
	 * 无参构造函数（需要setRequest）
	 */
	public Parameters() {
	}

	/**
	 * 构造函数
	 * 
	 * @param request
	 *            http请求
	 */
	public Parameters(HttpServletRequest request) {
		if (request != null)
			this.request = request;
	}

	/**
	 * 设置http请求
	 * 
	 * @param request
	 *            http请求
	 */
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	/**
	 * 判断request是否为空
	 * 
	 * @return (request==null)返回true
	 */
	public boolean isRequestNull() {
		if (this.request == null)
			return true;
		return false;
	}

	/**
	 * 通过key获取value参数数组（可能为null，一个或者多个）
	 * 
	 * @param key
	 * @return
	 */
	public String[] getParameterValues(String key) {
		String[] values = null;
		if (!isRequestNull()) {
			String[] temp_values = request.getParameterValues(key);

			if (temp_values != null && temp_values.length > 0) {
				values = new String[temp_values.length];
				for (int i = 0; i < temp_values.length; i++) {
					if (temp_values[i] != null) {
						String s = DataUtil.stringAllReplace(temp_values[i],
								"+", "%2B");
						values[i] = decode(s); // 解码
					}
				}// end for(int i = 0; i < temp_values.length;i++)
			}
		}// end if(!isRequestNull())

		return values;
	}

	/**
	 * 对http请求地址url的参数进行编码
	 * 
	 * @param s
	 *            编码前字符串
	 * @return 编码后的字符串
	 */
	public String encode(String s) {
		String encodeString = s;
		if (s != null) {
			try {
				encodeString = URLEncoder.encode(s, CHARSET);
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}

			if (encodeString != null) {
				encodeString = encodeString.replaceAll("\\+", "%20");
			}
		}// end if(s != null)
		return null;
	}

	/**
	 * 解码
	 * 
	 * @param s
	 *            要解码的字符串
	 * 
	 * @return 解码后的字符串
	 */
	public String decode(String s) {
		String decodeString;
		StringBuilder sb = null;
		StringBuilder sb1 = null;
		if (s != null) {
			
			//encodeURI编码解密
			if(!MessyCodeCheckUtil.isMessyCode(s) && s.indexOf("%") > -1){
				try {
					sb1 =new StringBuilder(URLDecoder.decode(s, CHARSET));	
				} catch (UnsupportedEncodingException e1) {
					e1.printStackTrace();
				}
				if(sb1 != null){
					if(!MessyCodeCheckUtil.isMessyCode(sb1.toString())){
						return sb1.toString();
					}
				}//end if(sb1 != null)
			}//end if(!MessyCodeCheck.isMessyCode(s) && s.indexOf("%") > -1)
			
			//非encodeURI编码解密	//UTF-8 //gb2312 //GBK
			try {
				// 转换编码
				sb = new StringBuilder(new String(s.getBytes("ISO-8859-1"),
						CHARSET));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			
			//url中文解码
			if(sb != null){	
				if(MessyCodeCheckUtil.isMessyCode(sb.toString())){	
					try {
						sb = new StringBuilder(new String(s.getBytes("ISO-8859-1"))); 
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}//end if(MessyCodeCheck.isMessyCode(sb.toString()))
				}
			}//end if(sb != null)
			
			if (sb == null)
				sb = new StringBuilder(s); // 没有转换
		}// end if(s != null)

		if (sb != null)
			decodeString = sb.toString();
		else
			decodeString = s;
		return decodeString;
	}

	/**
	 * 获取所有的参数,(一个key若有多个value,用“；”隔开)
	 * <p style='color:#f00;'>
	 * 例如：id = aa;bb;cc <br/>
	 * &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; name=example
	 * </p>
	 * 
	 * @param request
	 */
	@SuppressWarnings("unchecked")
	public StringHashUtil getAllParameters() {
		if (request != null) {
			if (parameter == null)
				parameter = new StringHashUtil();

			Enumeration<String> enumeration = request.getParameterNames();
			while (enumeration.hasMoreElements()) {
				String key = (String) enumeration.nextElement();
				String[] values = getParameterValues(key);

				if (key != null && values != null && values.length > 0) {
					StringBuilder sb = new StringBuilder();
					boolean delim = false; // 是否为第一个标记
					for (String value : values) {
						if (value == null || value.isEmpty()
								|| value.equals("null")) {
							continue;
						}
						if (delim)
							sb.append(";");
						else
							delim = true;
						sb.append(value);
					}// end for (String value : values )
					parameter.put(key, sb.toString());
				}
			}// end while (enumeration.hasMoreElements())
		}// end if(request != null)
		return parameter;
	}

	/**
	 * 通过key获取其参数value,value的多个和值用“；”隔开
	 * <p style='color:#f00;'>
	 * 例如：id = aa;bb;cc
	 * </p>
	 * 
	 * @param key
	 * @return
	 */
	public String getParameter(String key) {
		String value = null;
		if (key != null && !isRequestNull()) {
			String[] strings = getParameterValues(key);
			if (strings != null && strings.length > 0) {
				StringBuilder sb = new StringBuilder();
				boolean delim = false; // 第一个标记
				for (String s : strings) {
					if (s == null || s.isEmpty() || s.equals("null"))
						continue;
					if (delim)
						sb.append(";");
					else
						delim = true;
					sb.append(s);
				}// end for (String s: strings)
				value = sb.toString();
			}
		}// end if(key != null && !isRequestNull())
		return value;
	}

	/**
	 * 参数中是否包含指定的键
	 * 
	 * @param key
	 *            键
	 * @return http请求参数包含指定的键返回true,否则返回false
	 */
	@SuppressWarnings("unchecked")
	public boolean containsKey(String key) {
		if (key == null)
			return false;
		if (!isRequestNull()) {
			Enumeration<String> e = request.getParameterNames();
			if (e != null) {
				while (e.hasMoreElements()) {
					String name = (String) e.nextElement();
					if (name != null && name.equals(key))
						return true;
				}// while (e.hasMoreElements())
			}// end if (e != null)
		}
		return false;
	}

	/**
	 * 获取所有的请求参数的参数名
	 * 
	 * @return 所有的请求参数的参数名
	 */
	@SuppressWarnings("unchecked")
	public String[] getParameterNames() {
		List<String> names = null;
		if (!isRequestNull()) {
			Enumeration<String> e = request.getParameterNames();
			if (e != null) {
				names = new ArrayList<String>();
				while (e.hasMoreElements()) {
					String name = (String) e.nextElement();
					if (name != null && !name.isEmpty())
						names.add(name);
				}// end while (e.hasMoreElements())
			}// end if (e != null)
		}// end if(!isRequestNull())
		return names.toArray(new String[names.size()]);
	}

	/**
	 * 添加请求参数
	 * 
	 * @param key
	 *            请求参数的键
	 * @param value
	 *            请求参数的value值
	 */
	public void setParameter(String key, String value) {
		if (key != null && value != null) {
			if (parameter == null)
				parameter = new StringHashUtil();
			parameter.put(key, value);
		}// end if(key != null && value != null)
	}

	/**
	 * 将参数转化为http的get请求参数形式 形如：（a=1&b=2&c=2...）
	 * 
	 * @param excepyKeys
	 *            需要排除的请求参数的键（参数个数不定）
	 * @return get请求类型的参数字符串
	 */
	@SuppressWarnings("unchecked")
	public String getParameterToHtmlPara(String... exceptKeys) {
		StringBuilder sb = new StringBuilder();
		if (!isRequestNull()) {
			boolean delim = false; // 是否第一个标记
			Enumeration<String> e = request.getParameterNames();
			if (e != null) {
				while (e.hasMoreElements()) {
					String key = (String) e.nextElement();
					String value = getParameter(key);
					if (value != null && !value.isEmpty()
							&& !value.equals("null")) {
						if (exceptKeys != null && exceptKeys.length > 0) {
							boolean isAddToHtmlPara = false;// 是否需要加入（如果是排除的键，则true,不加入）
							for (String exceptKey : exceptKeys) {
								if (exceptKey != null && exceptKey.equals(key)) {
									isAddToHtmlPara = true;
									break;
								}
								if (isAddToHtmlPara)
									continue;
							}// for (String exceptKey : exceptKeys)
						}// end if(exceptKeys != null && exceptKeys.length > 0)

						if (delim)
							sb.append("&");
						else
							delim = true;
						// 添加参数
						sb.append(key);
						sb.append('=');
						sb.append(encode(value));
					}// end if(value != null && !value.isEmpty() &&
						// !value.equals("null"))
				}// end while (e.hasMoreElements())
			}// end if(e != null)

		}// end if(!isRequestNull())
		return sb.toString();
	}
}
