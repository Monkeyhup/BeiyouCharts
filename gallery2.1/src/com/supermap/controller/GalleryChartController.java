package com.supermap.controller;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.supermap.common.*;
import com.supermap.param.GalleryChartUpdateParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.supermap.modal.TGalleryCatalog;
import com.supermap.modal.TGalleryChart;
import com.supermap.modal.TGalleryUser;
import com.supermap.param.GalleryChartSampleParam;
import com.supermap.param.GalleryChartAchieveParam;
import com.supermap.param.GalleryChartParam;
import com.supermap.result.ObjectResult;
import com.supermap.result.Result;
import com.supermap.service.TGalleryCatalogService;
import com.supermap.service.TGalleryChartService;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * 图集接口
 * 
 * @author Linhao
 */
@Controller
@RequestMapping(value={"chart"},produces={"application/json;charset=UTF-8"})
public class GalleryChartController extends BaseController{
	@Autowired
	TGalleryCatalogService tGalleryCatalogService;
	
	@Autowired
	TGalleryChartService tGalleryChartService;
	
	/**
	 * 创建一条位于私人目录下的记录
	 * @param request
	 * @param gallerChartChartSampleParam
	 * @return
	 */
	@RequestMapping(value={"/add/private"},method=RequestMethod.POST)
    @ResponseBody
    public Result addPrivateChart(HttpServletRequest request,
    		@RequestBody GalleryChartSampleParam gallerChartChartSampleParam){
		Result re = new Result();
		TGalleryUser tGalleryUser = getSessionUser(request);
    	//未登录
    	if(tGalleryUser == null){
    		re = getNoLoginResult();
    		return re;
    	}
		
    	//取得图集所在的私人目录
    	TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getPrivateRootTGalleryCatalog();
    	if(tGalleryCatalog == null){
    		re.setCode(Result.RESULT_EXCUTE_FAIL);
    		re.setMessage("创建图集失败，私人图集目录无法找到，请联系管理员！");
    		return re;
    	}
    	
		if(gallerChartChartSampleParam != null){
			//创建对象
			TGalleryChart tGalleryChart = new TGalleryChart();
			tGalleryChart.setTGalleryUser(tGalleryUser);
			tGalleryChart.setTGalleryCatalog(tGalleryCatalog);



			tGalleryChart.setChartImage(gallerChartChartSampleParam.getChartImage());
			tGalleryChart.setChartJson(gallerChartChartSampleParam.getChartJson());
			tGalleryChart.setChartParam(gallerChartChartSampleParam.getChartParam());
			tGalleryChart.setChartName(gallerChartChartSampleParam.getChartName());
			tGalleryChart.setChartMome(gallerChartChartSampleParam.getChartMome());
			tGalleryChart.setChartType(gallerChartChartSampleParam.getChartType());
        	tGalleryChart.setChartTypeChart(gallerChartChartSampleParam.getChartTypeChart());
        	tGalleryChart.setChartIsfromSgis(CGalleryChart.CHART_IS_FROM_SGIS_NO);

        	long now = System.currentTimeMillis();
        	//设置创建时间
    		tGalleryChart.setCreateTime(new BigDecimal(now));
        	//设置修改时间
    		tGalleryChart.setModifyTime(new BigDecimal(now));
        		
        	//初始化分享量
        	tGalleryChart.setChartShareCount(new BigDecimal(0));

			//设置图集权值（新增的权值为最大）
			int currentMaxChartWeight = tGalleryChartService.getCurrentMaxChartWeight();
			tGalleryChart.setChartWeight(currentMaxChartWeight + CGalleryChart.CHART_WEIGHT_STEP);
        	


			//生成图库首页的图片
			if(gallerChartChartSampleParam.getChartImage()!=null) {
				String chartImagePath=ImagePathController.chartImagePath(gallerChartChartSampleParam.getChartImage(),request);
				tGalleryChart.setChartImagePath(chartImagePath);
			}
			boolean ok = tGalleryChartService.add(tGalleryChart);
			if (ok){
        		re = new ObjectResult();
                re.setCode(Result.RESULT_OK);
                re.append("创建图集成功！");
                ((ObjectResult)re).setData(tGalleryChart);
        	}else{
                re.setCode(Result.RESULT_EXCUTE_FAIL);
                re.append("创建图集失败！");
        	}
        }else{
            re.setCode(Result.RESULT_EXCUTE_FAIL);
            re.append("创建图集失败！-参数不正确！");
        }
        
        return re;
    } 
	
