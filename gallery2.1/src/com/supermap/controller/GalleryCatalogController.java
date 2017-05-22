package com.supermap.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.supermap.common.CGalleryCatalog;
import com.supermap.common.CGalleryUser;
import com.supermap.modal.TGalleryUser;
import com.supermap.service.TGalleryChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.supermap.common.CParentNode;
import com.supermap.dhtmlx.DHTMLXTree;
import com.supermap.dhtmlx.DHTMLXTreeFactory;
import com.supermap.modal.TGalleryCatalog;
import com.supermap.result.ObjectResult;
import com.supermap.result.Result;
import com.supermap.service.TGalleryCatalogService;

/**
 * 图集目录接口
 * @author Linhao
 */
@Controller
@RequestMapping(value={"catalog"},produces={"application/json;charset=UTF-8"})
public class GalleryCatalogController extends BaseController{
	
	@Autowired
	private TGalleryCatalogService tGalleryCatalogService;

	@Autowired
	TGalleryChartService tGalleryChartService;
	
	/**
	 * 创建一条记录
	 * @param request
	 * @param tGalleryCatalog
	 * @return
	 */
	@RequestMapping(value={"/add"},method=RequestMethod.POST)
    @ResponseBody
    public Result add(HttpServletRequest request,@RequestBody TGalleryCatalog tGalleryCatalog){
		Result re = new Result();
		TGalleryUser tGalleryUser = getSessionUser(request);
		//未登录
		if(tGalleryUser == null){
			re = getNoLoginResult();
			return re;
		}

		Short userAdmin = tGalleryUser.getUserAdmin();
		//不是管理员
		if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
			re.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
			re.append("增加数据失败！没有权限！");
			return re;
		}

        if(tGalleryCatalog != null){
			String catalogName = tGalleryCatalog.getCatalogName();
			if(catalogName == null || "".equals(catalogName)){
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("目录名称不能为空！");
				return re;
			}

			//判断是否存在
			int count = tGalleryCatalogService.getCountBycatalogNameAndparentId(catalogName
					, tGalleryCatalog.getParentId());
			if(count > 0){
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("同级的目录名称已存在！");
				return re;
			}

        	long now = System.currentTimeMillis();
        	//设置创建时间
			tGalleryCatalog.setCreateTime(new BigDecimal(now));
			tGalleryCatalog.setModifyTime(new BigDecimal(now));

			//设置为公开
			tGalleryCatalog.setCatalogPrivate(CGalleryCatalog.CATALOG_PRIVATE_NO);

			//设置目录权值（新增的权值为最大）
			int currentMaxCatalogWeight = tGalleryCatalogService.getCurrentMaxCatalogWeight();
			tGalleryCatalog.setCatalogWeight(currentMaxCatalogWeight + CGalleryCatalog.CATALOG_WEIGHT_STEP);
        	
        	boolean ok = tGalleryCatalogService.add(tGalleryCatalog);
        	if(ok){
                re.setCode(Result.RESULT_OK);
                re.append("增加数据成功！");
        	}else{
                re.setCode(Result.RESULT_EXCUTE_FAIL);
                re.append("增加数据失败！");
        	}
        }else{
            re.setCode(Result.RESULT_EXCUTE_FAIL);
            re.append("增加数据失败！");
        }
        
