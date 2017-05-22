package com.supermap.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.supermap.common.CParentNode;
import com.supermap.dao.TGalleryCatalogDAO;
import com.supermap.modal.TGalleryCatalog;

/**
 * 图集目录服务
 * 
 * @author Linhao
 */
@Service
public class TGalleryCatalogService extends BaseService<TGalleryCatalog>{
	
	@Autowired
	TGalleryCatalogDAO tGalleryCatalogDAO;
	
	public List<TGalleryCatalog> list(){
		return tGalleryCatalogDAO.findAll();
	}
	
	/**
	 * 取得指定节点下的下级所有节点
	 * @param catalogId
	 * 			当前节点id
	 * @return
	 */
	public List<TGalleryCatalog> listNextChildrenByCatalogId(int catalogId){
		List<TGalleryCatalog> list = null;
		
		//当前节点是否是根
		if(CParentNode.ROOT_NODE_VALUE == catalogId){
			list = tGalleryCatalogDAO.listNextChildrenByCatalogId(catalogId);
		}else{
			TGalleryCatalog tGalleryCatalog = tGalleryCatalogDAO.getOne(catalogId);
			if(tGalleryCatalog != null){
				list = tGalleryCatalogDAO.listNextChildrenByCatalogId(catalogId);
			}
		}
		
		return list;
	}

	/**
	 * 取得指定节点下的下级所有节点个数
	 * @param catalogId
	 * 			当前节点id
	 * @return
	 */
	public int getNextChildrenCountByCatalogId(int catalogId){
		return tGalleryCatalogDAO.getNextChildrenCountByCatalogId(catalogId);
	}

	/**
	 * 更新指定父节点的父节点
	 * @param newParentId
	 * 			更新后的父节点
	 * @param oldParentId
	 * 			要更新的父节点
	 * @return
	 */
	public boolean updateParentIdByParentId(int newParentId,int oldParentId){
		return tGalleryCatalogDAO.updateParentIdByParentId(newParentId,oldParentId);
	}
	
	/**
	 * 判断是否有子节点
	 * @param catalogId
	 * @return
	 */
	public boolean checkIsHasChildByCatalogId(int catalogId){
		List<TGalleryCatalog> list = tGalleryCatalogDAO.listNextChildrenByCatalogId(catalogId);
		if(list != null && list.size() > 0){
			return true;
		}
		return false;
	}

	/**
	 * 创建一条记录
	 * 
	 * @param tGalleryCatalog
	 */
	@Override
	public boolean add(TGalleryCatalog tGalleryCatalog) {
		if(tGalleryCatalog == null)
			return false;
		return tGalleryCatalogDAO.save(tGalleryCatalog);
	}

	/**
	 * 更新一条记录
	 * 
	 * @param tGalleryCatalog
	 * 
	 */
	@Override
	public boolean update(TGalleryCatalog tGalleryCatalog) {
		if(tGalleryCatalog == null)
			return false;
		return tGalleryCatalogDAO.update(tGalleryCatalog);
	}


	/**
	 * 删除一条记录
	 * 
	 * @param tGalleryCatalog
	 * 
	 */
	@Override
	public boolean delete(TGalleryCatalog tGalleryCatalog) {
		if(tGalleryCatalog == null)
			return false;
		return tGalleryCatalogDAO.delete(tGalleryCatalog);
	}
	
	/**
	 * 取得指定目录
	 * 
	 * @param catalogId
	 * @return
	 */
	public TGalleryCatalog getTGalleryCatalogByCatalogId(int catalogId){
		return tGalleryCatalogDAO.getOne(catalogId);
	}
	
	/**
	 * 取得私人目录
	 * @return
	 */
	public TGalleryCatalog getPrivateRootTGalleryCatalog(){
		return tGalleryCatalogDAO.getPrivateRootTGalleryCatalog();
	}
	
	/**
	 * 获取指定节点下的所有子节点列表
	 * @param catalogId
	 * @return
	 */
	public List<BigDecimal> listAllChildrenCatalogBycatalogId(int catalogId) {
		return tGalleryCatalogDAO.listAllChildrenCatalogBycatalogId(catalogId);
	}

	/**
	 * 获取指定目录名和父节点下的分类个数
	 * @param catalogName
	 * 			目录名
	 * @param parentId
	 * 			父节点
	 * @return
	 */
	public int getCountBycatalogNameAndparentId(String catalogName,int parentId){
		return tGalleryCatalogDAO.getCountBycatalogNameAndparentId(catalogName, parentId);
	}

	/**
	 * 取得catalogWeight值为null的个数
	 *
	 * @return
	 */
	public int getNullCatalogWeightCount(){
		return tGalleryCatalogDAO.getNullCatalogWeightCount();
	}

	/**
	 * 重新初始化权值(只有存在null值得时候才重新分配权值)
	 *
	 * @return 更新的个数（-1代表不需要更新）
	 */
	public int reInitTGalleryCatalogWeightIfExistNull(){
		return tGalleryCatalogDAO.reInitTGalleryCatalogWeightIfExistNull();
	}

	/**
	 * 取得当前所有记录的最大权值
	 *
	 * @return
     */
	public int getCurrentMaxCatalogWeight(){
		return tGalleryCatalogDAO.getCurrentMaxCatalogWeight();
	}

	/**
	 *	更新指定区间的值，将指定区间的权值减小
	 *
	 * @param minCatalogWeight
	 * 			最小需要更新的值
	 * @param maxCatalogWeight
	 * 			最大需要更新的值
     * @return
     */
	public boolean updateCatalogWeightByMinAndMax(int minCatalogWeight,int maxCatalogWeight){
		return tGalleryCatalogDAO.updateCatalogWeightByMinAndMax(minCatalogWeight,maxCatalogWeight);
	}

	/**
	 * 判断是否是子节点
	 * @param catalogId
	 * @return
     */
	public boolean isLeafNode(int catalogId){
		return tGalleryCatalogDAO.isLeafNode(catalogId);
	}

}
