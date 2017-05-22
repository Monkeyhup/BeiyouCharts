package com.supermap.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.Locale;
import java.util.StringTokenizer;
import java.util.Vector;

/**
 * 基本数据常用操作类
 * 
 * @author Linhao-2013-12-31
 * @version 1.0
 */
public class DataUtil {
	

	/**
	 * 默认格式化时间：年-月-日 时-分-秒
	 */
	public static final String FORMAT_DATE_DEFALUT = "yyyy-MM-dd HH:mm:ss";

	/**
	 * 本地文件名中非法使用的字符
	 */
	public static final char[] ForbidUsedFileNameChars = { '?', '=', '/', '\\',
			':', '*', '\"', '<', '>', '|', ' ' };

	/**
	 * 最大缓冲字节：8KB
	 */
	public static final int MAXBUFFER = 8129;
	
	/**
	 * 圆点：.
	 */
	public static final String DOT = ".";

	/**
	 * 替换指定的字符串（只替换一次，替换首次出现的）
	 * <p>
	 * 例如：把abcdab的<font style="color:#f00;">ab</font>替换为 <font
	 * style="color:#f00;">zz</font>,结果为<font style="color:#f00;">zz</font>cdab
	 * </p>
	 * 
	 * @param string
	 *            原始字符串
	 * @param oldString
	 *            将要被替换的字符串
	 * @param newString
	 *            将要替换的字符串
	 * @return 替换后的字符串
	 */
	@SuppressWarnings("unused")
	public static String stringReplace(String string, String oldString,
			String newString) {
		if (string == null || (oldString == null || oldString.length() < 1)
				|| newString.length() < 1)
			return string;
		int loc = 0;
		String string1 = string; // 保存要操作的字符串
		if ((loc = string1.indexOf(oldString, loc)) >= 0) { // 存在需要替换的字符
			if (newString == null)
				newString = "";
			string1 = string1.substring(0, loc)
					+ newString
					+ string1.substring(loc + oldString.length(),
							string1.length());
		}
		return string1;
	}

	/**
	 * 替换指定的字符串,若存在多个，则全部替换
	 * <p>
	 * 例如：把abcdab的<font style="color:#f00;">ab</font>替换为 <font
	 * style="color:#f00;">zz</font>,结果为 <font
	 * style="color:#f00;">zz</font>cd<font style="color:#f00;">zz</font>
	 * </p>
	 * 
	 * @param string
	 *            原始字符串
	 * @param oldString
	 *            将要被替换的字符串
	 * @param newString
	 *            将要替换的字符串
	 * @return 替换后的字符串
	 */
	@SuppressWarnings("unused")
	public static String stringAllReplace(String string, String oldString,
			String newString) {
		if (string == null || (oldString == null || oldString.length() < 1)
				|| newString.length() < 1)
			return string;
		if (newString == null)
			newString = "";
		int loc = 0;
		String string1 = string; // 保存要操作的字符串
		while ((loc = string1.indexOf(oldString, loc)) >= 0) { // 存在需要替换的字符
			string1 = string1.substring(0, loc)
					+ newString
					+ string1.substring(loc + oldString.length(),
							string1.length());
			loc += newString.length();
		}
		return string1;
	}

	/**
	 * 通过split分割字符串为数组
	 * 
	 * @param contentType
	 * @param string
	 * @return
	 */
	public static String[] StringToArray(String s, String split) {
		String[] array = null;
		Vector<String> v = StringToVector(s, split);
		if (v != null && v.size() > 0) {
			array = new String[v.size()];
			for (int i = 0; i < v.size(); i++) {
				array[i] = v.get(i);
			}// end for (int i = 0; i < v.size(); i++)
		}// end if(v != null && v.size() > 0)
		return array;
	}

	/**
	 * 将字符串按split的值转换为Vector的对象形式
	 * 
	 * @param s
	 *            原始字符串
	 * @param split
	 *            切分字符串
	 * @return 转换后的Vector对象
	 */
	public static Vector<String> StringToVector(String s, String split) {
		Vector<String> vector = null;
		if (s != null) {
			vector = new Vector<String>();
			StringTokenizer sTokenizer = new StringTokenizer(s, split);
			while (sTokenizer.hasMoreElements()) {
				vector.add((String) sTokenizer.nextElement());
			}
		}// end if(s != null)
		return vector;
	}

