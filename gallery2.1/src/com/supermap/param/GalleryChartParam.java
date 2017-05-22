package com.supermap.param;

import java.math.BigDecimal;

/**
 * 图库请求参数
 * 
 * @author Linhao
 */
public class GalleryChartParam extends GalleryChartSampleParam {
	private String id;
	private int chartCatalog;
	private String chartUser;
	private BigDecimal createTime;
	private BigDecimal modifyTime;
	private BigDecimal chartShareCount;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getChartCatalog() {
		return chartCatalog;
	}
	public void setChartCatalog(int chartCatalog) {
		this.chartCatalog = chartCatalog;
	}
	public String getChartUser() {
		return chartUser;
	}
	public void setChartUser(String chartUser) {
		this.chartUser = chartUser;
	}
	
	public BigDecimal getCreateTime() {
		return createTime;
	}
	public void setCreateTime(BigDecimal createTime) {
		this.createTime = createTime;
	}
	public BigDecimal getModifyTime() {
		return modifyTime;
	}
	public void setModifyTime(BigDecimal modifyTime) {
		this.modifyTime = modifyTime;
	}
	public BigDecimal getChartShareCount() {
		return chartShareCount;
	}
	public void setChartShareCount(BigDecimal chartShareCount) {
		this.chartShareCount = chartShareCount;
	}
}
