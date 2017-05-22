package com.supermap.controller;

import java.math.BigDecimal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.supermap.common.CGalleryUser;
import com.supermap.modal.TGalleryUser;
import com.supermap.result.ObjectResult;
import com.supermap.result.Result;
import com.supermap.service.TGalleryUserService;

/**
 * 图库图集与SGIS系统的关联控制器
 * 
 * @author Linhao
 *
 */
@Controller
@RequestMapping(value={"gallery"},produces={"application/json;charset=UTF-8"})
public class GalleryRelationSgisController extends BaseController{
	@Autowired
	TGalleryUserService tGalleryUserService;
	
	/**
	 * 自动登录图库系统
	 * @param request
	 * @param userLogin
	 * @param userName
	 * @param isAdmin
	 * @return
	 */
	@RequestMapping(value={"/sgis/auto/login"},method=RequestMethod.POST)
    @ResponseBody
    public ObjectResult redirect(HttpServletRequest request,String userLogin,String userName,boolean isAdmin){
		ObjectResult result = new ObjectResult();
		
		if(userLogin == null || userLogin.isEmpty()){
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.setMessage("自动登录失败！登录名不能为空！");
	        return result;
		}
		
		//当前是否登录
		TGalleryUser currentUser = getSessionUser(request);
		if(currentUser != null){
			String currentUserLogin = currentUser.getUserLogin();
			Short currentUserType = currentUser.getUserType();
			
			//当前用户已经登录(并且是产品用户)
			if(currentUserLogin.equals(userLogin) 
					&& (currentUserType != null && currentUserType == CGalleryUser.USER_TYPE_PRODUCE_SYS)){
				result.setCode(Result.RESULT_OK);
				result.setMessage("自动登录成功！");
				result.setData(currentUser);
		        return result;
			}else{
				//不是当前用户(先移除当前session)				
				removeSessionUser(request);
			}
		}
		
		//密码
		String userPassword = userLogin + reverseString(userLogin);
		List<TGalleryUser> list = tGalleryUserService.login(userLogin,userPassword);
		if(list != null && list.size() > 0){
			TGalleryUser tGalleryUser = list.get(0);
			if(tGalleryUser != null){
				Short userType = tGalleryUser.getUserType();
				if((userType != null && userType == CGalleryUser.USER_TYPE_PRODUCE_SYS)){
					//添加session信息
					setSessionUser(request, tGalleryUser);
					result.setCode(Result.RESULT_OK);
					result.setMessage("自动登录成功！");
					result.setData(tGalleryUser);
			        return result;
				}
			}
		}
		
		//默认用户名为登录名
		if(userName == null || userName.isEmpty()){
			userName = userLogin;
		}
		
		//构建新的用户信息
		TGalleryUser entity = new TGalleryUser();
		entity.setUserLogin(userLogin);
		entity.setUserName(userName);
		entity.setUserPassword(userPassword);
		entity.setUserMome(CGalleryUser.USER_MOME_PRODUCE_SYS);
		entity.setUserStatus(CGalleryUser.USER_STATUS_YES);
		entity.setUserType(CGalleryUser.USER_TYPE_PRODUCE_SYS);
		entity.setUserAdmin(isAdmin ? CGalleryUser.USER_ADMIN_YES : CGalleryUser.USER_ADMIN_NO);

		long now = System.currentTimeMillis();
		entity.setCreateTime(new BigDecimal(now));
		entity.setModifyTime(new BigDecimal(now));
		entity.setLastestTime(new BigDecimal(0));
		
		//添加新用户
		boolean isAdded = tGalleryUserService.add(entity);
		if(isAdded){
			//添加session信息
			setSessionUser(request, entity);
			result.setCode(Result.RESULT_OK);
			result.setMessage("自动登录成功！");
			result.setData(entity);
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.setMessage("自动登录失败！");
		}
		
		
        return result;
    }
	
	/**
	 * 图库做一个重定向
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value={"/http"},method=RequestMethod.GET)
    @ResponseBody
    public ModelAndView redirect(HttpServletRequest request){
		
        return new ModelAndView("redirect:../../http/");
    }
	
	/**
	 * 字符串逆序
	 * @param s
	 * @return
	 */
	private String reverseString(String s){
		StringBuilder sb = new StringBuilder();
		
		if(s.length() > 0){
			for (int i = s.length()-1; i >= 0; i--) {
				sb.append(s.charAt(i));
			}
		}
		
		return sb.toString();
	}
}
