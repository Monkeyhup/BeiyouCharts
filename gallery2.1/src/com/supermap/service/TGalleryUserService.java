package com.supermap.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.supermap.dao.TGalleryUserDAO;
import com.supermap.modal.TGalleryUser;

@Service
public class TGalleryUserService  extends BaseService<TGalleryUser>{

	@Autowired
	TGalleryUserDAO tGalleryUserDAO;
	

	public List<TGalleryUser> list(){
		return tGalleryUserDAO.findAll();
	}

	/**
	 * 创建一条记录
	 */
	@Override
	public boolean add(TGalleryUser entity) {
		if(entity == null)
			return false;
		return tGalleryUserDAO.save(entity);
	}

	/**
	 * 更新一条记录
	 */
	@Override
	public boolean update(TGalleryUser entity) {
		if(entity == null)
			return false;
		return tGalleryUserDAO.update(entity);
	}

	/**
	 * 删除一条记录
	 */
	@Override
	public boolean delete(TGalleryUser entity) {
		if(entity == null)
			return false;
		return tGalleryUserDAO.delete(entity);
	}
	
	/**
	 * 获取指定用户名下的用户信息
	 * 
	 * @param userLogin
	 * 			登录名
	 * @return  
	 */
	public List<TGalleryUser> getTGalleryUserByuserLogin(String userLogin){
		return tGalleryUserDAO.getTGalleryUserByuserLogin(userLogin);
	}
	
	/**
	 * 判断是否存在用户登录名
	 * 
	 * @param userLogin
	 * 			用户登录名
	 * @return null和""都返回true
	 */
	public boolean checkIsExistuserLogin(String userLogin){
		if(userLogin == null || "".equals(userLogin)){
			return true;
		}
		
		int count = tGalleryUserDAO.getUserCountByuserLogin(userLogin);
		if(count > 0){
			return true;
		}
		return false;
	}

	/**
	 * 判断是否存在用户登录名
	 *
	 * @param userLogin
	 * 			用户登录名
	 * @param userType
	 * 			用户类型
	 * @return null和"" 都返回true
	 */
	public boolean checkIsExistuserLogin(String userLogin,short userType){
		if(userLogin == null || "".equals(userLogin)){
			return true;
		}

		int count = tGalleryUserDAO.getUserCountByuserLoginAnduserType(userLogin,userType);
		if(count > 0){
			return true;
		}
		return false;
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
	public List<TGalleryUser> login(String userLogin,String userPassword){
		return tGalleryUserDAO.login(userLogin,userPassword);
	}
}