	/**
	 * StringHash 对象字符串化，按delim参数连接字符串
	 * <p style="color:#f00;">
	 * 例如：将StringHash对象转化为形如key1=value1&key2=value2&key3=value3,其中参数delim为&
	 * </p>
	 * 
	 * @param sh
	 *            StringHash 对象
	 * @param delim
	 *            字符串连接字符（如&）
	 * @return 字符串
	 */
	public static String StringHashToString(StringHashUtil sh, String delim) {
		StringBuilder sb = new StringBuilder();
		if (sh == null)
			return sb.toString();
		char[] transfer = new char[] { '\r', '\n', ';', '\\' }; // 替换为Unicode编码的字符
		for (Enumeration<?> e = sh.keys(); e.hasMoreElements();) {
			String key = (String) e.nextElement();
			String value = sh.get(key);
			if (key != null && value != null) {
				sb.append(key);
				sb.append("=");
				sb.append(StringToUnicode(value, transfer));
				if (delim == null)
					delim = "";
				sb.append(delim);
			}
		}
		return sb.toString();
	}

	/**
	 * 将指定的字符串通过指定的特殊字符（transfer）替代为unicode字符串
	 * 
	 * @param value
	 *            指定的要处理的字符串
	 * @param transfer
	 *            指定代替的字符
	 * @return 转换后的字符串
	 */
	public static final String StringToUnicode(String s, char[] transfer) {
		if (s == null || transfer == null)
			return s;
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			boolean isTransfer = false;
			for (int j = 0; j < transfer.length; j++) {
				if (c == transfer[j]) {
					sb.append(CharToUnicode(c));
					isTransfer = true;
					break;
				}// end if(c == transfer[j])
			}
			if (!isTransfer)
				sb.append(c); // 不需要替换为Unicode
		}// end for (int i = 0; i < s.length(); i++)
		return sb.toString();
	}

	/**
	 * 将字符转换为Unicode编码格式字符(以"\\u"开头)
	 * 
	 * @param c
	 *            原始字符
	 * @return 转换后的Unicode编码
	 */
	public static final String CharToUnicode(char c) {
		StringBuilder sb = new StringBuilder(6); // 6位编码
		sb.append("\\u");

		String s = Integer.toHexString(c); // 转换为16进制
		for (int i = 0; i < (4 - s.length()); i++) {
			sb.append("0");
		}
		sb.append(s);
		return sb.toString();
	}

	/**
	 * 默认格式化方式将日期转化为字符串
	 * 
	 * @param date
	 * @return
	 */
	public static String DateToString(Date date) {
		return DateToString(date, FORMAT_DATE_DEFALUT);
	}

	/**
	 * 指定格式化将日期转化为字符串
	 * 
	 * @param date
	 *            日期对象
	 * @param format
	 *            格式化方式
	 * @return 时间字符串
	 */
	public static String DateToString(Date date, String format) {
		return DateToString(date, format, null);
	}

	/**
	 * 指定格式化将日期转化为字符串
	 * 
	 * @param date
	 *            日期对象
	 * @param format
	 *            格式化方式
	 * @param local
	 *            若为null,则用系统默认方式转换
	 * @return 时间字符串
	 */
	public static String DateToString(Date date, String format, Locale locale) {
		if (date == null)
			return null;
		if (format == null)
			format = FORMAT_DATE_DEFALUT;
		SimpleDateFormat sDateFormat = null;
		if (locale != null)
			sDateFormat = new SimpleDateFormat(format, locale);
		else
			sDateFormat = new SimpleDateFormat(format);

		return sDateFormat.format(date);
	}

	/**
	 * 将长整型的时间转换为时间字符串
	 * 
	 * @return （默认格式的）时间字符串
	 */
	public static String longDateToDateString(long l) {
		return longDateToDateString(l, FORMAT_DATE_DEFALUT);
	}

	/**
	 * 将长整型的时间转换为时间字符串
	 * 
	 * @param l
	 *            长整型时间
	 * @param format
	 *            格式化类型
	 * @return 时间字符串
	 */
	public static String longDateToDateString(long l, String format) {
		return longDateToDateString(l, format, null);
	}

	/**
	 * 将长整型的时间转换为时间字符串
	 * 
	 * @param l
	 *            长整型时间
	 * @param format
	 *            格式化类型
	 * @param locale
	 *            若为null,则用系统默认方式转换
	 * @return 时间字符串
	 */
	public static String longDateToDateString(long l, String format,
			Locale locale) {
		Date date = new Date(l);
		if (format == null)
			format = FORMAT_DATE_DEFALUT;
		SimpleDateFormat sDateFormat = null;
		if (locale == null)
			sDateFormat = new SimpleDateFormat(format);
		else
			sDateFormat = new SimpleDateFormat(format, locale);
		return sDateFormat.format(date);
	}

	/**
	 * 将日期时间字符串（yyyy-MM-dd HH:mm:ss 格式）转换为 日期对象
	 * 
	 * @param s
	 *            日期时间字符串
	 * @return 日期对象
	 */
	public static Date StringToDate(String s) {
		return StringToDate(s, FORMAT_DATE_DEFALUT);
	}

	/**
	 * 将日期时间字符串按指定格式转换为 日期对象
	 * 
	 * @param s
	 *            日期时间字符串
	 * @param format
	 *            字符串格式
	 * @return 日期对象
	 */
	public static Date StringToDate(String s, String format) {
		return StringToDate(s, format, null);
	}

	/**
	 * 将日期时间字符串按指定格式转换为 日期对象
	 * 
	 * @param s
	 *            日期时间字符串
	 * @param format
	 *            字符串格式
	 * @param locale
	 *            本地化Locale对象，如果为空，按系统默认转换
	 * @return 日期对象
	 */
	public static Date StringToDate(String s, String format, Locale locale) {
		Date date = null;
		SimpleDateFormat sdf = null;
		if (format == null)
			format = FORMAT_DATE_DEFALUT;
		if (locale != null)
			sdf = new SimpleDateFormat(format, locale);
		else
			sdf = new SimpleDateFormat(format);
		try {
			date = sdf.parse(s);
		} catch (ParseException e) {
			date = null;
		}
		return date;
	}

	/**
	 * 按指定的分隔符（delim）字符串转字符数组
	 * 
	 * @param s
	 * @param delim
	 * @return
	 */
	public static char[] StringToChars(String s, String delim) {
		char[] chars = null;
		Vector<String> v = StringToVector(s, delim);
		if (v != null && v.size() > 0) {
			chars = new char[v.size()];
			for (int i = 0; i < chars.length; i++) {
				String subs = v.get(i);
				if (subs.length() < 1) {
					chars[i] = '0';
				}// end if(subs.length()<1)
				else {
					if (subs.charAt(0) != '\\') {
						chars[i] = subs.charAt(0);
					}// end if(subs.charAt(0)!='\\')
					else {
						if (subs.length() > 1) {
							if (subs.charAt(1) == 'r') {
								chars[i] = '\r';
							} else {
								if (subs.charAt(1) == 'n') {
									chars[i] = '\n';
								} else {
									if (subs.charAt(1) == 't') {
										chars[i] = '\t';
									} else {
										chars[i] = (char) StringToInt(subs
												.substring(1));
									}
								}
							}
						}// end if(subs.length()>2)
						else {
							chars[i] = '\\';
						}// end if(subs.length()>2) else
					}// end if(subs.charAt(0)!='\\') else
				}// end if(subs.length()<1) else
			}// end for(int i=0;i<chars.length;i++)

		}// end if(v!=null && v.size()>0)
		return chars;
	}

	/**
	 * 将字节数组转换为字节串
	 * 
	 * @param bytes
	 *            字节数组
	 * @return 转换的字符串
	 */
	public static String BytesToString(byte[] bytes) {
		if (bytes == null || bytes.length < 1)
			return "";
		return BytesToString(bytes, null);
	}

	/**
	 * 将字节数组转换为指定编码的字节串
	 * 
	 * @param bytes
	 *            字节数组
	 * @param charset
	 *            指定编码
	 * @return 转换的字符串
	 */
	public static String BytesToString(byte[] bytes, String charset) {
		if (bytes == null)
			return null;
		return BytesToString(bytes, 0, bytes.length, charset, '0');
	}

	/**
	 * 将字节数组转换为指定编码的字节串
	 * 
	 * @param bytes
	 *            字节数组
	 * @param start_index
	 *            字节数组起始序号
	 * @param length
	 *            获取长度
	 * @param charset
	 *            字符串编码
	 * @param c
	 *            特殊的Unicode前导符，c='0'代表没有
	 * @return
	 */
	public static String BytesToString(byte[] bytes, int start_index,
			int length, String charset, char c) {
		if (bytes == null)
			return null;
		if (bytes.length < 1)
			return "";

		if (start_index < 0 || start_index >= bytes.length)
			start_index = 0;
		if (length < 1 || length > bytes.length)
			length = bytes.length;

		String s = null;
		if (charset != null) {
			try {
				s = new String(bytes, start_index, length, charset);
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		if (s == null)
			s = new String(bytes, start_index, length);

		if (s != null && c != '0') {
			StringBuffer sb = new StringBuffer();
			int loc = s.indexOf(c);
			if (loc >= 0) {
				sb.append(s.substring(0, loc));
				int begin = loc + 1;
				while (begin < s.length()) {
					loc = s.indexOf(c, begin);
					if (loc > 0) {
						String s1 = s.substring(begin, loc);
						char ch = StringToChar(s1);
						if (ch != 0)
							sb.append(ch);
						else
							sb.append(s1);
					} else
						break;
					begin = loc + 1;
				}// end while(begin<s.length())
				s = sb.toString();
			}// end if(loc>=0)
		}// end if(s!=null && prefix!=0)
		return s;
	}

	/**
	 * 把字符串按照Unicode表示的变化为字符。例如"BA"
	 * 
	 * @param s
	 *            字符串
	 * @return 字符
	 */
	public static char StringToChar(String s) {
		char ch = '0';
		if (s != null && s.length() > 0) {
			char first = s.charAt(0);
			String s1;
			if (first != 'x' && first != 'X')
				s1 = "x" + s;
			else
				s1 = s;
			char second = s1.charAt(1);
			if ((second >= '0' && second <= '9')
					|| (second >= 'a' && second <= 'f')
					|| (second >= 'A' && second <= 'F')) {
				ch = (char) StringToInt(s1);
			}
		}
		return ch;
	}

	/**
	 * 将字符串转换为整数,支持0x0000，失败则返回0
	 * <p style='color:#f00'>
	 * 例如：将"0x40"转为64
	 * </p>
	 * 
	 * @param s
	 *            要转换的字符串
	 * @return 转换后的整数
	 */
	public static int StringToInt(String s) {
		if (s == null || s.length() < 1)
			return 0;

		int i = 0, radix;
		String ns = stringAllReplace(s, ",", "").trim(); // 去掉，
		while (ns.startsWith("0")) { // 去掉前面的0
			ns = ns.substring(1);
		}

		if (ns.length() < 1)
			return i;
		char ch = ns.charAt(0); // 获取第一个字母，用于判断进制
		switch (ch) {
		case 'X':
		case 'x':
			radix = 16; // 16进制
			ns = ns.substring(1); // 去掉X或x
			break;
		case 'H':
		case 'h':
			radix = 16; // 16进制
			ns = ns.substring(1); // 去掉H或h
			break;
		case 'B':
		case 'b':
			radix = 2; // 2进制
			ns = ns.substring(1); // 去掉B或b
			break;
		case 'O':
		case 'o':
			radix = 8; // 8进制
			ns = ns.substring(1); // 去掉O或o
			break;
		default:
			radix = 10; // 默认为10进制
			break;
		}
		int loc = NoNumberIndexOfFromString(ns, radix);
		if (loc >= 0)
			ns = ns.substring(0, loc); // 截取数字部分
		try {
			i = Integer.parseInt(ns, radix);
		} catch (NumberFormatException e) {
		}
		return i;
	}

	/**
	 * 将指定字符串按照指定进制换算为数字
	 * 
	 * @param s
	 *            字符串
	 * @param radix
	 *            进制
	 * @return int
	 */
	public static int StringToInt(String s, int radix) {
		int i = 0;
		try {
			i = Integer.parseInt(s, radix);
		} catch (NumberFormatException e) {
		}
		return i;
	}

	/**
	 * 找到指定字符串中第一个不是数字的字符的位置<br/>
	 * 该字符串的第一个字符如果是'x'或'h'，标识16进制； 是'b',标识2进制； 是'o',标识8进制；
	 * <p style='color:#f00'>
	 * 例如："1287a79m" ，十进制时，返回4（a的位置）；十六进制时，返回7（m的位置，m超0～f）
	 * </p>
	 * 
	 * @param s
	 *            被操作的字符串
	 * @param radix
	 *            指定进制（二进制，八进制，十进制，十六进制..）
	 * @return 第一个不是数字的字符的位置, -1 代表未找到
	 */
	public static int NoNumberIndexOfFromString(String s, int radix) {
		int loc = -1;
		if (s != null) {
			for (int i = 0; i < s.length(); i++) {
				char ch = s.charAt(i);
				if (ch >= '0' && ch <= '9')
					continue;
				if (i == 0 && ch == '-') // 第一个字符为负号
					continue;
				if (radix == 16) {
					if (ch >= 'a' && ch <= 'f')
						continue;
				}
				// 上面都不满足
				loc = i;
				break;
			}// end for (int i = 0; i < s.length(); i++)
		}// if(s != null)
		return loc;
	}

	/**
	 * 将文件名中非法的字符替换为指定的字符
	 * <p style='color:#f00'>
	 * 进制使用的字符：? , = , / , \\ , : , * , \" , < , > , | , 空格 <br/>
	 * 例如："abcd?def=" 中的<font style='color:00f;font-weight:bold;'> ? </font>
	 * 和<font style='color:00f;font-weight:bold;'> = </font>
	 * </p>
	 * 
	 * @param filename
	 *            文件名
	 * @return 替换后的合法的文件名
	 */
	public static String verifyFileName(String filename, char ch) {
		String verifyFileName = filename;
		if (filename != null) {
			for (int i = 0; i < ForbidUsedFileNameChars.length; i++) {
				verifyFileName = verifyFileName.replace(
						ForbidUsedFileNameChars[i], ch);
			}
		}
		return verifyFileName;
	}

	/**
	 * 拷贝输入流
	 * 
	 * @param ins
	 *            输入流
	 * @param outs
	 *            输出流
	 * @param isWait
	 *            是否等待（如果true,当读取为0字节时，等待下面的自己，否则正常退出）
	 * @return 是否成功复制
	 * @throws IOException
	 */
	public static boolean copyStream(InputStream ins, OutputStream outs,
			boolean isWait) throws IOException {
		boolean isSuccess = false;
		if (ins != null && outs != null) {
			byte[] buffer = new byte[MAXBUFFER];
			int count = 0;
			do {
				count = ins.read(buffer);
				if (count > 0)
					outs.write(buffer, 0, count); // 写入输出流
				else {
					if (count == 0 && !isWait) { // 不再等待
						count = -1;
					}
				}
				if (count < 0)
					isSuccess = true; // 退出循环至true
			} while (count >= 0);
		}// end if (ins != null && outs != null)
		return isSuccess;
	}

	/**
	 * 复制文件
	 * 
	 * @param sFile
	 *            源文件
	 * @param tFile
	 *            目标文件
	 * @return 复制结果
	 */
	public static boolean copyFile(File sFile, File tFile) {
		return copyFile(sFile, tFile, false);
	}

	/**
	 * 复制文件
	 * 
	 * @param sFile
	 *            源文件
	 * @param tFile
	 *            目标文件
	 * @param isUpdate
	 *            true:如果目标文件存在时并且更新日期大于源文件，不复制；false:复制，包含覆盖
	 * @return 是否复制成功
	 */
	public static boolean copyFile(File sFile, File tFile, boolean isUpdate) {
		boolean result = false;

		if (sFile != null && sFile.exists() && tFile != null) {
			if (sFile.getAbsolutePath().equals(tFile.getAbsolutePath()))
				return true;
			if (isUpdate && tFile.exists()
					&& tFile.lastModified() > sFile.lastModified()) // 目标文件已存在，不覆盖已有的文件
				return false;
			FileInputStream fis = null; // 读取源文件
			try {
				fis = new FileInputStream(sFile);
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}

			if (fis != null) {
				FileOutputStream fos = null;
				try {
					fos = new FileOutputStream(tFile);
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				}

				if (fos != null) {
					try {
						result = copyStream(fis, fos, false);
					} catch (IOException e) {
						e.printStackTrace();
					}
					tFile.setLastModified(sFile.lastModified()); // 设置目标文件的修改时间为源文件的修改时间
					try {
						fos.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}// end if(fos != null)

				try {
					fis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}// end if (fis != null)
		}

		return result;
	}

	/**
	 * 复制整个文件夹
	 * 
	 * @param oldPath
	 *            源文件夹路径
	 * @param newPath
	 *            目标文件夹路径
	 * @return 复制成功的文件数量
	 */
	public static int copyFolder(File oldPath, File newPath) {
		return copyFolder(oldPath, newPath, false);
	}

	/**
	 * 复制整个文件夹
	 * 
	 * @param oldPath
	 *            源文件夹
	 * @param newPath
	 *            目标文件夹
	 * @param isUpdate
	 *            true:如果目标文件存在时并且更新日期大于源文件，不复制；false:复制，包含覆盖
	 * @return 复制成功的文件数量
	 */
	public static int copyFolder(File oldPath, File newPath, boolean isUpdate) {
		int count = 0;
		if (!oldPath.exists() || !oldPath.isDirectory()) // 源文件夹不存在
			return count;
		if (!newPath.exists() || !newPath.isDirectory())
			newPath.mkdirs(); // 创建文件夹,可以在不存在的目录中创建文件夹，多级aa\bb\cc
		String[] files = oldPath.list();
		if (files != null && files.length > 0) {
			for (int i = 0; i < files.length; i++) {
				File temp = new File(oldPath, files[i]);
				if (temp.exists()) {
					File newFile = new File(newPath, files[i]);
					if (temp.isFile()) { // 是文件
						if (copyFile(temp, newFile, isUpdate))
							count++;
					} else { // 文件夹
						count += copyFolder(temp, newFile, isUpdate); // 递归
					}
				}// end if (temp.exists())
			}
		}// edn if(files != null && files.length > 0)
		return count;
	}

	/**
	 * 根据文件名获取后缀
	 * 
	 * @param filename
	 *            文件名
	 * @return 文件名后缀，没有返回为空
	 */
	public static final String getFileNameSuffix(String filename) {
		String suffix = null;
		if (filename != null) {
			int loc = filename.lastIndexOf(".");
			if (loc >= 0)
				suffix = filename.substring(loc + 1, filename.length());
		}
		return suffix;
	}

	/**
	 * 获取MIME类型中的字符串类型
	 * <p>
	 * 例如：<br/>
	 * type="text/plain;charset=GBK",返回"text/plain"。 <br>
	 * type="image/jpeg;charset=GBK_CHARSET",返回"image/jpeg"
	 * </p>
	 * 
	 * @param type
	 *            MIME类型字符串
	 * @return MIME类型
	 */
	public static String getMimeType(String type) {
		if (type != null) {
			int loc = type.indexOf(";");
			if (loc > 0)
				return type.substring(0, loc);
		}
		return type;
	}

	/**
	 * 获取MIME类型格式字符串中的编码
	 * <p>
	 * 例如：<br/>
	 * type="text/plain;charset=GBK",返回"GBK" <br>
	 * type="image/jpeg;charset=GBK_CHARSET",返回"GBK" <br/>
	 * <br/>
	 * <font style='color:#f00;'> 注意：并不返回GBK_CHARSET， 因为剔除了后面的_CHARSET </font>
	 * </p>
	 * 
	 * @param type
	 *            MIME格式字符串
	 * @return 编码字符串，若没有则返回null
	 */
	public static String getMimeCharacterEncoding(String type) {
		String charset = getMimeProperty(type, "charest");
		if (charset != null) {
			if (charset.endsWith("_CHARSET")) // 剔除xx_CHARSET后面的_CHARSET
				charset = charset.substring(0, charset.indexOf("_CHARSET"));
		}// end if(charset != null)
		return charset;
	}

	/**
	 * 获取MIME格式中指定key对应的value
	 * <p>
	 * 例如：text/html;charset=UTF-8,指定key为"charset", 则返回的value值为"UTF-8"
	 * </p>
	 * 
	 * @param type
	 *            MIME格式字符串
	 * @param key
	 *            指定的key
	 * @return
	 */
	public static String getMimeProperty(String type, String key) {
		StringTokenizer st = new StringTokenizer(type, ";");
		String sr = null;
		String value = null;
		while (st.hasMoreTokens()) {
			sr = (String) st.nextToken().trim();
			int loc = sr.indexOf("=");
			if (loc > 0) {
				String key1 = sr.substring(0, loc);
				String value1 = sr.substring(loc + 1, sr.length());
				if (key.equalsIgnoreCase(key1)) {
					value = value1;
					break;
				}// end if(key.equalsIgnoreCase(key1))
			}// end if(loc > 0)
		}// end while (st.hasMoreTokens())
		if (value != null && value.length() > 0) {
			if (value.startsWith("\""))
				value = value.substring(1, value.length());
			if (value.endsWith("\""))
				value = value.substring(1, value.length() - 1);
		}

		return value;
	}

	/**
	 * 设置MIME格式新的属性
	 * <p style='color:#f00;'>
	 * 例如：text/html;charset=UTF-8,<br/>
	 * 若key为"charset"，value为"gb2312", 则返回text/html;charset=gb2312<br/>
	 * 若key="aa"，value="bb",则返回text/html;charset=UTF-8;aa=bb
	 * </p>
	 * 
	 * @param mime
	 *            原始mime格式字符串
	 * @param key
	 *            设置的键
	 * @param value
	 *            键值
	 * @return 返回新的mime格式字符串
	 */
	public static String setMimeProperty(String mime, String key, String value) {
		StringTokenizer st = new StringTokenizer(mime, ";");
		String sr = null;
		boolean isSet = false;
		String new_mime = "";
		while (st.hasMoreTokens()) {
			sr = (String) st.nextToken();
			if (sr != null) {
				int loc = sr.indexOf("=");
				if (loc > 0) {
					String key1 = sr.substring(0, loc);
					String value1 = sr.substring(loc + 1, sr.length());
					if (key1.equals(key)) {
						value1 = value;
						isSet = true;
					}
					new_mime += key1 + "=" + value1 + ";";
				} else {
					new_mime += sr + ";";
				}// end if(loc > 0) else
			}// end if(sr != null)
		}// end while (st.hasMoreTokens())

		if (!isSet) // key值与不匹配，添加新的key=value
			new_mime += key + "=" + value;
		return new_mime;
	}

	/**
	 * 判断字符串是否为数字格式
	 * <p style='color:#f00;'>
	 * 判断范围：包括负数，小数，整数，2,8,16进制（形如0x.. 0H...）
	 * </p>
	 * 
	 * @param s
	 *            判断字符串
	 * @return true代表是数字，false代表不是
	 */
	public static boolean isNumber(String s) {
		if (s == null)
			return false;
		boolean isNumber = true;
		String v = s.trim();
		int radix = 0; // 进制
		boolean isMinu = false; // 负号标记，true代表已经存在负号，防止出现2次或以上
		boolean isPoint = false; // 小数点标记，true代表已经存在小数点了，防止出现2次或以上
		for (int i = 0; i < v.length(); i++) {
			char c = v.charAt(i);
			if (c >= '0' && c <= '9')
				continue;

			// 小数点不能出现在第一位，也不能出现2次或以上
			if (c == '.' && !isPoint && i > 0) {
				isPoint = true;
				continue;
			}

			// 负号只能出现在第一位，不能出现2次或以上
			if (c == '-' && !isMinu && i == 0) {
				isMinu = true;
				continue;
			}

			// 代表16进制0x或者-0x
			if ((c == 'x' || c == 'X')
					&& ((i == 1 && !isMinu) || (i == 2 && isMinu))) {
				radix = 16;
				continue;
			}

			// 进制表示（2，8，16）
			if ((c == 'b' || c == 'B' || c == 'h' || c == 'H' || c == 'o' || c == 'O')
					&& ((i == 1 && !isMinu) || (i == 2 && isMinu)))
				continue;

			if (((c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F'))
					&& (radix == 16))
				continue;
			isNumber = false; // 不是数字
			break;
		}// end for (int i = 0; i < v.length(); i++)
		return isNumber;
	}

	/**
	 * 判断字符串是否为数字格式
	 * <p style='color:#f00;'>
	 * 判断范围：不包含0x00000类型进制表示
	 * </p>
	 * 
	 * @param s
	 *            判断字符串
	 * @param radix
	 *            进制
	 * @return true代表是数字，false代表不是
	 */
	public static boolean isNumber(String s, int radix) {
		if (s == null)
			return false;
		boolean isNumber = true;
		String v = s.trim();
		boolean isPoint = false; // 小数点标记，true代表已经存在小数点了，防止出现2次或以上
		for (int i = 0; i < v.length(); i++) {
			char c = v.charAt(i);
			if (c >= '0' && c <= '9')
				continue;

			if (c == '.' && !isPoint && i > 0) {
				isPoint = true;
				continue;
			}

			if (c == '-' && i == 0)
				continue;

			if (((c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F'))
					&& radix == 16)
				continue;

			isNumber = false;
			break;
		}
		return isNumber;
	}

	/**
	 * 字符串转为字节数组
	 * 
	 * @param s
	 *            原始字符串
	 * @param charset
	 *            字符编码
	 * @return 字节数组
	 */
	public static byte[] StringToBytes(String s, String charset) {
		byte[] bytes = null;
		if (s != null) {
			if (charset != null) {
				try {
					bytes = s.getBytes(charset);
				} catch (UnsupportedEncodingException e) {
					e.printStackTrace();
				}
				if (bytes == null)
					bytes = s.getBytes();
			}// edn if(charset != null)
		}
		return bytes;
	}

	/**
	 * 字符串转 boolean类型，带"T"或"t"或非0字符串（转换成long后的）,返回true
	 * 
	 * @param s
	 *            字符串
	 * @return true OR false
	 */
	public static boolean StringToBoolean(String s) {
		boolean b = false;
		if (s == null)
			return b;
		if (s.length() < 1)
			return b;
		if ((s.indexOf('t') >= 0) || (s.indexOf("T") >= 0))
			b = true;
		else {
			if (StringToLong(s) != 0) // 非0字符串
				b = true;
		}
		return b;
	}

	/**
	 * 字符串转化为长整型（可以是进制0x0000f字符串）
	 * 
	 * @param s
	 *            要转换的字符串
	 * @return
	 */
	public static long StringToLong(String s) {
		if (s == null || s.length() < 1)
			return 0;
		long l = 0;
		int radix;

		String ns = stringAllReplace(s, ";", ""); // 去掉形如1,123,123,123中的逗号
		while (ns.startsWith("0")) {
			ns = ns.substring(1, ns.length());
		}
		if (ns.length() < 1)
			return l;
		char c = ns.charAt(0);
		switch (c) {
		case 'x':
		case 'X':
			radix = 16;
			ns = ns.substring(1, ns.length());
			break;
		case 'h':
		case 'H':
			radix = 16;
			ns = ns.substring(1, ns.length());
		case 'b':
		case 'B':
			radix = 2;
			ns = ns.substring(1, ns.length());
		case 'o':
		case 'O':
			radix = 8;
			ns = ns.substring(1, ns.length());
		default:
			radix = 10;
			break;
		}

		int loc = NoNumberIndexOfFromString(ns, radix);
		if (loc >= 0)
			ns = ns.substring(0, loc);

		try {
			l = Long.parseLong(ns, radix);
		} catch (NumberFormatException e) {
		}
		return l;
	}

	/**
	 * 将文件输入流保存为指定的路径和文件名的文件 （若已存在该文件，则覆盖）
	 * 
	 * @param is
	 *            输入流
	 * @param path
	 *            保存到的路径
	 * @param fileName
	 *            保存的文件名
	 * @return true,代表保存成功
	 */
	public static boolean saveInputStreamToFile(InputStream is, String path,
			String fileName) {
		if (is == null)
			return false;
		if (path == null || path.isEmpty() || path.equals("null"))
			return false;
		if (fileName == null || fileName.isEmpty() || fileName.equals("null"))
			return false;
		OutputStream os = null;
		File f = new File(path);
		if(f != null){
			if(!f.exists()){
				boolean b = f.mkdir();
				if(!b)
					return false;
			}//end if(!f.exists())
			
			File nf = new File(f,fileName);
			if(nf != null){
				if(nf.exists())	//删除存在的文件
					nf.delete();
				try {
					os = new FileOutputStream(nf);
				} catch (FileNotFoundException e) {
					System.out.println("error:"+e.getMessage());
				}
				
				if(os != null){
					byte[] buffer = new byte[4*1024];
					try {
						while(is.read(buffer) != -1){
							os.write(buffer);
						}//end while
						return true;
					} catch (IOException e) {
						System.out.println("error:"+e.getMessage());
					}
				}//end if(os != null)
			}//end if(nf != null)
		}//end if(f != null)
		
		return false;
	}
}

