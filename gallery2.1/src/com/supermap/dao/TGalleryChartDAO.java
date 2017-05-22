package com.supermap.dao;

import com.supermap.common.CGalleryCatalog;
import com.supermap.common.CGalleryChart;
import com.supermap.common.PageInfo;
import com.supermap.controller.ImagePathController;
import com.supermap.modal.TGalleryChart;
import com.supermap.modal.TGalleryUser;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.internal.SessionImpl;
import org.springframework.stereotype.Repository;

import javax.servlet.http.HttpServletRequest;

/**
 * A data access object (DAO) providing persistence and search support for
 * TGalleryChart entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.supermap.modal.TGalleryChart
 * @author MyEclipse Persistence Tools
 */
@Repository
public class TGalleryChartDAO extends BaseHibernateDAO<TGalleryChart> {
	private static final Logger log = LoggerFactory.getLogger(TGalleryChartDAO.class);

	public List<TGalleryChart> findAll() {
		return findByHql("FROM TGalleryChart");
	}

	/**
	 * 列表数据
	 *
	 * @param catalogId 指定图集目录
	 * @return
	 */
	public List<TGalleryChart> listBycatalogId(int catalogId) {
		return findByHql("FROM TGalleryChart t where t.TGalleryCatalog.id=?0", catalogId);
	}

	/**
	 * 统计数据
	 *
	 * @param catalogId 指定图集目录
	 * @return
	 */
	public int getCountBycatalogId(int catalogId) {
		return findCountByHql("FROM TGalleryChart t where t.TGalleryCatalog.id=?0", catalogId);
	}

