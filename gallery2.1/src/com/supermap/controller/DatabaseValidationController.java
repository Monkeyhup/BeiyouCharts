package com.supermap.controller;

import com.supermap.common.CGalleryUser;
import com.supermap.modal.TGalleryUser;
import com.supermap.result.Result;
import com.supermap.service.TGalleryCatalogService;
import com.supermap.service.TGalleryChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * 数据库检验与升级接口
 * <p>
 *     说明：旧版本的数据库可能不存在catalogWeight字段，
 *          系统框架会通过（hibernate.hbm2ddl.auto=update）
 *          自动更新catalogWeight字段到数据库，但是值都为null，
 *          为了方便一键升级数据库，故扩展出以下接口用于快速初始化null值。
 * </p>
 * Created by Linhao on 2016/1/27.
 */
@Controller
@RequestMapping(value={"database"},produces={"application/json;charset=UTF-8"})
public class DatabaseValidationController extends BaseController{

    @Autowired
    private TGalleryCatalogService tGalleryCatalogService;

    @Autowired
    TGalleryChartService tGalleryChartService;

    /**
     * 验证数据库是否需要更新
     * <p>
     *     数据库的权值存在null的时候需要重置权值（赋值）
     * </p>
     * @param request
     * @return
     */
    @RequestMapping(value={"/check/weight"},method= RequestMethod.GET)
    @ResponseBody
    public Result checkWeight(HttpServletRequest request){
        Result result = new Result();

        TGalleryUser tGalleryUser = getSessionUser(request);
        //未登录
        if(tGalleryUser == null){
            result = getNoLoginResult();
            return result;
        }

        Short userAdmin = tGalleryUser.getUserAdmin();
        //不是管理员
        if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
            result.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
            result.appendln("消息提示：验证数据失败！非系统管理员，没有权限！");
            return result;
        }

        int catalogWeightNullCount = tGalleryCatalogService.getNullCatalogWeightCount();
        if(catalogWeightNullCount > 0){
            result.setCode(Result.RESULT_DATABASE_NEED_UPDATE);
            result.appendln("消息提示：存在"+catalogWeightNullCount+"条空【目录权值】需要更新！");
        }else{
            result.appendln("消息提示：不需要更新【    目录权值】！");
        }

        int chartWeightNullCount = tGalleryChartService.getNullChartWeightCount();
        if(chartWeightNullCount > 0){
            result.setCode(Result.RESULT_DATABASE_NEED_UPDATE);
            result.appendln("消息提示：存在"+chartWeightNullCount+"条空【图集权值】需要更新！");
        }else{
            result.appendln("消息提示：不需要更新【图集权值】！");
        }

        //以上条件都不成立
        if(result.getCode() != Result.RESULT_DATABASE_NEED_UPDATE){
            //不需要更新数据库
            result.setCode(Result.RESULT_OK);
        }

