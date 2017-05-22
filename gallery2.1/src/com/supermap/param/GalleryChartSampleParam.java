package com.supermap.param;

/**
 * 图库请求简单参数
 * 
 * @author Linhao
 */
public class GalleryChartSampleParam extends GalleryChartUpdateParam{

	private Short chartType;
	private String chartTypeChart;

	public Short getChartType() {
		return chartType;
	}
	public void setChartType(Short chartType) {
		this.chartType = chartType;
	}
	public String getChartTypeChart() {
		return chartTypeChart;
	}
	public void setChartTypeChart(String chartTypeChart) {
		this.chartTypeChart = chartTypeChart;
	}
}
