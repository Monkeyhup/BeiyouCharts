package com.supermap.common;

/**
 * 用户常量
 * 
 * @author Linhao
 *
 */
public class CGalleryUser {
	
	/**
	 * 保存用户信息的key
	 */
	public static final String USER_SESSION_KEY = "user";

	/**
	 * 注册用户时的备注名：
	 */
	public static final String USER_MOME_SELF_SYS = "系统注册用户!";

	/**
	 * 注册用户时的备注名：
	 */
	public static final String USER_MOME_PRODUCE_SYS = "产品注册用户!";
	
	/**
	 * 用户类型：0，本系统用户
	 */
	public static final short USER_TYPE_SELF_SYS = 0;
	
	/**
	 * 用户类型：1，关联的产品用户，如SGIS
	 */
	public static final short USER_TYPE_PRODUCE_SYS = 1;
	
	/**
	 * 用户状态：0,无效
	 */
	public static final short USER_STATUS_NO = 0;
	
	/**
	 * 用户状态：1,有效
	 */
	public static final short USER_STATUS_YES = 1;
	
	/**
	 * 用户管理人员：0，普通用户
	 */
	public static final short USER_ADMIN_NO = 0;
	
	/**
	 * 用户管理人员：1，管理员
	 */
	public static final short USER_ADMIN_YES = 1; 
}