	/**
	 * 创建一条记录
	 * @param request
	 * @param gallerChartParam
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}/add"},method=RequestMethod.POST)
    @ResponseBody
    public Result add(HttpServletRequest request,@PathVariable("catalogId") int catalogId,
    		@RequestBody GalleryChartParam gallerChartParam){
		Result re = new Result();
		TGalleryUser tGalleryUser = getSessionUser(request);
    	//未登录
    	if(tGalleryUser == null){
    		re = getNoLoginResult();
    		return re;
    	}
		
    	//取得图集所在的目录
    	TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
    	if(tGalleryCatalog == null){
    		re.setCode(Result.RESULT_EXCUTE_FAIL);
    		re.setMessage("创建图集失败，图集目录无法找到！");
    		return re;
    	}
    	
		if(gallerChartParam != null){
			//创建对象
			TGalleryChart tGalleryChart = new TGalleryChart();
			tGalleryChart.setTGalleryUser(tGalleryUser);
			tGalleryChart.setTGalleryCatalog(tGalleryCatalog);
        	
        	tGalleryChart.setChartImage(gallerChartParam.getChartImage());
        	tGalleryChart.setChartJson(gallerChartParam.getChartJson());
        	tGalleryChart.setChartParam(gallerChartParam.getChartParam());
        	tGalleryChart.setChartName(gallerChartParam.getChartName());
        	tGalleryChart.setChartMome(gallerChartParam.getChartMome());
        	tGalleryChart.setChartType(gallerChartParam.getChartType());
        	tGalleryChart.setChartTypeChart(gallerChartParam.getChartTypeChart());
        	tGalleryChart.setChartIsfromSgis(CGalleryChart.CHART_IS_FROM_SGIS_NO);
			tGalleryChart.setChartImagePath(gallerChartParam.getChartImagePath());
        	long now = System.currentTimeMillis();
        	//设置创建时间
        	BigDecimal createTime = gallerChartParam.getCreateTime();
        	if(createTime == null || createTime.longValue() == 0){
        		tGalleryChart.setCreateTime(new BigDecimal(now));
        	}
        	
        	//设置修改时间
        	BigDecimal modifyTime = gallerChartParam.getModifyTime();
        	if(modifyTime == null || modifyTime.longValue() == 0){
        		tGalleryChart.setModifyTime(new BigDecimal(now));
        	}
        		
        	//初始化分享量
        	tGalleryChart.setChartShareCount(new BigDecimal(0));

			//设置图集权值（新增的权值为最大）
			int currentMaxChartWeight = tGalleryChartService.getCurrentMaxChartWeight();
			tGalleryChart.setChartWeight(currentMaxChartWeight + CGalleryChart.CHART_WEIGHT_STEP);
        	
        	boolean ok = tGalleryChartService.add(tGalleryChart);
        	if(ok){
                re.setCode(Result.RESULT_OK);
                re.append("创建图集成功！");
        	}else{
                re.setCode(Result.RESULT_EXCUTE_FAIL);
                re.append("创建图集失败！");
        	}
        }else{
            re.setCode(Result.RESULT_EXCUTE_FAIL);
            re.append("创建图集失败！-参数不正确！");
        }
        
        return re;
    } 
	
	/**
	 * 创建一条记录(sgis的成果保存记录)
	 * 
	 * @param request
	 * @param galleryChartAchieveParam
	 * @return
	 */
	@RequestMapping(value={"/data/achieve"},method=RequestMethod.POST)
    @ResponseBody
    public Result addDataAchieve(HttpServletRequest request,
    		@RequestBody GalleryChartAchieveParam galleryChartAchieveParam){
		Result re = new Result();
		TGalleryUser tGalleryUser = getSessionUser(request);
    	//未登录
    	if(tGalleryUser == null){
    		re = getNoLoginResult();
    		return re;
    	}
		
    	//取得图集所在的私人目录
    	TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getPrivateRootTGalleryCatalog();
    	if(tGalleryCatalog == null){
    		re.setCode(Result.RESULT_EXCUTE_FAIL);
    		re.setMessage("创建图集（成果保存）失败，私人图集目录无法找到，请联系管理员！");
    		return re;
    	}
    	
		if(galleryChartAchieveParam != null){
			//创建对象
			TGalleryChart tGalleryChart = new TGalleryChart();
			tGalleryChart.setTGalleryUser(tGalleryUser);
			tGalleryChart.setTGalleryCatalog(tGalleryCatalog);
        	
        	tGalleryChart.setChartImage(galleryChartAchieveParam.getChartImage());         ///////////////////////////
        	tGalleryChart.setChartParam(galleryChartAchieveParam.getChartParam());
        	tGalleryChart.setChartName(galleryChartAchieveParam.getChartName());
        	tGalleryChart.setChartMome(galleryChartAchieveParam.getChartMome());
			tGalleryChart.setChartImagePath(galleryChartAchieveParam.getChartImagePath());  /////////////////////////
        	
        	//标记为成果保存
        	tGalleryChart.setChartIsfromSgis(CGalleryChart.CHART_IS_FROM_SGIS_YES);
			
        	long now = System.currentTimeMillis();
        	//设置创建时间
    		tGalleryChart.setCreateTime(new BigDecimal(now));
        	//设置修改时间
    		tGalleryChart.setModifyTime(new BigDecimal(now));
        		
        	//初始化分享量
        	tGalleryChart.setChartShareCount(new BigDecimal(0));

			//设置图集权值（新增的权值为最大）
			int currentMaxChartWeight = tGalleryChartService.getCurrentMaxChartWeight();
			tGalleryChart.setChartWeight(currentMaxChartWeight + CGalleryChart.CHART_WEIGHT_STEP);
        	
        	boolean ok = tGalleryChartService.add(tGalleryChart);
        	if(ok){
        		re = new ObjectResult();
                re.setCode(Result.RESULT_OK);
                re.append("创建图集（成果保存）成功！");
                ((ObjectResult)re).setData(tGalleryChart);
        	}else{
                re.setCode(Result.RESULT_EXCUTE_FAIL);
                re.append("创建图集（成果保存）失败！");
        	}
        }else{
            re.setCode(Result.RESULT_EXCUTE_FAIL);
            re.append("创建图集（成果保存）失败！-参数不正确！");
        }
        
        return re;
    } 
	
