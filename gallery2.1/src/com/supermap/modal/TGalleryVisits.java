package com.supermap.modal;

import java.math.BigDecimal;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

/**
 * TGalleryVisits entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "T_GALLERY_VISITS")
public class TGalleryVisits implements java.io.Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8183871154861928794L;

	// Fields

	private String id;
	private TGalleryChart TGalleryChart;
	private String visistsName;
	private BigDecimal visistsTime;
	private BigDecimal visistsIp;
	private String visistsDevice;

	// Constructors

	/** default constructor */
	public TGalleryVisits() {
	}

	/** full constructor */
	public TGalleryVisits(TGalleryChart TGalleryChart, String visistsName,
			BigDecimal visistsTime, BigDecimal visistsIp, String visistsDevice) {
		this.TGalleryChart = TGalleryChart;
		this.visistsName = visistsName;
		this.visistsTime = visistsTime;
		this.visistsIp = visistsIp;
		this.visistsDevice = visistsDevice;
	}

	// Property accessors
//	@GenericGenerator(name = "generator", strategy = "uuid.hex")
//	@Id
//	@GeneratedValue(generator = "generator")
//	@Column(name = "ID", unique = true, nullable = false, length = 32)
	@Id
	@Column(length = 32, nullable = false)
	@GeneratedValue(generator = "uuid")   										   //指定生成器名称
	@GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")  //生成器名称，
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "VISISTS_CHART")
	public TGalleryChart getTGalleryChart() {
		return this.TGalleryChart;
	}

	public void setTGalleryChart(TGalleryChart TGalleryChart) {
		this.TGalleryChart = TGalleryChart;
	}

	@Column(name = "VISISTS_NAME", length = 80)
	public String getVisistsName() {
		return this.visistsName;
	}

	public void setVisistsName(String visistsName) {
		this.visistsName = visistsName;
	}

	@Column(name = "VISISTS_TIME", precision = 20, scale = 0)
	public BigDecimal getVisistsTime() {
		return this.visistsTime;
	}

	public void setVisistsTime(BigDecimal visistsTime) {
		this.visistsTime = visistsTime;
	}

	@Column(name = "VISISTS_IP", precision = 20, scale = 0)
	public BigDecimal getVisistsIp() {
		return this.visistsIp;
	}

	public void setVisistsIp(BigDecimal visistsIp) {
		this.visistsIp = visistsIp;
	}

	@Column(name = "VISISTS_DEVICE", length = 40)
	public String getVisistsDevice() {
		return this.visistsDevice;
	}

	public void setVisistsDevice(String visistsDevice) {
		this.visistsDevice = visistsDevice;
	}

}