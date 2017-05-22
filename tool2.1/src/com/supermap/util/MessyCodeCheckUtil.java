package com.supermap.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 判断字符串是否为乱码操作类
 * 
 * @author Linhao-2014-02-18
 * 
 */
public class MessyCodeCheckUtil {

	
	/**
	 * 判断一个字符是否为中文
	 * 
	 * @param c
	 *            字符
	 * @return 是中文字符返回true,否则返回false
	 */
	public static boolean isChinese(char c) {
		Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
		if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
				|| ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
				|| ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
				|| ub == Character.UnicodeBlock.GENERAL_PUNCTUATION
				|| ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
				|| ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS) {
			return true;
		}
		return false;
	}

	/**
	 * 判断字符串是否为乱码
	 * 
	 * @param strName
	 * 			字符串
	 * @return 是返回true,否则返回false
	 */
	public static boolean isMessyCode(String strName) {
		Pattern p = Pattern.compile("\\s*|\t*|\r*|\n*");
		Matcher m = p.matcher(strName);
		String after = m.replaceAll("");
		String temp = after.replaceAll("\\p{P}", "");
		char[] ch = temp.trim().toCharArray();
		float chLength = ch.length;
		float count = 0;
		for (int i = 0; i < ch.length; i++) {
			char c = ch[i];
			if (!Character.isLetterOrDigit(c)) {
				if (!isChinese(c)) {
					count = count + 1;
				}//end if (!isChinese(c)) 
			}//end if (!Character.isLetterOrDigit(c))
		}//end for (int i = 0; i < ch.length; i++) 
		float result = count / chLength;
		if (result > 0.4) {
			return true;
		} else {
			return false;
		}//end if
	}
}