	/**
	 * 列表指定目录下（包括子目录）的数据
	 * <p style="color:red;">
	 * 	注意：<br/>
	 * 		1.如果catalogId为根的话，取得的是所有的公共的图和私人(如果登录)的图<br/>
	 * 		2.如果catalogId不是根的话，取得的是其节点和所有子节点的图集<br/>
	 * </p>
	 * @param request
	 * @param catalogId
	 * @param keyword
	 * @param paging
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}/list/all"},method=RequestMethod.GET)
    @ResponseBody
    public ObjectResult listAllBycatalogId(HttpServletRequest request,@PathVariable("catalogId") int catalogId,
    		String keyword,@RequestBody Paging paging){
		ObjectResult result = new ObjectResult();
		
		if(keyword != null){
			keyword = keyword.trim();
		}

		PageInfo pageInfo = paging.toPageInfo();

		//取得用户的登录信息
		TGalleryUser tGalleryUser = getSessionUser(request);

		List<TGalleryChart>	list = null;
		//获取根下的图集
		if(CParentNode.ROOT_NODE_VALUE == catalogId){
			list = tGalleryChartService.listPublicChartAndUserChart(tGalleryUser,keyword,pageInfo);
		}else{
			//获取非根下的图集
			
			TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
			if(tGalleryCatalog == null){
				result.setCode(Result.RESULT_EXCUTE_FAIL);
				result.append("取得指定目录下的图集列表失败！无法找到指定的图集目录！");
				return result;
			}

			//获取指定节点下的所有子节点列表
			List<BigDecimal> catalogIds = tGalleryCatalogService.listAllChildrenCatalogBycatalogId(catalogId);
			
			Short catalogPrivate = tGalleryCatalog.getCatalogPrivate();
			//--当前节点为私有节点--
			if(catalogPrivate != null && catalogPrivate.shortValue() == CGalleryCatalog.CATALOG_PRIVATE_YES){
				if(tGalleryUser == null){
					//未登录
					result.setCode(Result.RESULT_EXCUTE_FAIL);
					result.append("取得指定目录下的图集列表失败！未登录，无法获取私人图集！");
				}else{
					//取得其节点和所有子节点的图集
					list = tGalleryChartService.listAllBycatalogIds(catalogIds,tGalleryUser,keyword,pageInfo);
				}
			}else{
				//--不是私有的节点--
				//取得其节点和所有子节点的图集
				list = tGalleryChartService.listAllBycatalogIds(catalogIds,keyword,pageInfo);
			}
		}

		if(list != null){
			result.setCode(Result.RESULT_OK);
			result.append("取得指定目录下的图集列表成功！");
			result.setData(list);
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.append("取得指定目录下的图集列表失败！");
		}
		
		return result;
	}
	
	/**
	 * 列表指定目录下(当前目录)的数据
	 * @param request
	 * @param catalogId
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}/list/current"},method=RequestMethod.GET)
    @ResponseBody
    public ObjectResult listBycatalogId(HttpServletRequest request,@PathVariable("catalogId") int catalogId){
		ObjectResult result = new ObjectResult();
		
		//取得图集所在的目录
    	TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
    	if(tGalleryCatalog == null){
    		result.setCode(Result.RESULT_EXCUTE_FAIL);
    		result.setMessage("列表图集失败，图集目录无法找到！");
    		return result;
    	}
    	
    	List<TGalleryChart> list = tGalleryChartService.listBycatalogId(catalogId);
    	if(list != null){
    		result.setCode(Result.RESULT_OK);
    		result.setMessage("列表图集成功！");
    		result.setData(list);
    	}else{
    		result.setCode(Result.RESULT_EXCUTE_FAIL);
    		result.setMessage("列表图集失败！");
    	}
		
		return result;
	} 
	
	/**
	 * 列表指定一个或者多个chartId下的图集信息
	 * @param request
	 * @param chartIds
	 * 			一个或者多个图集id
	 * @return
	 */
	@RequestMapping(value={"/list/chartids"},method=RequestMethod.GET)
    @ResponseBody
    public ObjectResult listBychartIds(HttpServletRequest request,@RequestBody String[] chartIds){
		ObjectResult result = new ObjectResult();
    	
    	if(chartIds != null){
    		
    		List<TGalleryChart> list = tGalleryChartService.listBychartIds(chartIds);
    		if(list != null){
        		result.setCode(Result.RESULT_OK);
        		result.setMessage("列表图集成功！");
        		result.setData(list);
    		}else{
        		result.setCode(Result.RESULT_EXCUTE_FAIL);
        		result.setMessage("列表图集失败！");
    		}
    	}else{
    		result.setCode(Result.RESULT_EXCUTE_FAIL);
    		result.setMessage("列表图集失败！");
    	}
		
		return result;
	} 
	