	/**
	 * 取得的是所有的公共的图和私人(如果tGalleryUser！=null)的图
	 *
	 * @param tGalleryUser 指定用户
	 * @param keyword
	 * @return
	 */
	public List<TGalleryChart> listPublicChartAndUserChart(
			TGalleryUser tGalleryUser, String keyword, PageInfo pageInfo) {
		if (keyword != null && !"".equals(keyword)) {
			String hql = "FROM TGalleryChart t where ((t.TGalleryCatalog.catalogPrivate=?0 and t.TGalleryUser.id=?1) " +
					"or (t.TGalleryCatalog.catalogPrivate=?2)) and t.chartName like ?3 order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc";
			if (pageInfo != null) {
				return findByHql(hql, pageInfo, CGalleryCatalog.CATALOG_PRIVATE_YES,
						tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%");
			} else {
				return findByHql(hql, CGalleryCatalog.CATALOG_PRIVATE_YES,
						tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%");
			}
		} else {

			String hql = "FROM TGalleryChart t where (t.TGalleryCatalog.catalogPrivate=?0 and t.TGalleryUser.id=?1) " +
					"or (t.TGalleryCatalog.catalogPrivate=?2) order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc";
			if (pageInfo != null) {
				return findByHql(hql, pageInfo, CGalleryCatalog.CATALOG_PRIVATE_YES, tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO);
			} else {
				return findByHql(hql, CGalleryCatalog.CATALOG_PRIVATE_YES, tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO);
			}
		}
	}

	/**
	 * 取得的是所有的公共的图和私人(如果tGalleryUser！=null)的图序号
	 *
	 * @param tGalleryUser 指定用户
	 * @param keyword
	 * @return
	 */
	public int getPublicChartAndUserChartIndexBychartId(
			TGalleryUser tGalleryUser, String chartId, String keyword) {

		List<Object> list = null;

		int currentUsedDbCode = getCurrentUsedDbCode();
		if (keyword != null && !"".equals(keyword)) {
			String sql = null;
			switch (currentUsedDbCode) {
				case DB_CODE_MYSQL:
					sql = "select nt.rn FROM " +
							"(select (@rowNO\\:=@rowNo+1) as rn,nt0.id FROM (select t.* FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
							"where ((t2.CATALOG_PRIVATE=?0 and t3.id=?1) or (t2.CATALOG_PRIVATE=?2)) and t.CHART_NAME like ?3 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt0,(select @rowNO\\:=0) tnum ) " +
							"nt where nt.id=?4";
					list = findBysql(sql, CGalleryCatalog.CATALOG_PRIVATE_YES,
							tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%", chartId);
					break;
				case DB_CODE_SQLITE:
					//注意：desc与>与+1配套使用
					sql = "select nt.rn FROM " +
							"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt2 on ttt.CHART_CATALOG=ttt2.id where ttt.CHART_NAME like ?0 and (ttt2.CATALOG_WEIGHT>t2.CATALOG_WEIGHT or (ttt2.CATALOG_WEIGHT=t2.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT)))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
							"where ((t2.CATALOG_PRIVATE=?1 and t3.id=?2) or (t2.CATALOG_PRIVATE=?3)) and t.CHART_NAME like ?4 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) " +
							"nt where nt.id=?5";
					list = findBysql(sql, "%" + keyword + "%", CGalleryCatalog.CATALOG_PRIVATE_YES,
							tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%", chartId);
					break;
				default:
					sql = "select nt.rn FROM " +
							"(select row_number() over(order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
							"where ((t2.CATALOG_PRIVATE=?0 and t3.id=?1) or (t2.CATALOG_PRIVATE=?2)) and t.CHART_NAME like ?3 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) " +
							"nt where nt.id=?4";
					list = findBysql(sql, CGalleryCatalog.CATALOG_PRIVATE_YES,
							tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%", chartId);
					break;
			}
		} else {
			String sql = null;
			switch (currentUsedDbCode) {
				case DB_CODE_MYSQL:
					sql = "select nt.rn FROM " +
							"(select (@rowNO\\:=@rowNo+1) as rn,nt0.id FROM (select t.* FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
							"where (t2.CATALOG_PRIVATE=?0 and t3.id=?1) or (t2.CATALOG_PRIVATE=?2) order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt0,(select @rowNO\\:=0) tnum ) nt where nt.id=?3";
					break;
				case DB_CODE_SQLITE:
					//注意：desc与>与+1配套使用
					sql = "select nt.rn FROM " +
							"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt2 on ttt.CHART_CATALOG=ttt2.id where ttt2.CATALOG_WEIGHT>t2.CATALOG_WEIGHT or (ttt2.CATALOG_WEIGHT=t2.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
							"where (t2.CATALOG_PRIVATE=?0 and t3.id=?1) or (t2.CATALOG_PRIVATE=?2) order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?3";
					break;
				default:
					sql = "select nt.rn FROM " +
							"(select row_number() over(order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
							"where (t2.CATALOG_PRIVATE=?0 and t3.id=?1) or (t2.CATALOG_PRIVATE=?2) order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?3";
					break;
			}
			list = findBysql(sql, CGalleryCatalog.CATALOG_PRIVATE_YES, tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO, chartId);
		}
		return getIndexFromIndexList(list);
	}

	/**
	 * 取得的是所有的公共的图和私人(如果tGalleryUser！=null)的图
	 *
	 * @param tGalleryUser 指定用户
	 * @param keyword
	 * @return
	 */
	public int getPublicChartAndUserChartCount(TGalleryUser tGalleryUser,
											   String keyword) {
		if (keyword != null && !"".equals(keyword)) {
			String hql = "FROM TGalleryChart t where ((t.TGalleryCatalog.catalogPrivate=?0 and t.TGalleryUser.id=?1) " +
					"or (t.TGalleryCatalog.catalogPrivate=?2)) and t.chartName like ?3";
			return findCountByHql(hql, CGalleryCatalog.CATALOG_PRIVATE_YES,
					tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%");
		} else {

			String hql = "FROM TGalleryChart t where (t.TGalleryCatalog.catalogPrivate=?0 and t.TGalleryUser.id=?1) " +
					"or (t.TGalleryCatalog.catalogPrivate=?2)";
			return findCountByHql(hql, CGalleryCatalog.CATALOG_PRIVATE_YES, tGalleryUser.getId(), CGalleryCatalog.CATALOG_PRIVATE_NO);
		}
	}

	/**
	 * 显示所有的图
	 *
	 * @param keyword
	 * @return
	 */
	public List<TGalleryChart> listAllCharts(String keyword, PageInfo pageInfo) {
		if (keyword != null && !"".equals(keyword)) {
			if (pageInfo != null) {
				return findByHql("FROM TGalleryChart t where t.chartName like ?0 order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc", pageInfo, "%" + keyword + "%");
			} else {
				return findByHql("FROM TGalleryChart t where t.chartName like ?0 order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc", "%" + keyword + "%");
			}
		}
		if (pageInfo != null) {
			return findByHql("FROM TGalleryChart t order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc", pageInfo);
		} else {
			return findByHql("FROM TGalleryChart t order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc");
		}
	}

	/**
	 * 取得所有的图的个数
	 *
	 * @param keyword
	 * @return
	 */
	public int getAllChartsCount(String keyword) {
		if (keyword != null && !"".equals(keyword)) {
			return findCountByHql("FROM TGalleryChart t where t.chartName like ?0", "%" + keyword + "%");
		}
		return findCountByHql("FROM TGalleryChart t");
	}

	/**
	 * 取得所有的图的下指定图的位置
	 *
	 * @param keyword
	 * @return
	 */
	public int getAllChartsIndexBychartId(String chartId, String keyword) {
		List<Object> list = null;

		int currentUsedDbCode = getCurrentUsedDbCode();
		if (keyword != null && !"".equals(keyword)) {
			String sql = null;

			switch (currentUsedDbCode) {
				case DB_CODE_MYSQL:
					sql = "select nt.rn FROM " +
							"(select (@rowNO\\:=@rowNo+1) as rn,t2.id from (select t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t1 on t.CHART_CATALOG=t1.id where t.CHART_NAME like ?0 order by t1.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) t2,(select @rowNO\\:=0) tnum) nt " +
							"where nt.id=?1";
					list = findBysql(sql, "%" + keyword + "%", chartId);
					break;
				case DB_CODE_SQLITE:
					//注意：desc与>与+1配套使用
					sql = "select nt.rn FROM " +
							"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt1 on ttt.CHART_CATALOG=ttt1.id where ttt.CHART_NAME like ?0 and (ttt1.CATALOG_WEIGHT>t1.CATALOG_WEIGHT or (ttt1.CATALOG_WEIGHT=t1.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT)))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t1 on t.CHART_CATALOG=t1.id where t.CHART_NAME like ?1 order by t1.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt " +
							"where nt.id=?2";
					list = findBysql(sql, "%" + keyword + "%", "%" + keyword + "%", chartId);
					break;
				default:
					sql = "select nt.rn FROM " +
							"(select row_number() over(order by t1.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t1 on t.CHART_CATALOG=t1.id where t.CHART_NAME like ?0 order by t1.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt " +
							"where nt.id=?1";
					list = findBysql(sql, "%" + keyword + "%", chartId);
					break;
			}
		} else {
			String sql = null;
			switch (currentUsedDbCode) {
				case DB_CODE_MYSQL:
					sql = "select nt.rn FROM " +
							"(select (@rowNO\\:=@rowNo+1) as rn,t2.id from (select t.id  FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t1 on t.CHART_CATALOG=t1.id order by t1.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) t2,(select @rowNO\\:=0) tnum) nt " +
							"where nt.id=?0";
					break;
				case DB_CODE_SQLITE:
					//注意：desc与>与+1配套使用
					sql = "select nt.rn FROM " +
							"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt1 on ttt.CHART_CATALOG=ttt1.id where ttt1.CATALOG_WEIGHT>t1.CATALOG_WEIGHT or (ttt1.CATALOG_WEIGHT=t1.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t1 on t.CHART_CATALOG=t1.id order by t1.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where " +
							"nt.id=?0";
					break;
				default:
					sql = "select nt.rn FROM " +
							"(select row_number() over(order by t1.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t1 on t.CHART_CATALOG=t1.id order by t1.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt " +
							"where nt.id=?0";
					break;
			}
			list = findBysql(sql, chartId);
		}

		return getIndexFromIndexList(list);
	}


	/**
	 * 显示所有的公开图
	 *
	 * @param keyword
	 * @return
	 */
	public List<TGalleryChart> listPublicChart(String keyword, PageInfo pageInfo) {
		if (keyword != null && !"".equals(keyword)) {
			String hql = "FROM TGalleryChart t where t.TGalleryCatalog.catalogPrivate=?0 and t.chartName like ?1 order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc";
			if (pageInfo != null) {
				return findByHql(hql, pageInfo, CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%");
			} else {
				return findByHql(hql, CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%");
			}
		} else {
			String hql = "FROM TGalleryChart t where t.TGalleryCatalog.catalogPrivate=?0 order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc";
			if (pageInfo != null) {
				return findByHql(hql, pageInfo, CGalleryCatalog.CATALOG_PRIVATE_NO);
			} else {
				return findByHql(hql, CGalleryCatalog.CATALOG_PRIVATE_NO);
			}
		}
	}


	/**
	 * 取得指定chartId在所有的公开图的序号
	 *
	 * @param keyword
	 * @return
	 */
	public int getPublicChartIndexBychartId(String chartId, String keyword) {
		List<Object> list = null;

		int currentUsedDbCode = getCurrentUsedDbCode();
		if (keyword != null && !"".equals(keyword)) {
			String sql = null;
			switch (currentUsedDbCode) {
				case DB_CODE_MYSQL:
					sql = "select nt.rn FROM " +
							"(select (@rowNO\\:=@rowNo+1) as rn,nt0.id FROM (select t.* FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
							"where t2.CATALOG_PRIVATE=?0 and t.CHART_NAME like ?1 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt0,(select @rowNO\\:=0) tnum ) " +
							"nt where nt.id=?2";
					list = findBysql(sql, CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%", chartId);
					break;
				case DB_CODE_SQLITE:
					//注意：desc与>与+1配套使用
					sql = "select nt.rn FROM " +
							"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt2 on ttt.CHART_CATALOG=ttt2.id where ttt.CHART_NAME like ?0 and (ttt2.CATALOG_WEIGHT>t2.CATALOG_WEIGHT or (ttt2.CATALOG_WEIGHT=t2.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT)))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
							"where t2.CATALOG_PRIVATE=?1 and t.CHART_NAME like ?2 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) " +
							"nt where nt.id=?3";
					list = findBysql(sql, "%" + keyword + "%", CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%", chartId);
					break;
				default:
					sql = "select nt.rn FROM " +
							"(select row_number() over(order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
							"where t2.CATALOG_PRIVATE=?0 and t.CHART_NAME like ?1 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) " +
							"nt where nt.id=?2";
					list = findBysql(sql, CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%", chartId);
					break;
			}
		} else {
			String sql = null;
			switch (currentUsedDbCode) {
				case DB_CODE_MYSQL:
					sql = "select nt.rn FROM " +
							"(select (@rowNO\\:=@rowNo+1) as rn,nt0.id FROM (select t.* FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
							"where t2.CATALOG_PRIVATE=?0 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt0,(select @rowNO\\:=0) tnum ) " +
							"nt where nt.id=?1";
					break;
				case DB_CODE_SQLITE:
					//注意：desc与>与+1配套使用
					sql = "select nt.rn FROM " +
							"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt2 on ttt.CHART_CATALOG=ttt2.id where ttt2.CATALOG_WEIGHT>t2.CATALOG_WEIGHT or (ttt2.CATALOG_WEIGHT=t2.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
							"where t2.CATALOG_PRIVATE=?0 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) " +
							"nt where nt.id=?1";
					break;
				default:
					sql = "select nt.rn FROM " +
							"(select row_number() over(order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
							"where t2.CATALOG_PRIVATE=?0 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) " +
							"nt where nt.id=?1";
					break;
			}
			list = findBysql(sql, CGalleryCatalog.CATALOG_PRIVATE_NO, chartId);
		}

		return getIndexFromIndexList(list);
	}


	/**
	 * 取得所有的公开图的个数
	 *
	 * @param keyword
	 * @return
	 */
	public int getPublicChartCount(String keyword) {
		if (keyword != null && !"".equals(keyword)) {
			String hql = "FROM TGalleryChart t where t.TGalleryCatalog.catalogPrivate=?0 and t.chartName like ?1";
			return findCountByHql(hql, CGalleryCatalog.CATALOG_PRIVATE_NO, "%" + keyword + "%");
		} else {
			String hql = "FROM TGalleryChart t where t.TGalleryCatalog.catalogPrivate=?0";
			return findCountByHql(hql, CGalleryCatalog.CATALOG_PRIVATE_NO);
		}
	}

	/**
	 * 取得其节点和所有子节点的图集
	 *
	 * @param catalogId 取得指定
	 * @return
	 */
	public List<TGalleryChart> listAllBycatalogId(int catalogId) {
		String hql = "FROM TGalleryChart t where t.TGalleryCatalog.id " +
				"in(select t1.id from TGalleryCatalog t1 start with t1.id = ?0 connect by prior t1.id = t1.parent_id) " +
				"order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc";
		return findByHql(hql, catalogId);
	}

	/**
	 * 取得其节点和所有子节点的图集
	 *
	 * @param catalogIds 指定的图集目录id列表
	 * @param keyword
	 * @return
	 */
	public List<TGalleryChart> listAllBycatalogIds(List<BigDecimal> catalogIds
			, TGalleryUser tGalleryUse, String keyword, PageInfo pageInfo) {

		String condition = null;
		if (catalogIds.size() == 1 && catalogIds.get(0) != null) {
			condition = "t.TGalleryCatalog.id = " + catalogIds.get(0).intValue();
		} else {
			StringBuilder sb = new StringBuilder();
			sb.append("(");

			boolean isFlag = false;
			for (int i = 0, len = catalogIds.size(); i < len; i++) {
				BigDecimal catalogId = catalogIds.get(i);
				if (catalogId == null) {
					continue;
				}
				if (isFlag) {
					sb.append(",");
				} else {
					isFlag = true;
				}
				sb.append(catalogId.intValue());
			}
			sb.append(")");

			condition = "t.TGalleryCatalog.id in " + sb.toString();
		}

		if (tGalleryUse != null && tGalleryUse.getId() != null) {

			if (keyword != null && !"".equals(keyword)) {
				String hql = "FROM TGalleryChart t where " + condition + " and t.TGalleryUser.id=?0 and t.chartName like ?1 order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc";
				if (pageInfo != null) {
					return findByHql(hql, pageInfo, tGalleryUse.getId(), "%" + keyword + "%");
				} else {
					return findByHql(hql, tGalleryUse.getId(), "%" + keyword + "%");
				}
			} else {
				String hql = "FROM TGalleryChart t where " + condition + " and t.TGalleryUser.id=?0 order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc";
				if (pageInfo != null) {
					return findByHql(hql, pageInfo, tGalleryUse.getId());
				} else {
					return findByHql(hql, tGalleryUse.getId());
				}
			}
		} else {
			if (keyword != null && !"".equals(keyword)) {
				String hql = "FROM TGalleryChart t where " + condition + " and t.chartName like ?0 order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc";
				if (pageInfo != null) {
					return findByHql(hql, pageInfo, "%" + keyword + "%");
				} else {
					return findByHql(hql, "%" + keyword + "%");
				}
			} else {
				String hql = "FROM TGalleryChart t where " + condition + " order by t.TGalleryCatalog.catalogWeight desc,t.chartWeight desc";
				if (pageInfo != null) {
					return findByHql(hql, pageInfo);
				} else {
					return findByHql(hql);
				}
			}
		}
	}

	/**
	 * 取得其节点和所有子节点的图集总数
	 *
	 * @param catalogIds 指定的图集目录id列表
	 * @param keyword
	 * @return
	 */
	public int getAllBycatalogIdsCount(List<BigDecimal> catalogIds,
									   TGalleryUser tGalleryUser, String keyword) {
		String condition = null;
		if (catalogIds.size() == 1 && catalogIds.get(0) != null) {
			condition = "t.TGalleryCatalog.id = " + catalogIds.get(0).intValue();
		} else {
			StringBuilder sb = new StringBuilder();
			sb.append("(");

			boolean isFlag = false;
			for (int i = 0, len = catalogIds.size(); i < len; i++) {
				BigDecimal catalogId = catalogIds.get(i);
				if (catalogId == null) {
					continue;
				}
				if (isFlag) {
					sb.append(",");
				} else {
					isFlag = true;
				}
				sb.append(catalogId.intValue());
			}
			sb.append(")");

			condition = "t.TGalleryCatalog.id in " + sb.toString();
		}

		if (tGalleryUser != null && tGalleryUser.getId() != null) {

			if (keyword != null && !"".equals(keyword)) {
				String hql = "FROM TGalleryChart t where " + condition + " and t.TGalleryUser.id=?0 and t.chartName like ?1";
				return findCountByHql(hql, tGalleryUser.getId(), "%" + keyword + "%");
			} else {
				String hql = "FROM TGalleryChart t where " + condition + " and t.TGalleryUser.id=?0";
				return findCountByHql(hql, tGalleryUser.getId());
			}
		} else {
			if (keyword != null && !"".equals(keyword)) {
				String hql = "FROM TGalleryChart t where " + condition + " and t.chartName like ?0";
				return findCountByHql(hql, "%" + keyword + "%");
			} else {
				String hql = "FROM TGalleryChart t where " + condition;
				return findCountByHql(hql);
			}
		}
	}

	/**
	 * 取得其节点和所有子节点的图集总数序号
	 *
	 * @param catalogIds 指定的图集目录id列表
	 * @param keyword
	 * @return
	 */
	public int getIndexBycatalogIdsBychartId(List<BigDecimal> catalogIds,
											 TGalleryUser tGalleryUser, String chartId, String keyword) {
		String condition = null;
		String subCondition = null;
		if (catalogIds.size() == 1 && catalogIds.get(0) != null) {
			condition = "t2.id = " + catalogIds.get(0).intValue();
			subCondition = "ttt2.id = " + catalogIds.get(0).intValue();
		} else {
			StringBuilder sb = new StringBuilder();
			sb.append("(");

			boolean isFlag = false;
			for (int i = 0, len = catalogIds.size(); i < len; i++) {
				BigDecimal catalogId = catalogIds.get(i);
				if (catalogId == null) {
					continue;
				}
				if (isFlag) {
					sb.append(",");
				} else {
					isFlag = true;
				}
				sb.append(catalogId.intValue());
			}
			sb.append(")");

			condition = "t1.id in " + sb.toString();
			subCondition = "ttt2.id in " + sb.toString();
		}

		List<Object> list = null;

		int currentUsedDbCode = getCurrentUsedDbCode();
		if (tGalleryUser != null && tGalleryUser.getId() != null) {

			String sql = null;
			if (keyword != null && !"".equals(keyword)) {
				switch (currentUsedDbCode) {
					case DB_CODE_MYSQL:
						sql = "select nt.rn FROM " +
								"(select (@rowNO\\:=@rowNo+1) as rn,nt0.id FROM (select t.* FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
								"where " + condition + " and t3.id=?0 and t.CHART_NAME like ?1 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt0,(select @rowNO\\:=0) tnum ) nt where nt.id=?2";
						list = findBysql(sql, tGalleryUser.getId(), "%" + keyword + "%", chartId);
						break;
					case DB_CODE_SQLITE:
						//注意：desc与>与+1配套使用
						sql = "select nt.rn FROM " +
								"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt2 on ttt.CHART_CATALOG=ttt2.id where " + subCondition + " and ttt.CHART_NAME like ?0 and (ttt2.CATALOG_WEIGHT>t2.CATALOG_WEIGHT or (ttt2.CATALOG_WEIGHT=t2.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT)))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
								"where " + condition + " and t3.id=?1 and t.CHART_NAME like ?2 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?3";
						list = findBysql(sql, "%" + keyword + "%", tGalleryUser.getId(), "%" + keyword + "%", chartId);
						break;
					default:
						sql = "select nt.rn FROM " +
								"(select row_number() over(order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
								"where " + condition + " and t3.id=?0 and t.CHART_NAME like ?1 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?2";
						list = findBysql(sql, tGalleryUser.getId(), "%" + keyword + "%", chartId);
						break;
				}
			} else {
				switch (currentUsedDbCode) {
					case DB_CODE_MYSQL:
						sql = "select nt.rn FROM " +
								"(select (@rowNO\\:=@rowNo+1) as rn,nt0.id FROM (select t.* FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
								"where " + condition + " and t3.id=?0 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt0,(select @rowNO\\:=0) tnum ) nt where nt.id=?1";
						break;
					case DB_CODE_SQLITE:
						//注意：desc与>与+1配套使用
						sql = "select nt.rn FROM " +
								"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt2 on ttt.CHART_CATALOG=ttt2.id where " + subCondition + " and (ttt2.CATALOG_WEIGHT>t2.CATALOG_WEIGHT or (ttt2.CATALOG_WEIGHT=t2.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT)))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
								"where " + condition + " and t3.id=?0 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?1";
						break;
					default:
						sql = "select nt.rn FROM " +
								"(select row_number() over(order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id left join T_GALLERY_USER t3 on t.CHART_USER=t3.id " +
								"where " + condition + " and t3.id=?0 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?1";
						break;
				}
				list = findBysql(sql, tGalleryUser.getId(), chartId);
			}
		} else {
			String sql = null;
			if (keyword != null && !"".equals(keyword)) {
				switch (currentUsedDbCode) {
					case DB_CODE_MYSQL:
						sql = "select nt.rn FROM " +
								"(select (@rowNO\\:=@rowNo+1) as rn,nt0.id FROM (select t.* FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
								"where " + condition + " and t.CHART_NAME like ?0 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt0,(select @rowNO\\:=0) tnum ) nt where nt.id=?1";
						list = findBysql(sql, "%" + keyword + "%", chartId);
						break;
					case DB_CODE_SQLITE:
						//注意：desc与>与+1配套使用
						sql = "select nt.rn FROM " +
								"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt2 on ttt.CHART_CATALOG=ttt2.id where " + subCondition + " ttt.CHART_NAME like ?0 and (ttt2.CATALOG_WEIGHT>t2.CATALOG_WEIGHT or (ttt2.CATALOG_WEIGHT=t2.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT)))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
								"where " + condition + " and t.CHART_NAME like ?1 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?2";
						list = findBysql(sql, "%" + keyword + "%", "%" + keyword + "%", chartId);
						break;
					default:
						sql = "select nt.rn FROM " +
								"(select row_number() over(order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
								"where " + condition + " and t.CHART_NAME like ?0 order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?1";
						list = findBysql(sql, "%" + keyword + "%", chartId);
						break;
				}
			} else {
				switch (currentUsedDbCode) {
					case DB_CODE_MYSQL:
						sql = "select nt.rn FROM " +
								"(select (@rowNO\\:=@rowNo+1) as rn,nt0.id FROM (select t.* FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
								"where " + condition + " order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt0,(select @rowNO\\:=0) tnum ) nt where nt.id=?0";
						break;
					case DB_CODE_SQLITE:
						//注意：desc与>与+1配套使用
						sql = "select nt.rn FROM " +
								"(select (select count(*) from T_GALLERY_CHART ttt left join T_GALLERY_CATALOG ttt2 on ttt.CHART_CATALOG=ttt2.id where " + subCondition + " and (ttt2.CATALOG_WEIGHT>t2.CATALOG_WEIGHT or (ttt2.CATALOG_WEIGHT=t2.CATALOG_WEIGHT and ttt.CHART_WEIGHT>t.CHART_WEIGHT)))+1 as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
								"where " + condition + " order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?0";
						break;
					default:
						sql = "select nt.rn FROM " +
								"(select row_number() over(order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) as rn,t.id FROM T_GALLERY_CHART t left join T_GALLERY_CATALOG t2 on t.CHART_CATALOG=t2.id " +
								"where " + condition + " order by t2.CATALOG_WEIGHT desc,t.CHART_WEIGHT desc) nt where nt.id=?0";
						break;
				}
				list = findBysql(sql, chartId);
			}
		}

		return getIndexFromIndexList(list);
	}


	/**
	 * 列表指定一个或者多个chartId下的图集信息
	 *
	 * @param chartIds 一个或者多个图集id
	 * @return
	 */
	public List<TGalleryChart> listBychartIds(String[] chartIds) {
		if (chartIds == null || chartIds.length < 1) {
			return new ArrayList<TGalleryChart>();
		}

		StringBuilder sb = new StringBuilder();
		sb.append("(");

		boolean isFlag = false;
		for (int i = 0; i < chartIds.length; i++) {
			String chartId = chartIds[i];
			if (chartId == null || "".equals(chartId)) {
				continue;
			}
			if (isFlag) {
				sb.append(",");
			} else {
				isFlag = true;
			}
			sb.append("'").append(chartId).append("'");
		}

		sb.append(")");

		String hql = "FROM TGalleryChart t where t.id in " + sb.toString();
		return findByHql(hql);
	}

	/**
	 * 取得指定用户的图个数
	 *
	 * @return
	 */
	public int getMyGalleryCount(TGalleryUser tGalleryUser) {
		return findCountByHql("FROM TGalleryChart t where t.TGalleryUser.id=?0", tGalleryUser.getId());
	}

	/**
	 * 取得指定用户的图列表
	 *
	 * @return
	 */
	public List<TGalleryChart> getMyGalleryList(TGalleryUser tGalleryUser, PageInfo pageInfo) {
		return findByHql("FROM TGalleryChart t where t.TGalleryUser.id=?0 ORDER BY t.TGalleryCatalog.catalogWeight DESC,t.chartWeight DESC",
				pageInfo, tGalleryUser.getId());
	}

	/**
	 * 取得chartWeight值为null的个数
	 *
	 * @return
	 */
	public int getNullChartWeightCount() {
		return findCountByHql("FROM TGalleryChart t WHERE t.chartWeight is null");
	}

	/**
	 * 重新初始化权值(只有存在null值得时候才重新分配权值)
	 *
	 * @return 更新的个数（-1代表不需要更新）
	 */
	public int reInitTGalleryChartWeightIfExistNull() {
		//取得空值个数，如果>0代表（chartWeight）字段为新建的
		int nullCount = getNullChartWeightCount();
		if (nullCount > 0) {
			int currentUsedDbCode = getCurrentUsedDbCode();

			String sql = null;
			switch (currentUsedDbCode) {
				case DB_CODE_MYSQL:
					sql = "UPDATE T_GALLERY_CHART,(SELECT @b\\:=0) AS rownum SET CHART_WEIGHT=(@b\\:= @b +1)";
					break;
				case DB_CODE_SQLITE:
					sql = "UPDATE T_GALLERY_CHART SET CHART_WEIGHT = rowid";
					break;
				default:
					sql = "UPDATE T_GALLERY_CHART t SET t.CHART_WEIGHT = rownum";
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
	public int getCurrentMaxChartWeight() {
		int total = getAllChartsCount(null);
		if (total == 0) {
			return 0;
		}

		List<Object> list = findBysql("SELECT MAX(CHART_WEIGHT) FROM T_GALLERY_CHART ORDER BY CHART_WEIGHT DESC");
		int result = getIndexFromIndexList(list);
		return result > 0 ? result : 0;
	}

	/**
	 * 修改指定图集的权值
	 *
	 * @param catalogId 指定目录
	 * @param minWeight 需要更新的最小权限（开区间）
	 * @param maxWeight 需要更新的最大权限（开区间）
	 * @param isPlus    是否是权值增加（默认是减）
	 * @return
	 */
	public int sortableChart(int catalogId, int minWeight, int maxWeight, boolean isPlus) {
		String op = isPlus ? " + " : " - ";
		String sql = "UPDATE T_GALLERY_CHART SET CHART_WEIGHT = CHART_WEIGHT " + op + CGalleryChart.CHART_WEIGHT_STEP
				+ " WHERE CHART_CATALOG=?0 AND CHART_WEIGHT < " + maxWeight + " AND CHART_WEIGHT > " + minWeight;
		return excuteBySql(sql, catalogId);
	}

	/**
	 * 取得chartImagePath值为null的个数
	 *
	 * @return
	 */
	public int getNullImagePathCount() {
		return findCountByHql("FROM TGalleryChart t WHERE t.chartImagePath is null");
	}

	/**
	 * 重新初始化chartImagePath
	 *
	 * @return 更新的个数（-1代表不需要更新）
	 */
	public int reInitTGalleryChartImagePathIfExistNull(HttpServletRequest request) {
		//取得空值个数，如果>0代表（catalogWeight）字段为新建的
		int nullCount = getNullImagePathCount();
		if (nullCount > 0) {
			int currentUsedDbCode = getCurrentUsedDbCode();

			String sql = "SELECT ID,CHART_IMAGE FROM T_GALLERY_CHART WHERE CHART_IMAGE_PATH IS NULL ";
			List<Object> list = findBysql(sql);
			int ListNum=list.size();
			for(int i=0;i<ListNum;i++){
				Object[] row = (Object[]) list.get(i);
				String ID=row[0].toString();
				String image=row[1].toString();
				String chartImagePath= ImagePathController.chartImagePath(image, request);
				String sqlImagePath="UPDATE T_GALLERY_CHART SET CHART_IMAGE_PATH = '" + chartImagePath + "' WHERE ID = '" + ID + "'";
				excuteBySql(sqlImagePath);
			}
			int result = getIndexFromIndexList(list);
			return result > 0 ? result : 0;
		}

		return -1;
	}

}