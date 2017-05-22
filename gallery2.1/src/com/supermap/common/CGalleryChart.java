package com.supermap.common;

/**
 * 图集的常量
 * 
 * @author Linhao
 *
 */
public class CGalleryChart {
	/**echarts图*/
	public static final String CHART_TYPE_ECHARTS_NAME = "echarts";
	
	/**echarts图对应的值*/
	public static final int CHART_TYPE_ECHARTS_VALUE = 0;
	
	/**d3图*/
	public static final String CHART_TYPE_D3_NAME = "d3";

	/**d3图对应的值*/
	public static final int CHART_TYPE_D3_VALUE = 1;

	/**highcharts图*/
	public static final String CHART_TYPE_HIGHCHARTS_NAME = "highcharts";

	/**highcharts图对应的值*/
	public static final int CHART_TYPE_HIGHCHARTS_VALUE = 2;
	
	/**是否是SGIS成果保存:不是（默认）*/
	public static final short CHART_IS_FROM_SGIS_NO = 0;
	
	/**是否是SGIS成果保存:是*/
	public static final short CHART_IS_FROM_SGIS_YES = 1;

	/**图集权值的步数（相邻两个之间的差值）*/
	public static final int CHART_WEIGHT_STEP = 1;

	/**
	 * 取得类型值对应的名字
	 * 
	 * @param chartType
	 * 			类型值
	 * @return (默认echarts)
	 */
	public static final String getNameByValue(int chartType){
		String name = null;
		switch (chartType) {
		case CHART_TYPE_D3_VALUE:
			name =  CHART_TYPE_D3_NAME;
			break;
			case CHART_TYPE_HIGHCHARTS_VALUE:
			name = CHART_TYPE_HIGHCHARTS_NAME;
			break;
		default:
			name = CHART_TYPE_ECHARTS_NAME;
			break;
		}
		return name;
	};
}