	/**
	 * 读取指定chartId下的图集信息
	 * @param request
	 * @param chartId
	 * 			图集id
	 * @return
	 */
	@RequestMapping(value={"/{chartid}"},method=RequestMethod.GET)
    @ResponseBody
    public ObjectResult getOne(HttpServletRequest request,@PathVariable("chartid") String chartId){
		ObjectResult result = new ObjectResult();
    	
    	if(chartId != null && !"".equals(chartId)){
    		TGalleryChart tGalleryChart = tGalleryChartService.getGalleryChartByChartId(chartId);
    		if(tGalleryChart != null){
    			TGalleryCatalog tGalleryCatalog = tGalleryChart.getTGalleryCatalog();
    			if(tGalleryCatalog != null){
    				Short catalogPrivate = tGalleryCatalog.getCatalogPrivate();
    				//如果是私有的
    				if(catalogPrivate != null && catalogPrivate.shortValue() == CGalleryCatalog.CATALOG_PRIVATE_YES){
    	    			TGalleryUser currentTGalleryUser = getSessionUser(request);
    	    			if(currentTGalleryUser != null){
    	    				Short userAdmin = currentTGalleryUser.getUserAdmin();
    	    				//不是管理员
    	    				if(userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES){
    	    					//图集所属用户
    	    					TGalleryUser tGalleryUser2 = tGalleryChart.getTGalleryUser();
    	    					//不是自己的
    	    					if(tGalleryUser2 != null && !tGalleryUser2.getId().equals(currentTGalleryUser.getId())){
    	    	            		result.setCode(Result.RESULT_EXCUTE_FAIL);
    	    	            		result.setMessage("读取图集失败！无读取此图集没有权限！");
    	    	            		return result;
    	    					}
    	    				}
    	    			}else{
    	            		result.setCode(Result.RESULT_EXCUTE_FAIL);
    	            		result.setMessage("读取图集失败！未登录，没有权限！");
    	            		return result;
    	    			}
    				}
    			}
    			
    			result.setCode(Result.RESULT_OK);
        		result.setMessage("读取图集成功!");
        		result.setData(tGalleryChart);
    		}else{
        		result.setCode(Result.RESULT_EXCUTE_FAIL);
        		result.setMessage("读取图集失败！");
    		}
    	}else{
    		result.setCode(Result.RESULT_EXCUTE_FAIL);
    		result.setMessage("读取图集失败-请指定图集参数！");
    	}
		
		return result;
	}

