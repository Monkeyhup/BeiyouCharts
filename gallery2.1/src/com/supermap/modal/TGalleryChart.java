package com.supermap.modal;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * TGalleryChart entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "T_GALLERY_CHART")
@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "tgalleryVisitses","handler","fieldHandler"})
public class TGalleryChart implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2502584297528277467L;

	// Fields
	private String id;
	private TGalleryCatalog TGalleryCatalog;
	private TGalleryUser TGalleryUser;
	private String chartName;
	private String chartMome;
	private Short chartType;
	private String chartParam;
	private String chartJson;
	private String chartImage;
	private BigDecimal createTime;
	private BigDecimal modifyTime;
	private BigDecimal chartShareCount;
	private String chartTypeChart;
	private Short chartIsfromSgis;
	private int chartWeight;
	private String chartImagePath;
	private Set<TGalleryVisits> TGalleryVisitses = new HashSet<TGalleryVisits>(
			0);

	// Constructors

	/** default constructor */
	public TGalleryChart() {
	}

	/** full constructor */
	public TGalleryChart(TGalleryCatalog TGalleryCatalog,
			TGalleryUser TGalleryUser, String chartName, String chartMome,
			Short chartType, String chartParam, String chartJson,
			String chartImage, BigDecimal createTime,
			BigDecimal modifyTime, BigDecimal chartShareCount,
			String chartTypeChart,Short chartIsfromSgis,int chartWeight,String chartImagePath,
			Set<TGalleryVisits> TGalleryVisitses) {
		this.TGalleryCatalog = TGalleryCatalog;
		this.TGalleryUser = TGalleryUser;
		this.chartName = chartName;
		this.chartMome = chartMome;
		this.chartType = chartType;
		this.chartParam = chartParam;
		this.chartJson = chartJson;
		this.chartImage = chartImage;
		this.createTime = createTime;
		this.modifyTime = modifyTime;
		this.chartShareCount = chartShareCount;
		this.chartTypeChart = chartTypeChart;
		this.chartIsfromSgis = chartIsfromSgis;
		this.chartWeight = chartWeight;
		this.chartImagePath = chartImagePath;
		this.TGalleryVisitses = TGalleryVisitses;
	}

	// Property accessors
//	@GenericGenerator(name = "generator", strategy = "uuid.hex")
//	@Id
//	@GeneratedValue(generator = "generator")
//	@Column(name = "ID", unique = true, nullable = false, length = 32)
	@Id
	@Column(length = 32, nullable = false)
	@GeneratedValue(generator = "uuid")   										   //???????????
	@GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")  //?????????
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CHART_CATALOG")
	public TGalleryCatalog getTGalleryCatalog() {
		return this.TGalleryCatalog;
	}

	public void setTGalleryCatalog(TGalleryCatalog TGalleryCatalog) {
		this.TGalleryCatalog = TGalleryCatalog;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CHART_USER")
	public TGalleryUser getTGalleryUser() {
		return this.TGalleryUser;
	}

	public void setTGalleryUser(TGalleryUser TGalleryUser) {
		this.TGalleryUser = TGalleryUser;
	}

	@Column(name = "CHART_NAME", length = 510)
	public String getChartName() {
		return this.chartName;
	}

	public void setChartName(String chartName) {
		this.chartName = chartName;
	}

	@Column(name = "CHART_MOME")
	public String getChartMome() {
		return this.chartMome;
	}

	public void setChartMome(String chartMome) {
		this.chartMome = chartMome;
	}

	@Column(name = "CHART_TYPE", precision = 4, scale = 0)
	public Short getChartType() {
		return this.chartType;
	}

	public void setChartType(Short chartType) {
		this.chartType = chartType;
	}

	@Column(name = "CHART_PARAM")
	public String getChartParam() {
		return this.chartParam;
	}

	public void setChartParam(String chartParam) {
		this.chartParam = chartParam;
	}

	@Column(name = "CHART_JSON")
	public String getChartJson() {
		return this.chartJson;
	}

	public void setChartJson(String chartJson) {
		this.chartJson = chartJson;
	}

	@Column(name = "CHART_IMAGE")
	public String getChartImage() {
		return this.chartImage;
	}

	public void setChartImage(String chartImage) {
		this.chartImage = chartImage;
	}

	@Column(name = "CREATE_TIME", precision = 20, scale = 0)
	public BigDecimal getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(BigDecimal createTime) {
		this.createTime = createTime;
	}

	@Column(name = "MODIFY_TIME", precision = 20, scale = 0)
	public BigDecimal getModifyTime() {
		return this.modifyTime;
	}

	public void setModifyTime(BigDecimal modifyTime) {
		this.modifyTime = modifyTime;
	}

	@Column(name = "CHART_SHARE_COUNT", precision = 22, scale = 0)
	public BigDecimal getChartShareCount() {
		return this.chartShareCount;
	}

	public void setChartShareCount(BigDecimal chartShareCount) {
		this.chartShareCount = chartShareCount;
	}

	@Column(name = "CHART_TYPE_CHART", length = 40)
	public String getChartTypeChart() {
		return this.chartTypeChart;
	}

	public void setChartTypeChart(String chartTypeChart) {
		this.chartTypeChart = chartTypeChart;
	}
	
	@Column(name = "CHART_IS_FROM_SGIS", precision = 4, scale = 0)
	public Short getChartIsfromSgis() {
		return this.chartIsfromSgis;
	}

	public void setChartIsfromSgis(Short chartIsfromSgis) {
		this.chartIsfromSgis = chartIsfromSgis;
	}

	@Column(name = "CHART_WEIGHT", precision = 10, scale = 0)
	public int getChartWeight() {
		return this.chartWeight;
	}

	public void setChartWeight(int chartWeight) {
		this.chartWeight = chartWeight;
	}

	@Column(name = "CHART_IMAGE_PATH", length = 1024)
	public String getChartImagePath() {
		return this.chartImagePath;
	}

	public void setChartImagePath(String chartImagePath) {
		this.chartImagePath = chartImagePath;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "TGalleryChart")
	public Set<TGalleryVisits> getTGalleryVisitses() {
		return this.TGalleryVisitses;
	}

	public void setTGalleryVisitses(Set<TGalleryVisits> TGalleryVisitses) {
		this.TGalleryVisitses = TGalleryVisitses;
	}

}