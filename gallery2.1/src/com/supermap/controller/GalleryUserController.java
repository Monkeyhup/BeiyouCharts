package com.supermap.controller;

import java.math.BigDecimal;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.supermap.common.CGalleryUser;
import com.supermap.modal.TGalleryUser;
import com.supermap.result.Result;
import com.supermap.service.TGalleryUserService;

/**
 * 用户接口
 * 
 * @author Linhao
 *
 */
@Controller
@RequestMapping(value={"user"},produces={"application/json;charset=UTF-8"})
public class GalleryUserController extends BaseController{
	
	@Autowired
	TGalleryUserService tGalleryUserService;
	
	/**
	 * 创建一条记录
	 * @param request
	 * 			
	 * @param tGalleryUser
	 * @return
	 */
	@RequestMapping(value={"/add"},method=RequestMethod.POST)
    @ResponseBody
    public Result add(HttpServletRequest request,@RequestBody TGalleryUser tGalleryUser){
		Result re = new Result();
		
		if(tGalleryUser != null){
			String userLogin = tGalleryUser.getUserLogin();
			if(userLogin == null || "".equals(userLogin)){
	            re.setCode(Result.RESULT_EXCUTE_FAIL);
	            re.append("创建用户失败！-用户登录名不能为空！");
	            return re;
			}
			
			String userPassword = tGalleryUser.getUserPassword();
			if(userPassword == null || "".equals(userPassword)){
	            re.setCode(Result.RESULT_EXCUTE_FAIL);
	            re.append("创建用户失败！-用户密码不能为空！");
	            return re;
			}
			
			//判断是否存在
			if(tGalleryUserService.checkIsExistuserLogin(userLogin)){
	            re.setCode(Result.RESULT_EXCUTE_FAIL);
	            re.append("创建用户失败！-用户登录名已经存在！");
	            return re;
			}
			
			//保证用户名不空
			String userName = tGalleryUser.getUserName();
			if(userName == null || "".equals(userName)){
				tGalleryUser.setUserName(userLogin);
			}
        	
        	//设置用户类型
        	if(tGalleryUser.getUserType() == null){
            	tGalleryUser.setUserType(CGalleryUser.USER_TYPE_SELF_SYS);
        	}
        	
        	//设置状态
        	if(tGalleryUser.getUserStatus() ==null){
            	tGalleryUser.setUserStatus(CGalleryUser.USER_STATUS_YES);
        	}
        	
        	//设置管理
        	if(tGalleryUser.getUserAdmin() == null){
            	tGalleryUser.setUserAdmin(CGalleryUser.USER_ADMIN_NO);
        	}
        	
        	long now = System.currentTimeMillis();
        	//设置创建时间
        	BigDecimal createTime = tGalleryUser.getCreateTime();
        	if(createTime == null || createTime.longValue() == 0){
        		tGalleryUser.setCreateTime(new BigDecimal(now));
        	}
        	
        	//设置修改时间
        	BigDecimal modifyTime = tGalleryUser.getModifyTime();
        	if(modifyTime == null || modifyTime.longValue() == 0){
        		tGalleryUser.setModifyTime(new BigDecimal(now));
        	}
        	
        	//默认0
        	tGalleryUser.setLastestTime(new BigDecimal(0));
        	
        	//--------------提交----------------
        	boolean ok = tGalleryUserService.add(tGalleryUser);
        	if(ok){
                re.setCode(Result.RESULT_OK);
                re.append("创建用户成功！");
        	}else{
                re.setCode(Result.RESULT_EXCUTE_FAIL);
                re.append("创建用户失败！");
        	}
		}else{
            re.setCode(Result.RESULT_EXCUTE_FAIL);
            re.append("创建用户失败！-参数不正确！");
		}
		return re;
	}
}