        return re;
    }

	/**
	 * 更新一条记录
	 * @param request
	 * @param catalogId
	 * @param catalogName
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}"},method=RequestMethod.PUT)
	@ResponseBody
	public Result update(HttpServletRequest request,@PathVariable("catalogId") int catalogId,
			String catalogName){
		Result re = new Result();
		TGalleryUser tGalleryUser = getSessionUser(request);
		//未登录
		if(tGalleryUser == null){
			re = getNoLoginResult();
			return re;
		}

		Short userAdmin = tGalleryUser.getUserAdmin();
		//不是管理员
		if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
			re.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
			re.append("修改数据失败！没有权限！");
			return re;
		}

		if(catalogName == null || "".equals(catalogName)){
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("目录名称不能为空！");
			return re;
		}

		//读取信息
		TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
		if(tGalleryCatalog != null){

			//获取原来的名称
			String oldCatalogName = tGalleryCatalog.getCatalogName();
			if(!oldCatalogName.equals(catalogName)){
				//判断是否存在
				int count = tGalleryCatalogService.getCountBycatalogNameAndparentId(catalogName
						,tGalleryCatalog.getParentId());
				if(count > 0){
					re.setCode(Result.RESULT_EXCUTE_FAIL);
					re.append("同级的目录名称已存在！");
					return re;
				}
			}

			//设置新的名字
			tGalleryCatalog.setCatalogName(catalogName);

			//设置修改时间
			long now = System.currentTimeMillis();
			tGalleryCatalog.setModifyTime(new BigDecimal(now));

			boolean ok = tGalleryCatalogService.update(tGalleryCatalog);
			if(ok){
				re.setCode(Result.RESULT_OK);
				re.append("修改数据成功！");
			}else{
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("修改数据失败！");
			}
		}else{
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("修改数据失败！");
		}

		return re;
	}

	/**
	 * 移动一条记录
	 * @param request
	 * @param catalogId
	 * @param parentId
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}/move"},method=RequestMethod.PUT)
	@ResponseBody
	public Result move(HttpServletRequest request,@PathVariable("catalogId") int catalogId,
						 int parentId){
		Result re = new Result();
		TGalleryUser tGalleryUser = getSessionUser(request);
		//未登录
		if(tGalleryUser == null){
			re = getNoLoginResult();
			return re;
		}

		Short userAdmin = tGalleryUser.getUserAdmin();
		//不是管理员
		if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
			re.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
			re.append("移动数据失败！没有权限！");
			return re;
		}

		//不是根
		if(parentId != CParentNode.ROOT_NODE_VALUE){
			//读取父节点信息
			TGalleryCatalog parentInfo = tGalleryCatalogService.getTGalleryCatalogByCatalogId(parentId);
			if(parentInfo == null){
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("移动失败！未找到父节点");
				return re;
			}
		}

		//读取信息
		TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
		if(tGalleryCatalog != null){
			//设置父节点
			tGalleryCatalog.setParentId(parentId);

			//设置修改时间
			long now = System.currentTimeMillis();
			tGalleryCatalog.setModifyTime(new BigDecimal(now));

			boolean ok = tGalleryCatalogService.update(tGalleryCatalog);
			if(ok){
				re.setCode(Result.RESULT_OK);
				re.append("移动数据成功！");
			}else{
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("移动数据失败！");
			}
		}else{
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("移动数据失败！");
		}

		return re;
	}

	/**
	 * 删除一条记录
	 * @param request
	 * @param catalogId
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}"},method=RequestMethod.DELETE)
	@ResponseBody
	public Result delete(HttpServletRequest request,@PathVariable("catalogId") int catalogId){
		Result re = new Result();
		TGalleryUser tGalleryUser = getSessionUser(request);
		//未登录
		if(tGalleryUser == null){
			re = getNoLoginResult();
			return re;
		}

		Short userAdmin = tGalleryUser.getUserAdmin();
		//不是管理员
		if (userAdmin != null && userAdmin.shortValue() != CGalleryUser.USER_ADMIN_YES) {
			re.setCode(Result.RESULT_EXECUTE_NO_RIGHT);
			re.append("删除数据失败！没有权限！");
			return re;
		}

		//读取信息
		TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
		if(tGalleryCatalog != null){
			//取得当前目录是否有图集
			int count = tGalleryChartService.getCountBycatalogId(catalogId);
			if(count > 0){
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("该分类下有图集！禁止删除！");
				return re;
			}

			//将子节点借到父节点上
			int parentId = tGalleryCatalog.getParentId();

			boolean ok = tGalleryCatalogService.delete(tGalleryCatalog);
			if(ok){
				re.setCode(Result.RESULT_OK);
				re.append("删除数据成功！");

				int nextChildrenCount = tGalleryCatalogService.getNextChildrenCountByCatalogId(catalogId);
				if(nextChildrenCount > 0){
					tGalleryCatalogService.updateParentIdByParentId(parentId,catalogId);
				}//end if(nextChildren != null && nextChildren.size() > 0)
			}else{
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("删除数据失败！");
			}
		}else{
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("删除数据失败！未找到记录！");
		}

		return re;
	}
	
	/**
	 * 列表数据
	 * @param request
	 * @return
	 */
	@RequestMapping(value={"/list/{catalogId}/next/children"},method=RequestMethod.GET)
    @ResponseBody
    public ObjectResult listNextChildrenByCatalogId(HttpServletRequest request,@PathVariable("catalogId") int catalogId){
		ObjectResult re = new ObjectResult();

		List<TGalleryCatalog> list = tGalleryCatalogService.listNextChildrenByCatalogId(catalogId);
		if(list != null){
	        re.setCode(Result.RESULT_OK);
	        re.append("列表数据成功！");
	        re.setData(list);
		}else{
	        re.setCode(Result.RESULT_EXCUTE_FAIL);
	        re.append("列表数据失败！");
		}
        
        return re;
    } 
	
	/**
	 * 通过父节点id 获取下级树形结构
	 * @param request
	 * @param parentId
	 * @return
	 */
	@RequestMapping(value={"/{parentId}/next/tree/xml"},method=RequestMethod.GET)
    @ResponseBody
    public ObjectResult getNextTreeByParentId(HttpServletRequest request,
				@PathVariable("parentId") int parentId){
		ObjectResult re = new ObjectResult();

		DHTMLXTree dhtmlxTree = null;
		List<TGalleryCatalog> list = null;
		//父节点为根节点
		if(parentId == CParentNode.ROOT_NODE_VALUE){
			dhtmlxTree = new DHTMLXTree(parentId+"", "图集分类目录");
		}else{
			TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(parentId);
			if(tGalleryCatalog == null){
		        re.setCode(Result.RESULT_EXCUTE_FAIL);
		        re.append("执行失败！指定的目录为找到！");
		        return re;
			}
			
			dhtmlxTree = new DHTMLXTree(tGalleryCatalog.getId()+"", tGalleryCatalog.getCatalogName());
		}
		
		//取得指定节点下的下级所有节点
		list = tGalleryCatalogService.listNextChildrenByCatalogId(parentId);
		
		if(list != null){
			for(TGalleryCatalog tGalleryCatalog : list){
				DHTMLXTree childDhtmlxTree = new DHTMLXTree(tGalleryCatalog.getId()+"", tGalleryCatalog.getCatalogName());
				//有子节点
				if(tGalleryCatalogService.checkIsHasChildByCatalogId(tGalleryCatalog.getId())){
					childDhtmlxTree.add(new DHTMLXTree().loading());
				}

				//添加用户信息
				Short catalogprivate = tGalleryCatalog.getCatalogPrivate();
				if(catalogprivate != null && CGalleryCatalog.CATALOG_PRIVATE_YES == catalogprivate){
					childDhtmlxTree.setUserData(CGalleryCatalog.TREE_USER_DATA_KEY_PRIVATE,
							CGalleryCatalog.CATALOG_PRIVATE_YES+"");
				}else{
					childDhtmlxTree.setUserData(CGalleryCatalog.TREE_USER_DATA_KEY_PRIVATE,
							CGalleryCatalog.CATALOG_PRIVATE_NO+"");
				}//end if
				
				dhtmlxTree.add(childDhtmlxTree);
			}
		}
		
		re.setCode(Result.RESULT_OK);
        re.append("执行成功！");
        
        if(parentId == CParentNode.ROOT_NODE_VALUE){
            re.setData(DHTMLXTreeFactory.toTree(dhtmlxTree));
        }else{
            re.setData(dhtmlxTree.toString());
        }
        
        return re;
    }

	/**
	 * 目录置顶（即更新修改时间,以及修改权值）
	 * @param request
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}/to/top"},method=RequestMethod.PUT)
	@ResponseBody
	public Result catalogToTop(HttpServletRequest request,@PathVariable("catalogId") int catalogId){
		Result re = new Result();

		TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
		if(tGalleryCatalog != null){
			//修改修改时间
			tGalleryCatalog.setModifyTime(new BigDecimal(System.currentTimeMillis()));
			//当前要置顶的目录的权值
			int oCatalogWeight = tGalleryCatalog.getCatalogWeight();
			//当前最大的权值
			int cMaxCatalogWeight = tGalleryCatalogService.getCurrentMaxCatalogWeight();
			//当前权值已经是最大的
			if(cMaxCatalogWeight == oCatalogWeight){
				re.setCode(Result.RESULT_OK);
				re.append("置顶成功！");
				return re;
			}//end if(cMaxCatalogWeight == oCatalogWeight)

			//重新修改权值[将所有的区间中的]
			boolean isOk = tGalleryCatalogService.updateCatalogWeightByMinAndMax(oCatalogWeight,cMaxCatalogWeight);
			if(isOk){
				//当前权值设置为最大
				tGalleryCatalog.setCatalogWeight(cMaxCatalogWeight);
				boolean isToTop = tGalleryCatalogService.update(tGalleryCatalog);
				if(isToTop){
					re.setCode(Result.RESULT_OK);
					re.append("置顶成功！");
				}else{
					re.setCode(Result.RESULT_EXCUTE_FAIL);
					re.append("置顶失败！");
				}
			}else{
				re.setCode(Result.RESULT_EXCUTE_FAIL);
				re.append("置顶失败！");
			}
		}else{
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("操作失败！没有找到指定的目录！");
		}

		return re;
	}

	/**
	 * 判断是否是叶子节点
	 * @param request
	 * @param catalogId
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}/is/leaf/node"},method=RequestMethod.GET)
	@ResponseBody
	public ObjectResult isLeafNode(HttpServletRequest request,@PathVariable("catalogId") int catalogId){
		ObjectResult re = new ObjectResult();

		TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
		if(tGalleryCatalog != null){
			re.setCode(Result.RESULT_OK);
			boolean isLeafNode = tGalleryCatalogService.isLeafNode(catalogId);
			if(isLeafNode){
				re.append("操作成功！该节点【"+tGalleryCatalog.getCatalogName()+"】不叶子节点！");
			}else{
				re.append("操作成功！该节点【"+tGalleryCatalog.getCatalogName()+"】不是叶子节点！");
			}
			Map<String,Boolean> data = new HashMap<>();
			data.put("isLeafNode",isLeafNode);
			re.setData(data);
		}else{
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("操作失败！没有找到指定的目录！");
		}

		return re;
	}

	/**
	 * 判断下是否可以创建子节点
	 * @param request
	 * @param catalogId
	 * @return
	 */
	@RequestMapping(value={"/{catalogId}/is/can/create"},method=RequestMethod.GET)
	@ResponseBody
	public ObjectResult isCanCreate(HttpServletRequest request,@PathVariable("catalogId") int catalogId){
		ObjectResult re = new ObjectResult();

		//如果是根节点
		if(catalogId == CParentNode.ROOT_NODE_VALUE){
			re.setCode(Result.RESULT_OK);
			re.append("操作成功！该节点【根节点】下可以创建子节点！");
			return re;
		}

		TGalleryCatalog tGalleryCatalog = tGalleryCatalogService.getTGalleryCatalogByCatalogId(catalogId);
		if(tGalleryCatalog != null){
			Map<String,Boolean> data = new HashMap<>();

			re.setCode(Result.RESULT_OK);
			boolean isLeafNode = tGalleryCatalogService.isLeafNode(catalogId);
			if(isLeafNode){
				//是叶子节点,判断该点下是否有图集(虽然是叶子节点，但是已经有图了，不能再新建子节点)
				int count = tGalleryChartService.getCountBycatalogId(catalogId);
				if(count > 0){
					data.put("isCanCreate",false);
					re.append("消息提示：该节点【"+tGalleryCatalog.getCatalogName()+"】是分类，不能创建子节点！");
				}else{
					data.put("isCanCreate",true);
					re.append("消息提示：该节点【"+tGalleryCatalog.getCatalogName()+"】是目录，可以创建子节点！");
				}
			}else{
				//不是叶子节点，可以创建目录
				data.put("isCanCreate",true);
				re.append("消息提示：该节点【"+tGalleryCatalog.getCatalogName()+"】不是叶子节点，可以创建！");
			}
			data.put("isLeafNode",isLeafNode);
			re.setData(data);
		}else{
			re.setCode(Result.RESULT_EXCUTE_FAIL);
			re.append("操作失败！没有找到指定的目录！");
		}

		return re;
	}
}
