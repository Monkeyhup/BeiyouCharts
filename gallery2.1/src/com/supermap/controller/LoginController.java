package com.supermap.controller;

import java.math.BigDecimal;
import java.util.List;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.supermap.common.CGalleryUser;
import com.supermap.modal.TGalleryUser;
import com.supermap.result.ObjectResult;
import com.supermap.result.Result;
import com.supermap.service.TGalleryUserService;

/**
 * 用户登录
 * 
 * @author Linhao
 *
 */
@Controller
@RequestMapping(value={"user"},produces={"application/json;charset=UTF-8"})
public class LoginController extends BaseController{
	
	@Autowired
	TGalleryUserService tGalleryUserService;
	
	/**
	 * 创建一条记录
	 * @param request
	 * @return
	 */
	@RequestMapping(value={"/is/login"},method=RequestMethod.GET)
    @ResponseBody
    public Result isLogin(HttpServletRequest request){
		Result result = new Result();
		
		TGalleryUser tGalleryUser = getSessionUser(request);
		//模拟登陆
//		tGalleryUser = new TGalleryUser();
//		tGalleryUser.setId("test");
//		tGalleryUser.setUserLogin("admin");
//		tGalleryUser.setUserName("管理员");
		
//		result = new ObjectResult();
//		result.setCode(Result.RESULT_OK);
//		result.setMessage("用户已登录！");
//		((ObjectResult)result).setData(tGalleryUser);
		
		if(tGalleryUser != null){
			result = new ObjectResult();
			result.setCode(Result.RESULT_OK);
			result.setMessage("用户已登录！");
			((ObjectResult)result).setData(tGalleryUser);
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.setMessage("用户未登录或者超时！");
		}
		
		return result;
	}
	
	/**
	 * 注销一条记录
	 * @param request
	 * @return
	 */
	@RequestMapping(value={"/logout"},method=RequestMethod.GET)
    @ResponseBody
    public Result logout(HttpServletRequest request){
		Result result = new Result();
		
		TGalleryUser tGalleryUser = getSessionUser(request);
		if(tGalleryUser != null){
			//用户注销
			removeSessionUser(request);
			result.setCode(Result.RESULT_OK);
			result.setMessage("注销成功！！");
		}else{
			result.setCode(Result.RESULT_OK);
			result.setMessage("注销成功！用户已登录超时！");
		}
		
		return result;
	}
	
	/**
	 * 登录
	 * @param request
	 * 			
	 * @param userLogin
	 * 			
	 * @param userPassword
	 * 
	 * @return
	 */
	@RequestMapping(value={"/login"},method=RequestMethod.GET)
    @ResponseBody
    public ObjectResult login(HttpServletRequest request,String userLogin,String userPassword){
		ObjectResult result = new ObjectResult();
		if(userLogin == null || "".equals(userLogin)){
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.setMessage("用户登录失败！登录名不能为空！");
			return result;
		}
		
		if(userPassword == null || "".equals(userPassword)){
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.setMessage("用户登录失败！登录密码不能为空！");
			return result;
		}
		
		List<TGalleryUser> list = tGalleryUserService.login(userLogin, userPassword);
		if(list != null && list.size() > 0){
			TGalleryUser tGalleryUser = list.get(0);
			if(tGalleryUser != null){
				Short status = tGalleryUser.getUserStatus();
				if(status != null && status.intValue() == CGalleryUser.USER_STATUS_YES){
					setSessionUser(request, tGalleryUser);
					
					result.setCode(Result.RESULT_OK);
					result.setMessage("用户登录成功！");
					result.setData(tGalleryUser);
				}else{
					result.setCode(Result.RESULT_EXCUTE_FAIL);
					result.setMessage("用户登录失败！无效用户！");
				}
			}else{
				result.setCode(Result.RESULT_EXCUTE_FAIL);
				result.setMessage("用户登录失败！用户名或者密码错误！");
			}
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.setMessage("用户登录失败！用户名或者密码错误！");
		}
		
		return result;
	}

	/**
	 * 注册用户
	 * @param request
	 *
	 * @param tGalleryUser
	 * @return
	 */
	@RequestMapping(value={"/register"},method=RequestMethod.POST)
	@ResponseBody
	public Result register(HttpServletRequest request,@RequestBody TGalleryUser tGalleryUser){
		Result re = new Result();

		if(tGalleryUser != null){
			String userLogin = tGalleryUser.getUserLogin();
			if(userLogin == null || "".equals(userLogin)){
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("注册用户失败！-用户登录名不能为空！");
				return re;
			}

			String userPassword = tGalleryUser.getUserPassword();
			if(userPassword == null || "".equals(userPassword)){
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("注册用户失败！-用户密码不能为空！");
				return re;
			}

			//判断是否存在
			if(tGalleryUserService.checkIsExistuserLogin(userLogin
					,CGalleryUser.USER_TYPE_SELF_SYS)){
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("注册用户失败！-用户登录名已经存在！");
				return re;
			}

			//保证用户名不空
			String userName = tGalleryUser.getUserName();
			if(userName == null || "".equals(userName)){
				tGalleryUser.setUserName(userLogin);
			}

			//设置备注
			tGalleryUser.setUserMome(CGalleryUser.USER_MOME_SELF_SYS);
			//设置用户类型
			tGalleryUser.setUserType(CGalleryUser.USER_TYPE_SELF_SYS);
			//设置状态
			tGalleryUser.setUserStatus(CGalleryUser.USER_STATUS_YES);
			//设置管理
			tGalleryUser.setUserAdmin(CGalleryUser.USER_ADMIN_NO);

			long now = System.currentTimeMillis();
			//设置创建时间
			tGalleryUser.setCreateTime(new BigDecimal(now));
			//设置修改时间
			tGalleryUser.setModifyTime(new BigDecimal(now));
			//默认0
			tGalleryUser.setLastestTime(new BigDecimal(0));

			//--------------提交----------------
			boolean ok = tGalleryUserService.add(tGalleryUser);
			if(ok){
				re.setCode(Result.RESULT_OK);
				re.append("注册用户成功！");
			}else{
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("注册用户失败！");
			}
		}else{
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("注册用户失败！-参数不正确！");
		}
		return re;
	}


	/**
	 * 判断用户名是否存在
	 * @param request
	 * @param userLogin
	 * @return
	 */
	@RequestMapping(value={"/checkUserLogin/exist"},method=RequestMethod.GET)
	@ResponseBody
	public Result checkUserLogin(HttpServletRequest request,String userLogin){
		Result re = new Result();
		if(userLogin == null || "".equals(userLogin)){
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("创建用户失败！-用户登录名不能为空！");
			return re;
		}
		//判断是否存在
		if(tGalleryUserService.checkIsExistuserLogin(userLogin
				,CGalleryUser.USER_TYPE_SELF_SYS)){
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("用户登录名已经存在！");
		}else{
			re.setCode(Result.RESULT_OK);
			re.append("用户登录名可用！");
		}
		return re;
	}
}
