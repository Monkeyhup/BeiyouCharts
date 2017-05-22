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
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * TGalleryCatalog entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "T_GALLERY_CATALOG")
@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "tgalleryCharts","handler","fieldHandler"})
public class TGalleryCatalog implements java.io.Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = -1988156844338073843L;

	// Fields
	private int id;
	private String catalogName;
	private BigDecimal createTime;
	private BigDecimal modifyTime;
	private int parentId;
	private Short catalogPrivate;
	private int catalogWeight;
	private Set<TGalleryChart> TGalleryCharts = new HashSet<TGalleryChart>(0);

	// Constructors

	/** default constructor */
	public TGalleryCatalog() {
	}

	/** full constructor */
	public TGalleryCatalog(String catalogName, BigDecimal createTime,
						   BigDecimal modifyTime, int parentId, Short catalogPrivate,int catalogWeight,
						   Set<TGalleryChart> TGalleryCharts) {
		this.catalogName = catalogName;
		this.createTime = createTime;
		this.modifyTime = modifyTime;
		this.parentId = parentId;
		this.catalogPrivate = catalogPrivate;
		this.catalogWeight = catalogWeight;
		this.TGalleryCharts = TGalleryCharts;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "ID", unique = true, nullable = false, precision = 10, scale = 0)
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(name = "CATALOG_NAME", length = 400)
	public String getCatalogName() {
		return this.catalogName;
	}

	public void setCatalogName(String catalogName) {
		this.catalogName = catalogName;
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

	@Column(name = "PARENT_ID", precision = 10, scale = 0)
	public int getParentId() {
		return this.parentId;
	}

	public void setParentId(int parentId) {
		this.parentId = parentId;
	}

	@Column(name = "CATALOG_PRIVATE", precision = 4, scale = 0)
	public Short getCatalogPrivate() {
		return this.catalogPrivate;
	}

	public void setCatalogPrivate(Short catalogPrivate) {
		this.catalogPrivate = catalogPrivate;
	}

	@Column(name = "CATALOG_WEIGHT", precision = 10, scale = 0)
	public int getCatalogWeight() {
		return this.catalogWeight;
	}

	public void setCatalogWeight(int catalogWeight) {
		this.catalogWeight = catalogWeight;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "TGalleryCatalog")
	public Set<TGalleryChart> getTGalleryCharts() {
		return this.TGalleryCharts;
	}

	public void setTGalleryCharts(Set<TGalleryChart> TGalleryCharts) {
		this.TGalleryCharts = TGalleryCharts;
	}

}