package com.supermap.param;
/**
 * 图库请求(保存成果)参数
 * 
 * @author Linhao
 */
public class GalleryChartAchieveParam {

	private String chartName;
	private String chartMome;
	private String chartImage;
	private String chartImagePath;

	/*此时存储的为：AID*/
	private String chartParam;
	public String getChartName() {
		return chartName;
	}
	public void setChartName(String chartName) {
		this.chartName = chartName;
	}
	public String getChartMome() {
		return chartMome;
	}
	public void setChartMome(String chartMome) {
		this.chartMome = chartMome;
	}
	public String getChartImage() {
		return chartImage;
	}
	public void setChartImage(String chartImage) {
		this.chartImage = chartImage;
	}
	public String getChartParam() {
		return chartParam;
	}
	public void setChartParam(String chartParam) {
		this.chartParam = chartParam;
	}
	public String getChartImagePath() {
		return chartImagePath;
	}
	public void setChartImagePath(String chartImagePath) {
		this.chartImagePath = chartImagePath;
	}
	
}
