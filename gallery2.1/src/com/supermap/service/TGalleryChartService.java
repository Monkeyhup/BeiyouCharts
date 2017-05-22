package com.supermap.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.supermap.common.CGalleryUser;
import com.supermap.common.PageInfo;
import com.supermap.dao.TGalleryCatalogDAO;
import com.supermap.dao.TGalleryChartDAO;
import com.supermap.modal.TGalleryChart;
import com.supermap.modal.TGalleryUser;

import javax.servlet.http.HttpServletRequest;

/**
 * 图集服务
 * 
 * @author Linhao
 *
 */
@Service
public class TGalleryChartService extends BaseService<TGalleryChart>{

	@Autowired
	TGalleryChartDAO tGalleryChartDAO;

	@Autowired
	TGalleryCatalogDAO tGalleryCatalogDAO;
	

	public List<TGalleryChart> list(){
		return tGalleryChartDAO.findAll();
	}

	@Override
	public boolean add(TGalleryChart entity) {
		if(entity == null){
			return false;
		}
		return tGalleryChartDAO.save(entity);
	}


	@Override
	public boolean update(TGalleryChart entity) {
		if(entity == null){
			return false;
		}
		return tGalleryChartDAO.update(entity);
	}


	@Override
	public boolean delete(TGalleryChart entity) {
		if(entity == null){
			return false;
		}
		return tGalleryChartDAO.delete(entity);
	}

	/**
	 * 列表数据
	 * 
	 * @param catalogId
	 * 			指定图集目录
	 * @return
	 */
	public List<TGalleryChart> listBycatalogId(int catalogId) {
		return tGalleryChartDAO.listBycatalogId(catalogId);
	}

	/**
	 * 统计数据
	 *
	 * @param catalogId
	 * 			指定图集目录
	 * @return
	 */
	public int getCountBycatalogId(int catalogId) {
		return tGalleryChartDAO.getCountBycatalogId(catalogId);
	}
	
	/**
	 * 取得的是所有的公共的图和私人(如果tGalleryUser！=null)的图<br/>
	 * <p style="color:red;">
	 * 	注意：<br/>
	 * 		1.如果登录的话，是管理员显示所有的图，不是管理员显示公共的和用户私人的图集<br/>
	 * 		2.如果未登录的话，只显示公共的图集<br/>
	 * </p>
	 * @param tGalleryUser
	 * @param keyword
	 * @return
	 */
	public List<TGalleryChart> listPublicChartAndUserChart(
			TGalleryUser tGalleryUser,String keyword,PageInfo pageInfo) {
		if(tGalleryUser != null && tGalleryUser.getId() != null){
			Short admin = tGalleryUser.getUserAdmin();
			//如果是管理员，显示全部
			if(admin != null && admin.shortValue() == CGalleryUser.USER_ADMIN_YES){
				return tGalleryChartDAO.listAllCharts(keyword,pageInfo);
			}else{
				//普通用户，获取公共的和用户私人的图集
				return tGalleryChartDAO.listPublicChartAndUserChart(tGalleryUser,keyword,pageInfo);
			}
		}else{
			//只显示公共的图集
			return tGalleryChartDAO.listPublicChart(keyword,pageInfo);
		}
	}
	
	/**
	 * 取得的是指定chartId下在所有的公共的图和私人(如果tGalleryUser！=null)的图的序号信息<br/>
	 * <p style="color:red;">
	 * 	注意：<br/>
	 * 		1.如果登录的话，是管理员显示所有的图，不是管理员显示公共的和用户私人的图集<br/>
	 * 		2.如果未登录的话，只显示公共的图集<br/>
	 * </p>
	 * @param tGalleryUser
	 * @param chartId
	 * @param keyword
	 * @return
	 */
	public Map<String, Object> getPublicChartAndUserChartIndexInfo(
			TGalleryUser tGalleryUser, String chartId, String keyword) {
		
		Map<String, Object> re = new HashMap<String, Object>();
		
		if(tGalleryUser != null && tGalleryUser.getId() != null){
			Short admin = tGalleryUser.getUserAdmin();
			//如果是管理员，显示全部
			if(admin != null && admin.shortValue() == CGalleryUser.USER_ADMIN_YES){
				int total = tGalleryChartDAO.getAllChartsCount(keyword);
				int index = -1;
				if(total > 0){
					index = tGalleryChartDAO.getAllChartsIndexBychartId(chartId,keyword);
					if(index > 0){
						//序号从0开始
						index = index-1;
					}
				}
				
				re.put("total", total);
				re.put("index", index);
				
				return re;
			}else{
				//普通用户，获取公共的和用户私人的图集
				int total = tGalleryChartDAO.getPublicChartAndUserChartCount(tGalleryUser,keyword);
				int index = -1;
				if(total > 0){
					index = tGalleryChartDAO.getPublicChartAndUserChartIndexBychartId(tGalleryUser,chartId,keyword);
					if(index > 0){
						//序号从0开始
						index = index-1;
					}
				}
				re.put("total", total);
				re.put("index", index);
				
				return re;
			}
		}else{
			//只显示公共的图集
			int total = tGalleryChartDAO.getPublicChartCount(keyword);
			int index = -1;
			if(total > 0){
				index = tGalleryChartDAO.getPublicChartIndexBychartId(chartId,keyword);
				if(index > 0){
					//序号从0开始
					index = index-1;
				}
			}
			re.put("total", total);
			re.put("index", index);
			
			return re;
		}
	}