        return result;
    }

    /**
     * 重置权值
     * @param request
     * @return
     */
    @RequestMapping(value={"/reset/weight"},method= RequestMethod.GET)
    @ResponseBody
    public Result resetWeight(HttpServletRequest request){
        Result result = new Result();

        TGalleryUser tGalleryUser = getSessionUser(request);
        //未登录
        if(tGalleryUser == null){
            result = getNoLoginResult();
            return result;
        }

        Short userAdmin = tGalleryUser.getUserAdmin();
        //不是管理员
        if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
            result.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
            result.append("消息提示：重置权限失败！没有权限！");
            return result;
        }

        int catalogWeightNullCount = tGalleryCatalogService.getNullCatalogWeightCount();
        if(catalogWeightNullCount > 0){
            int catalogWeightCount= tGalleryCatalogService.reInitTGalleryCatalogWeightIfExistNull();
            if(catalogWeightCount > 0){
                //成功更新了【目录权值】赋值
                result.appendln("消息提示：存在"+catalogWeightNullCount+"条，已重新对"+catalogWeightCount+"条【目录权值】赋值！");
            }else{
                result.setCode(Result.RESULT_EXCUTE_FAIL);
                result.appendln("消息提示：存在"+catalogWeightNullCount+"条空【目录权值】赋值，但未重新赋值！");
            }
        }

        int chartWeightNullCount = tGalleryChartService.getNullChartWeightCount();
        if(chartWeightNullCount > 0){
            int chartWeightCount = tGalleryChartService.reInitTGalleryChartWeightIfExistNull();
            if(chartWeightCount > 0){
                //成功更新了【图集权值】赋值
                result.appendln("消息提示：存在"+chartWeightNullCount+"条，已重新对"+chartWeightCount+"条【图集权值】赋值！");
            }else{
                result.setCode(Result.RESULT_EXCUTE_FAIL);
                result.appendln("消息提示：存在"+chartWeightNullCount+"条空【图集权值】，但未重新赋值！");
            }
        }

        if(catalogWeightNullCount > 0 || chartWeightNullCount > 0){
            //存在需要重新赋值的
            if(result.getCode() != Result.RESULT_EXCUTE_FAIL){
                //都已经成功赋值
                result.setCode(Result.RESULT_OK);
            }
        }else{
            //不需要更新数据库
            result.setCode(Result.RESULT_OK);
            result.appendln("消息提示：当前数据库为最新数据库,不需要重置权限值！不需要一键升级...");
        }

        return result;
    }

    /**
     * 验证数据库是否需要更新
     * <p>
     *     数据库的imagePath字段是否存在为空的（赋值）
     * </p>
     * @param request
     * @return
     */
    @RequestMapping(value={"/check/imagePath"},method= RequestMethod.GET)
    @ResponseBody
    public Result checkImagePath(HttpServletRequest request){
        Result result = new Result();

        TGalleryUser tGalleryUser = getSessionUser(request);
        //未登录
        if(tGalleryUser == null){
            result = getNoLoginResult();
            return result;
        }

        Short userAdmin = tGalleryUser.getUserAdmin();
        //不是管理员
        if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
            result.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
            result.appendln("消息提示：验证数据失败！非系统管理员，没有权限！");
            return result;
        }

        int ImagePathNullCount = tGalleryChartService.getNullImagePathCount();
        if(ImagePathNullCount > 0){
            result.setCode(Result.RESULT_DATABASE_NEED_UPDATE);
            result.appendln("消息提示：存在"+ImagePathNullCount+"条空【图片路径】需要更新！");
        }else{
            result.appendln("消息提示：不需要更新【图片路径】！");
        }

        //以上条件都不成立
        if(result.getCode() != Result.RESULT_DATABASE_NEED_UPDATE){
            //不需要更新数据库
            result.setCode(Result.RESULT_OK);
        }

        return result;
    }

    /**
     * 验证数据库是否需要更新
     * <p>
     *     为chartImagePath字段赋值
     * </p>
     * @param request
     * @return
     */
    @RequestMapping(value={"/reset/imagePath"},method= RequestMethod.GET)
    @ResponseBody
    public Result reseImagePath(HttpServletRequest request){
        Result result = new Result();

        TGalleryUser tGalleryUser = getSessionUser(request);
        //未登录
        if(tGalleryUser == null){
            result = getNoLoginResult();
            return result;
        }

        Short userAdmin = tGalleryUser.getUserAdmin();
        //不是管理员
        if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
            result.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
            result.append("消息提示：重置权限失败！没有权限！");
            return result;
        }

        int ImagePathNullCount = tGalleryChartService.getNullImagePathCount();
        if(ImagePathNullCount > 0){
            int ImagePathCount= tGalleryChartService.reInitTGalleryChartImagePathIfExistNull(request);
            if(ImagePathCount > 0){
                //成功更新了【目录权值】赋值
                result.appendln("消息提示：存在"+ImagePathNullCount+"条，已重新对"+ImagePathCount+"条【目录权值】赋值！");
            }else{
                result.setCode(Result.RESULT_EXCUTE_FAIL);
                result.appendln("消息提示：存在"+ImagePathNullCount+"条空【目录权值】赋值，但未重新赋值！");
            }
        }


        if(ImagePathNullCount > 0){
            //存在需要重新赋值的
            if(result.getCode() != Result.RESULT_EXCUTE_FAIL){
                //都已经成功赋值
                result.setCode(Result.RESULT_OK);
            }
        }else{
            //不需要更新数据库
            result.setCode(Result.RESULT_OK);
            result.appendln("消息提示：当前数据库为最新数据库,不需要重置权限值！不需要一键升级...");
        }

        return result;
    }

}
