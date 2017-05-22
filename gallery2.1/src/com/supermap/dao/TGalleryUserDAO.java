package com.supermap.dao;

import com.supermap.modal.TGalleryUser;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

/**
 * A data access object (DAO) providing persistence and search support for
 * TGalleryUser entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.supermap.modal.TGalleryUser
 * @author MyEclipse Persistence Tools
 */
@Repository
public class TGalleryUserDAO extends BaseHibernateDAO<TGalleryUser> {
	private static final Logger log = LoggerFactory.getLogger(TGalleryUserDAO.class);
	
	@Override
	public List<TGalleryUser> findAll() {
		return findByHql("FROM TGalleryUser");
	}
	
	/**
	 * 获取指定用户名下的用户信息
	 * 
	 * @param userLogin
	 * 			登录名
	 * @return  
	 */
	public List<TGalleryUser> getTGalleryUserByuserLogin(String userLogin) {
		return findByHql("FROM TGalleryUser t where t.userLogin=?0",userLogin);
	}

	/**
	* 获取指定用户名的个数
	* @param userLogin
	* 			登录名
	* @return
			*/
	public int getUserCountByuserLogin(String userLogin){
		return findCountByHql("FROM TGalleryUser t where t.userLogin=?0",userLogin);
	}

	/**
	 * 获取指定用户名和类型下的个数
	 * @param userLogin
	 * 			登录名
	 * @param userType
	 * 			用户类型
	 * @return
	 */
	public int getUserCountByuserLoginAnduserType(String userLogin,short userType){
		return findCountByHql("FROM TGalleryUser t where t.userLogin=?0 and t.userType=?1",userLogin,userType);
	}
	
	/**
	 * 登录
	 * 
	 * @param userLogin
	 * 			登录名
	 * @param userPassword
	 * 			登录密码
	 * @return
	 */
	public List<TGalleryUser> login(String userLogin, String userPassword) {
		return findByHql("FROM TGalleryUser t where t.userLogin=?0 and t.userPassword=?1",
				userLogin,userPassword);
	}

	
}