	/**
	 * 取得其节点和所有子节点的图集
	 * 
	 * @param catalogIds
	 * 			指定的图集目录id列表
	 * @return
	 */
	public List<TGalleryChart> listAllBycatalogIds(List<BigDecimal> catalogIds,String keyword,PageInfo pageInfo) {
		return listAllBycatalogIds(catalogIds,null,keyword,pageInfo);
	}
	/**
	 * 取得其节点和所有子节点的图集序号信息
	 * 
	 * @param catalogIds
	 * 			指定的图集目录id列表
	 * @return
	 */
	public Map<String, Object> getAllBycatalogIdsIndexInfo(
			List<BigDecimal> catalogIds,String chartId,String keyword) {
		return getAllBycatalogIdsIndexInfo(catalogIds, null, chartId, keyword);
	}
	
	/**
	 * 取得其节点和所有子节点的图集
	 * 
	 * @param catalogIds
	 * 			指定的图集目录id列表
	 * @param tGalleryUser
	 * 			指定的图集所属用户（若为null，则不作为条件）
	 * @return
	 */
	public List<TGalleryChart> listAllBycatalogIds(List<BigDecimal> catalogIds,TGalleryUser tGalleryUser
			,String keyword,PageInfo pageInfo) {
		if(catalogIds == null || catalogIds.size() < 1){
			return new ArrayList<TGalleryChart>();
		}
		return tGalleryChartDAO.listAllBycatalogIds(catalogIds, tGalleryUser, keyword, pageInfo);
	}
	
	/**
	 * 取得其节点和所有子节点的图集序号信息
	 * 
	 * @param catalogIds
	 * 			指定的图集目录id列表
	 * @param tGalleryUser
	 * 			指定的图集所属用户（若为null，则不作为条件）
	 * @return
	 */
	public Map<String, Object> getAllBycatalogIdsIndexInfo(
			List<BigDecimal> catalogIds, TGalleryUser tGalleryUser,
			String chartId,String keyword) {
		if(catalogIds == null || catalogIds.size() < 1){
			return null;
		}
		
		Map<String, Object> re = new HashMap<String, Object>();
		int total = tGalleryChartDAO.getAllBycatalogIdsCount(catalogIds,tGalleryUser,keyword);
		int index = -1;
		if(total > 0){
			index = tGalleryChartDAO.getIndexBycatalogIdsBychartId(catalogIds,tGalleryUser,chartId,keyword);
			if(index > 0){
				//序号从0开始
				index = index-1;
			}
		}
		
		re.put("total", total);
		re.put("index", index);
		
		return re;
	}


	/**
	 * 列表指定一个或者多个chartId下的图集信息
	 * 
	 * @param chartIds
	 * 			一个或者多个图集id
	 * @return
	 */
	public List<TGalleryChart> listBychartIds(String[] chartIds) {
		return tGalleryChartDAO.listBychartIds(chartIds);
	}

	/**
	 * 取得图集信息
	 * 
	 * @param chartId
	 * @return
	 */
	public TGalleryChart getGalleryChartByChartId(String chartId) {
		if(chartId == null || "".equals(chartId))
			return null;
		return tGalleryChartDAO.getOne(chartId);
	}

	/**
	 * 获取指定用户的图库列表信息
	 * @param tGalleryUser
	 * @param pageInfo
	 * @return
	 */
	public Map<String,Object> getMyGalleryListInfo(TGalleryUser tGalleryUser,PageInfo pageInfo){
		Map<String,Object> map = null;

		int total = tGalleryChartDAO.getMyGalleryCount(tGalleryUser);
		List<TGalleryChart> list = null;
		if(total > 0){
			list = tGalleryChartDAO.getMyGalleryList(tGalleryUser, pageInfo);
			if(list == null){
				return null;
			}
		}

		map = new HashMap<String,Object>();
		map.put("total",total);
		//检索序号
		map.put("start",pageInfo.getStart());
		//检索截止号
		map.put("end",pageInfo.getEnd());
		map.put("list",list);
		return map;
	}

	/**
	 * 取得chartWeight值为null的个数
	 *
	 * @return
	 */
	public int getNullChartWeightCount(){
		return tGalleryChartDAO.getNullChartWeightCount();
	}

	/**
	 * 重新初始化权值(只有存在null值得时候才重新分配权值)
	 *
	 * @return 更新的个数（-1代表不需要更新）
	 */
	public int reInitTGalleryChartWeightIfExistNull(){
		return tGalleryChartDAO.reInitTGalleryChartWeightIfExistNull();
	}

	/**
	 * 取得当前所有记录的最大权值
	 *
	 * @return
	 */
	public int getCurrentMaxChartWeight(){
		return tGalleryChartDAO.getCurrentMaxChartWeight();
	}

	/**
	 *修改指定图集的权值
	 *
	 * @param catalogId
	 * 				指定目录
	 * @param minWeight
	 * 				需要更新的最小权限（开区间）
	 * @param maxWeight
	 * 				需要更新的最大权限（开区间）
	 * @param isPlus
	 * 			是否是权值增加（默认是减）
	 * @return
	 */
	public int sortableChart(int catalogId,int minWeight,int maxWeight,boolean isPlus){
		return tGalleryChartDAO.sortableChart(catalogId, minWeight, maxWeight, isPlus);
	}

	/**
	 * 取得chartImagePath值为null的
	 *
	 * @return
	 */
	public int getNullImagePathCount(){
		return tGalleryChartDAO.getNullImagePathCount();
	}

	/**
	 * 重新初始化chartImagePath
	 *
	 * @return 更新的个数（-1代表不需要更新）
	 */
	public int reInitTGalleryChartImagePathIfExistNull(HttpServletRequest request){
		return tGalleryChartDAO.reInitTGalleryChartImagePathIfExistNull(request);
	}


}
