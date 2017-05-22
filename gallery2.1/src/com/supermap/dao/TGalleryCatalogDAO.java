package com.supermap.dao;

import com.supermap.common.CGalleryCatalog;
import com.supermap.common.CParentNode;
import com.supermap.modal.TGalleryCatalog;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * A data access object (DAO) providing persistence and search support for
 * TGalleryCatalog entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.supermap.modal.TGalleryCatalog
 * @author MyEclipse Persistence Tools
 */
@Repository
public class TGalleryCatalogDAO extends BaseHibernateDAO<TGalleryCatalog> {
	//private static final Logger log = LoggerFactory.getLogger(TGalleryCatalogDAO.class);
	
	// property constants
	public static final String CATALOG_ = "catalogWeight";


	@Override
	public List<TGalleryCatalog> findAll() {
		return findByHql("FROM TGalleryCatalog");
	}
	
	public List<TGalleryCatalog> listNextChildrenByCatalogId(int catalogId){
		return findByHql("FROM TGalleryCatalog t where t.parentId=?0 order by t.catalogWeight desc", catalogId);
	}

	public int getNextChildrenCountByCatalogId(int catalogId){
		return findCountByHql("FROM TGalleryCatalog t where t.parentId=?0 order by t.catalogWeight desc", catalogId);
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
		String sql = "UPDATE T_GALLERY_CATALOG SET PARENT_ID=?0 WHERE PARENT_ID=?1";
		int result = excuteBySql(sql,newParentId,oldParentId);
		return result > 0 ? true : false;
	}

	/**
	 * 获取指定节点下的所有子节点列表
	 * @param catalogId
	 * 			指定分类目录id
	 * @return
	 */
	public List<BigDecimal> listAllChildrenCatalogBycatalogId(int catalogId) {
		int currentUsedDbCode = getCurrentUsedDbCode();
		if(currentUsedDbCode != DB_CODE_ORACLE){
			//不是oracle,走方法递归
			return listAllChildrenCatalogBycatalogIdFromRecursion(catalogId,true);
		}else{
			List<Object> list = findBysql("select t.id FROM T_GALLERY_CATALOG t start with t.id = ?0 connect by prior t.id = t.parent_id",catalogId);
			List<BigDecimal> reList = new ArrayList<BigDecimal>();
			for (int i = 0,len=list.size(); i < len; i++) {
				reList.add((BigDecimal)list.get(i));
			}
			return reList;
		}
	}

	/**
	 * 获取指定节点下的所有子节点列表（MYSQL,Sqlite版本）
	 * @param catalogId
	 * 			指定分类目录id
	 * @param isFirst
	 * 			递归时是否是第一次调用该方法
	 * @return
	 */
	private List<BigDecimal> listAllChildrenCatalogBycatalogIdFromRecursion(int catalogId,boolean isFirst) {
		List<BigDecimal> reList = new ArrayList<BigDecimal>();
		if(isFirst){
			//添加自己
			reList.add(new BigDecimal(catalogId));
		}

		List<TGalleryCatalog> list = findByHql("FROM TGalleryCatalog t WHERE t.parentId=?0",catalogId);
		if(list != null && list.size() > 0){
			for(int i=0,len=list.size();i<len;i++){
				//递归获取
				TGalleryCatalog tGalleryCatalog = list.get(i);
				if(tGalleryCatalog != null){
					//添加当前节点
					reList.add(new BigDecimal(tGalleryCatalog.getId()));
					List<BigDecimal> childReList =listAllChildrenCatalogBycatalogIdFromRecursion(tGalleryCatalog.getId(),false);
					if(childReList != null && childReList.size() > 0){
						//添加子节点
						reList.addAll(childReList);
					}
				}
			}
		}

		return reList;
	}

	/**
	 * 取得私人目录
	 * @return
	 */
	public TGalleryCatalog getPrivateRootTGalleryCatalog() {
		Object[] objects = {CGalleryCatalog.CATALOG_PRIVATE_YES,CParentNode.ROOT_NODE_VALUE};
		List<TGalleryCatalog> list = findByHql("FROM TGalleryCatalog t WHERE t.catalogPrivate=?0 AND t.parentId=?1",objects);
		if(list != null && list.size() > 0){
			return list.get(0);
		}else{
			return null;
		}
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
		return findCountByHql("FROM TGalleryCatalog t WHERE t.catalogName=?0 AND t.parentId=?1", catalogName, parentId);
	}

	/**
	 * 取得catalogWeight值为null的个数
	 *
	 * @return
     */
	public int getNullCatalogWeightCount(){
		return findCountByHql("FROM TGalleryCatalog t WHERE t.catalogWeight is null");
	}

	/**
	 * 重新初始化权值(只有存在null值得时候才重新分配权值)
	 *
	 * @return 更新的个数（-1代表不需要更新）
     */
	public int reInitTGalleryCatalogWeightIfExistNull(){
		//取得空值个数，如果>0代表（catalogWeight）字段为新建的
		int nullCount = getNullCatalogWeightCount();
		if(nullCount > 0){
			int currentUsedDbCode = getCurrentUsedDbCode();

			String sql = null;
			switch (currentUsedDbCode){
				case DB_CODE_MYSQL:
					sql = "UPDATE T_GALLERY_CATALOG,(SELECT @a\\:=0) AS rownum SET CATALOG_WEIGHT=(@a\\:= @a +1)";
					break;
				case DB_CODE_SQLITE:
					sql = "UPDATE T_GALLERY_CATALOG SET CATALOG_WEIGHT = rowid";
					break;
				default:
					sql = "UPDATE T_GALLERY_CATALOG t SET t.CATALOG_WEIGHT = rownum";
					break;
			}
			int result = excuteBySql(sql);
			return result;
		}

		return -1;
	}

	/**
	 * 取得当前所有记录的最大权值
	 *
	 * @return
	 */
	public int getCurrentMaxCatalogWeight(){
		List<Object> list = findBysql("SELECT MAX(CATALOG_WEIGHT) FROM T_GALLERY_CATALOG ORDER BY CATALOG_WEIGHT DESC");
		int result = getIndexFromIndexList(list);
		return result > 0 ? result : 0;
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
		String sql = "UPDATE T_GALLERY_CATALOG SET CATALOG_WEIGHT = CATALOG_WEIGHT-"
				+CGalleryCatalog.CATALOG_WEIGHT_STEP +" WHERE CATALOG_WEIGHT>=?0 AND CATALOG_WEIGHT<=?1";
		int result = excuteBySql(sql,minCatalogWeight,maxCatalogWeight);
		return result > 0;
	}

	/**
	 * 判断是否是子节点
	 * @param catalogId
	 * @return
	 */
	public boolean isLeafNode(int catalogId){
		int re = findCountByHql("FROM TGalleryCatalog t WHERE t.parentId=?0",catalogId);
		return re > 0 ? false : true;
	}
}