	/**
	 * 更新一条数据
	 * @param request
	 * @param chartId
	 * @param galleryChartChartUpdateParam
	 * @return
	 */
	@RequestMapping(value={"/{chartid}"},method=RequestMethod.PUT)
	@ResponseBody
	public Result update(HttpServletRequest request,@PathVariable("chartid") String chartId,
						 @RequestBody GalleryChartUpdateParam galleryChartChartUpdateParam){
		Result result = new Result();

		if(chartId != null && !"".equals(chartId)){
			//读取图集
			TGalleryChart tGalleryChart = tGalleryChartService.getGalleryChartByChartId(chartId);
			if(tGalleryChart != null){
				TGalleryCatalog tGalleryCatalog = tGalleryChart.getTGalleryCatalog();
				//1.校验是否有更新权限
				if(tGalleryCatalog != null) {
					Short catalogPrivate = tGalleryCatalog.getCatalogPrivate();
					//如果是私有的
					if (catalogPrivate != null && catalogPrivate.shortValue() == CGalleryCatalog.CATALOG_PRIVATE_YES) {
						TGalleryUser currentTGalleryUser = getSessionUser(request);
						if (currentTGalleryUser != null) {
							Short userAdmin = currentTGalleryUser.getUserAdmin();
							//不是管理员
							if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
								//图集所属用户
								TGalleryUser tGalleryUser2 = tGalleryChart.getTGalleryUser();
								//不是自己的
								if (tGalleryUser2 != null && !tGalleryUser2.getId().equals(currentTGalleryUser.getId())) {
									result.setCode(Result.RESULT_EXCUTE_FAIL);
									result.setMessage("更新图集失败！没有权限！");
									return result;
								}
							}
						} else {
							result.setCode(Result.RESULT_EXCUTE_FAIL);
							result.setMessage("更新图集失败！未登录，没有权限！");
							return result;
						}
					}
				}

				//2.修改
				tGalleryChart.setChartImage(galleryChartChartUpdateParam.getChartImage());
				tGalleryChart.setChartJson(galleryChartChartUpdateParam.getChartJson());
				tGalleryChart.setChartParam(galleryChartChartUpdateParam.getChartParam());
				tGalleryChart.setChartName(galleryChartChartUpdateParam.getChartName());
				tGalleryChart.setChartMome(galleryChartChartUpdateParam.getChartMome());
				tGalleryChart.setModifyTime(new BigDecimal(System.currentTimeMillis()));

				boolean isUpdate = tGalleryChartService.update(tGalleryChart);
				if(isUpdate){
					result.setCode(Result.RESULT_OK);
					result.setMessage("更新图集成功!");
				}else{
					result.setCode(Result.RESULT_EXCUTE_FAIL);
					result.setMessage("更新图集失败!");
				}
			}else{
				result.setCode(Result.RESULT_EXCUTE_FAIL);
				result.setMessage("更新图集失败！未找到指定的图集！");
			}
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.setMessage("未找到指定的图集-请指定图集参数！");
		}

