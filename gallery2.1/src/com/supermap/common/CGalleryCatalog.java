package com.supermap.common;

/**
 * 图集目录的常量
 * 
 * @author Linhao
 */
public class CGalleryCatalog {
	
	/**是否是私有：是否公开0,公开*/
	public static final short CATALOG_PRIVATE_NO = 0;

	/**是否是私有：是否公开1,私有*/
	public static final short CATALOG_PRIVATE_YES = 1;

	/**xml树存储用户信息的key:catalogPrivate*/
	public static final String TREE_USER_DATA_KEY_PRIVATE = "catalogPrivate";

	/**图集目录权值的步数（相邻两个之间的差值）*/
	public static final int CATALOG_WEIGHT_STEP = 1;
}
