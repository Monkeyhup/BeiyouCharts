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
 * TGalleryUser entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "T_GALLERY_USER")
@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "tgalleryCharts","handler","fieldHandler"})
public class TGalleryUser implements java.io.Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 2020008963635198891L;

	// Fields

	private String id;
	private String userName;
	private String userLogin;
	private String userPassword;
	private String userMome;
	private Short userType;
	private Short userStatus;
	private Short userAdmin;
	private BigDecimal createTime;
	private BigDecimal modifyTime;
	private BigDecimal lastestTime;
	private Set<TGalleryChart> TGalleryCharts = new HashSet<TGalleryChart>(0);

	// Constructors

	/** default constructor */
	public TGalleryUser() {
	}

	/** full constructor */
	public TGalleryUser(String userName, String userLogin, String userPassword,
			String userMome, Short userType, Short userStatus, Short userAdmin,
			BigDecimal createTime, BigDecimal modifyTime,
			BigDecimal lastestTime, Set<TGalleryChart> TGalleryCharts) {
		this.userName = userName;
		this.userLogin = userLogin;
		this.userPassword = userPassword;
		this.userMome = userMome;
		this.userType = userType;
		this.userStatus = userStatus;
		this.userAdmin = userAdmin;
		this.createTime = createTime;
		this.modifyTime = modifyTime;
		this.lastestTime = lastestTime;
		this.TGalleryCharts = TGalleryCharts;
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

	@Column(name = "USER_NAME", length = 80)
	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Column(name = "USER_LOGIN", length = 80)
	public String getUserLogin() {
		return this.userLogin;
	}

	public void setUserLogin(String userLogin) {
		this.userLogin = userLogin;
	}

	@Column(name = "USER_PASSWORD", length = 80)
	public String getUserPassword() {
		return this.userPassword;
	}

	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}

	@Column(name = "USER_MOME", length = 200)
	public String getUserMome() {
		return this.userMome;
	}

	public void setUserMome(String userMome) {
		this.userMome = userMome;
	}

	@Column(name = "USER_TYPE", precision = 4, scale = 0)
	public Short getUserType() {
		return this.userType;
	}

	public void setUserType(Short userType) {
		this.userType = userType;
	}

	@Column(name = "USER_STATUS", precision = 4, scale = 0)
	public Short getUserStatus() {
		return this.userStatus;
	}

	public void setUserStatus(Short userStatus) {
		this.userStatus = userStatus;
	}

	@Column(name = "USER_ADMIN", precision = 4, scale = 0)
	public Short getUserAdmin() {
		return this.userAdmin;
	}

	public void setUserAdmin(Short userAdmin) {
		this.userAdmin = userAdmin;
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

	@Column(name = "LASTEST_TIME", precision = 20, scale = 0)
	public BigDecimal getLastestTime() {
		return this.lastestTime;
	}

	public void setLastestTime(BigDecimal lastestTime) {
		this.lastestTime = lastestTime;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "TGalleryUser")
	public Set<TGalleryChart> getTGalleryCharts() {
		return this.TGalleryCharts;
	}

	public void setTGalleryCharts(Set<TGalleryChart> TGalleryCharts) {
		this.TGalleryCharts = TGalleryCharts;
	}

}