		return result;
	}
	
	
	/**
	 * 移动图集到目录
	 * @param request
	 * @param chartId
	 * @return
	 */
	@RequestMapping(value={"/{chartId}/move/{catalogId}/catalog"},method=RequestMethod.PUT)
    @ResponseBody
    public Result moveCatalog(HttpServletRequest request,@PathVariable("chartId") String chartId
    		,@PathVariable("catalogId") int catalogId){
		
		Result result = new Result();
		
		TGalleryChart tGalleryChart = tGalleryChartService.getGalleryChartByChartId(chartId);
		if(tGalleryChart == null){
			result.setCode(Result.RESULT_EXCUTE_FAIL);
    		result.setMessage("移动失败!请选择正确的图！");
    		return result;
		}
		
		TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
		if(tGalleryCatalog == null){
			result.setCode(Result.RESULT_EXCUTE_FAIL);
    		result.setMessage("移动失败!请选择正确图集目录！");
    		return result;
		}
		
		//修改目录
		tGalleryChart.setTGalleryCatalog(tGalleryCatalog);
		//修改时间
		tGalleryChart.setModifyTime(new BigDecimal(System.currentTimeMillis()));
		
		boolean isUpdate = tGalleryChartService.update(tGalleryChart);
		if(isUpdate){
			result.setCode(Result.RESULT_OK);
    		result.setMessage("移动成功!");
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
    		result.setMessage("移动失败!");
		}
		
		return result;
	}
	
	
	/**
	 * 删除图集
	 * @param request
	 * @param chartId
	 * @return
	 */
	@RequestMapping(value={"/{chartId}"},method=RequestMethod.DELETE)
    @ResponseBody
    public Result removeChart(HttpServletRequest request,@PathVariable("chartId") String chartId){
		Result result = new Result();
		
		TGalleryUser currentUser = getSessionUser(request);
		if(currentUser == null){
			result.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
    		result.setMessage("删除失败!没有权限！");
    		return result;
		}
		
		TGalleryChart tGalleryChart = tGalleryChartService.getGalleryChartByChartId(chartId);
		if(tGalleryChart == null){
			result.setCode(Result.RESULT_EXCUTE_FAIL);
    		result.setMessage("删除失败!请选择正确的图！");
    		return result;
		}
		
		TGalleryUser tGalleryUser = tGalleryChart.getTGalleryUser();
		if(tGalleryUser != null){
			boolean isCanDel = false;
			Short userAdmin = currentUser.getUserAdmin();
			if(userAdmin != null && userAdmin == CGalleryUser.USER_ADMIN_YES){
				//管理员可以删除
				isCanDel = true;
			}else if(currentUser.getId().equals(tGalleryUser.getId())){
				//删除自己的
				isCanDel = true;
			}
			
			if(isCanDel){
				//物理删除
				boolean isDel = tGalleryChartService.delete(tGalleryChart);
				if(isDel){
					result.setCode(Result.RESULT_OK);
		    		result.setMessage("删除成功!");
				}else{
					result.setCode(Result.RESULT_EXCUTE_FAIL);
		    		result.setMessage("删除失败!没有权限！");
				}
			}else{
				result.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
	    		result.setMessage("删除失败!没有权限！");
			}
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
    		result.setMessage("删除失败!没有权限！");
		}
		
		return result;
	}
	
	/**
	 * 列表指定条件下（指定chartId）的所在序号数据
	 * <p style="color:red;">
	 * 		说明：成功后返回的数据中当前列表条件下chartId所在的结果集序号信息
	 * </p>
	 * <p style="color:red;">
	 * 	注意：<br/>
	 * 		1.如果catalogId为根的话，取得的是所有的公共的图和私人(如果登录)的图<br/>
	 * 		2.如果catalogId不是根的话，取得的是其节点和所有子节点的图集<br/>
	 * </p>
	 * @param request
	 * @param catalogId
	 * @param chartId
	 * @param keyword
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}/chart/{chartId}/index/info"},method=RequestMethod.GET)
    @ResponseBody
    public ObjectResult indexInfo(HttpServletRequest request,@PathVariable("catalogId") int catalogId,
    		@PathVariable("chartId") String chartId,String keyword){
		ObjectResult result = new ObjectResult();
		
		if(keyword != null){
			keyword = keyword.trim();
		}
		
		//取得用户的登录信息
		TGalleryUser tGalleryUser = getSessionUser(request);

		Map<String,Object>	map = null;

		//获取根下的图集
		if(CParentNode.ROOT_NODE_VALUE == catalogId){
			map = tGalleryChartService.getPublicChartAndUserChartIndexInfo(tGalleryUser,chartId,keyword);
		}else{
			//获取非根下的图集
			TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
			if(tGalleryCatalog == null){
				result.setCode(Result.RESULT_EXCUTE_FAIL);
				result.append("取得信息失败！无法找到指定的图集目录！");
				return result;
			}

			//获取指定节点下的所有子节点列表
			List<BigDecimal> catalogIds = tGalleryCatalogService.listAllChildrenCatalogBycatalogId(catalogId);
			
			Short catalogPrivate = tGalleryCatalog.getCatalogPrivate();
			//--当前节点为私有节点--
			if(catalogPrivate != null && catalogPrivate.shortValue() == CGalleryCatalog.CATALOG_PRIVATE_YES){
				if(tGalleryUser == null){
					//未登录
					result.setCode(Result.RESULT_EXCUTE_FAIL);
					result.append("取得指定目录下的图集列表失败！未登录，无法获取私人图集！");
				}else{
					//取得其节点和所有子节点的图集
					map = tGalleryChartService.getAllBycatalogIdsIndexInfo(catalogIds,tGalleryUser,chartId,keyword);
				}
			}else{
				//--不是私有的节点--
				//取得其节点和所有子节点的图集
				map = tGalleryChartService.getAllBycatalogIdsIndexInfo(catalogIds,chartId,keyword);
			}
		}

		if(map != null){
			result.setCode(Result.RESULT_OK);
			result.append("取得信息成功！");
			result.setData(map);
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.append("取得信息失败！");
		}
		
		return result;
	}
	
	/**
	 * 列表指定目录下（包括子目录）的数据(指定结果集的索引)
	 * <p style="color:red;">
	 * 	注意：<br/>
	 * 		1.如果catalogId为根的话，取得的是所有的公共的图和私人(如果登录)的图<br/>
	 * 		2.如果catalogId不是根的话，取得的是其节点和所有子节点的图集<br/>
	 * </p>
	 * @param request
	 * @param catalogId
	 * @param keyword
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}/index/{index}/chart"},method=RequestMethod.GET)
    @ResponseBody
    public ObjectResult getChartBycatalogIdAndIndex(HttpServletRequest request,@PathVariable("catalogId") int catalogId,
    		String keyword,@PathVariable("index") int index){
		ObjectResult result = new ObjectResult();
		
		if(keyword != null){
			keyword = keyword.trim();
		}
		
		//取得用户的登录信息
		TGalleryUser tGalleryUser = getSessionUser(request);

		List<TGalleryChart>	list = null;
		//获取根下的图集
		if(CParentNode.ROOT_NODE_VALUE == catalogId){
			list = tGalleryChartService.listPublicChartAndUserChart(tGalleryUser,keyword,new PageInfo(index, 1));
		}else{
			//获取非根下的图集
			
			TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
			if(tGalleryCatalog == null){
				result.setCode(Result.RESULT_EXCUTE_FAIL);
				result.append("取得指定目录下的图集列表失败！无法找到指定的图集目录！");
				return result;
			}

			//获取指定节点下的所有子节点列表
			List<BigDecimal> catalogIds = tGalleryCatalogService.listAllChildrenCatalogBycatalogId(catalogId);
			
			Short catalogPrivate = tGalleryCatalog.getCatalogPrivate();
			//--当前节点为私有节点--
			if(catalogPrivate != null && catalogPrivate.shortValue() == CGalleryCatalog.CATALOG_PRIVATE_YES){
				if(tGalleryUser == null){
					//未登录
					result.setCode(Result.RESULT_EXCUTE_FAIL);
					result.append("取得指定目录下的图集列表失败！未登录，无法获取私人图集！");
				}else{
					//取得其节点和所有子节点的图集
					list = tGalleryChartService.listAllBycatalogIds(catalogIds,tGalleryUser,keyword,new PageInfo(index, 1));
				}
			}else{
				//--不是私有的节点--
				//取得其节点和所有子节点的图集
				list = tGalleryChartService.listAllBycatalogIds(catalogIds,keyword,new PageInfo(index, 1));
			}
		}

		if(list != null){
			result.setCode(Result.RESULT_OK);
			result.append("取得指定目录和下标索引下的图集列表成功！");
			result.setData(list);
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.append("取得指定目录和下标索引下的图集列表失败！");
		}

		return result;
	}

	/**
	 * 列表我的作品
	 * @param request
	 * @param paging
	 * @return
	 */
	@RequestMapping(value={"/my/gallery/list"},method=RequestMethod.GET)
	@ResponseBody
	public ObjectResult getMyGalleryList(HttpServletRequest request,@RequestBody Paging paging){
		ObjectResult result = new ObjectResult();

		TGalleryUser tGalleryUser = getSessionUser(request);
		//未登录
		if(tGalleryUser == null){
			result = (ObjectResult)getNoLoginResult();
		}

		PageInfo pageInfo = paging.toPageInfo();
		Map<String,Object> map = tGalleryChartService.getMyGalleryListInfo(tGalleryUser,pageInfo);
		if(map != null){
            //当前页
            map.put("pageNumber",paging.getPageNumber());
            //页大小
            map.put("pageSize",paging.getPageSize());

			result.setCode(Result.RESULT_OK);
			result.append("列表我的图集列表成功！");
			result.setData(map);
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.append("列表我的图集列表失败！");
		}

		return result;
	}

	/**
	 * 拖动排序操作
	 * <p style="color:red;">
	 *		将chartId拖动到当前当前目录的
	 *
	 * </p>
	 * @param request
	 * 			http请求对象
	 * @param chartId
	 * 			当前要移动的图集
	 * @param baseChartid
	 *			移动到当前图集的基准
	 * @param isAfterBaseChart
	 *			是否放在baseChartid的后面（默认为false,放在baseChartid前面）
	 * @return
	 */
	@RequestMapping(value={"/{chartid}/sortable/{baseChartid}"},method=RequestMethod.PUT)
	@ResponseBody
	public Result sortableChartBefore(HttpServletRequest request,@PathVariable("chartid") String chartId
			,@PathVariable("baseChartid") String baseChartid,boolean isAfterBaseChart){
		Result result = new Result();

		TGalleryUser currentTGalleryUser = getSessionUser(request);
		if (currentTGalleryUser != null) {
			Short userAdmin = currentTGalleryUser.getUserAdmin();
			//不是管理员
			if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
				result.setCode(Result.RESULT_EXCUTE_FAIL);
				result.setMessage("操作失败！没有权限！");
				return result;
			}
		} else {
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.setMessage("更新图集失败！未登录，没有权限！");
			return result;
		}//end

		if(chartId != null && !"".equals(chartId)){
			//读取图集
			TGalleryChart tGalleryChart = tGalleryChartService.getGalleryChartByChartId(chartId);
			if(tGalleryChart != null){
				//读取当前图集的基准的图集
				TGalleryChart baseTGalleryChart = tGalleryChartService.getGalleryChartByChartId(baseChartid);
				if(baseTGalleryChart != null){
					if(tGalleryChart.getTGalleryCatalog().getId() == baseTGalleryChart.getTGalleryCatalog().getId()){
						int catalogId = tGalleryChart.getTGalleryCatalog().getId();

						//保存旧的权值数据
						int oldChartWeight = tGalleryChart.getChartWeight();
						int newChartWeight,re;
						//若拖拽的数据权值比基准数据权值大
						if(tGalleryChart.getChartWeight() > baseTGalleryChart.getChartWeight()){
							if(isAfterBaseChart){
								newChartWeight = baseTGalleryChart.getChartWeight();
								re = tGalleryChartService.sortableChart(catalogId,baseTGalleryChart.getChartWeight()
										- CGalleryChart.CHART_WEIGHT_STEP,tGalleryChart.getChartWeight(),true);
							}else{
								newChartWeight = baseTGalleryChart.getChartWeight() + CGalleryChart.CHART_WEIGHT_STEP;
								re = tGalleryChartService.sortableChart(catalogId,baseTGalleryChart.getChartWeight(),
										tGalleryChart.getChartWeight(),true);
							}
						}else if(tGalleryChart.getChartWeight() < baseTGalleryChart.getChartWeight()){
							//若拖拽的数据权值比基准数据权值小

							if(isAfterBaseChart){
								newChartWeight = baseTGalleryChart.getChartWeight() - CGalleryChart.CHART_WEIGHT_STEP;
								re = tGalleryChartService.sortableChart(catalogId,tGalleryChart.getChartWeight(),
										baseTGalleryChart.getChartWeight()+ CGalleryChart.CHART_WEIGHT_STEP,false);
							}else{
								newChartWeight = baseTGalleryChart.getChartWeight();
								re = tGalleryChartService.sortableChart(catalogId,tGalleryChart.getChartWeight(),
										baseTGalleryChart.getChartWeight()+ CGalleryChart.CHART_WEIGHT_STEP,false);
							}
						}else{
							//若拖拽的数据权值与基准数据权值相等

							if(isAfterBaseChart){
								newChartWeight = tGalleryChart.getChartWeight()- CGalleryChart.CHART_WEIGHT_STEP;
								if(newChartWeight <= 0){
									newChartWeight = tGalleryChart.getChartWeight();
									re = tGalleryChartService.sortableChart(catalogId,tGalleryChart.getChartWeight()
											- CGalleryChart.CHART_WEIGHT_STEP,baseTGalleryChart.getChartWeight()
											+ CGalleryChart.CHART_WEIGHT_STEP,true);
								}
							}else{
								newChartWeight = tGalleryChart.getChartWeight() + CGalleryChart.CHART_WEIGHT_STEP;
							}
						}
						//------------------------------更新数据------------------------------------------------
						tGalleryChart.setChartWeight(newChartWeight);
						boolean isUpdated = tGalleryChartService.update(tGalleryChart);
						if(isUpdated){
							result.setCode(Result.RESULT_OK);
							result.setMessage("消息提示：排序成功！");
						}else{
							result.setCode(Result.RESULT_EXCUTE_FAIL);
							result.setMessage("消息提示：排序失败！");
						}
					}else{
						result.setCode(Result.RESULT_EXCUTE_FAIL);
						result.setMessage("操作失败！无法拖拽到其他分类目录中！");
					}//end if(baseTGalleryChart != null)
				}else{
					result.setCode(Result.RESULT_EXCUTE_FAIL);
					result.setMessage("操作失败！未找到指定的当前图集的基准的图集！");
				}//end if(baseTGalleryChart != null)
			}else{
				result.setCode(Result.RESULT_EXCUTE_FAIL);
				result.setMessage("操作失败！未找到指定的图集！");
			}//end if(tGalleryChart != null)
		}else{
			result.setCode(Result.RESULT_EXCUTE_FAIL);
			result.setMessage("未找到指定的图集-请指定图集参数！");
		}//end if(chartId != null && !"".equals(chartId))

		return result;
	}



}
