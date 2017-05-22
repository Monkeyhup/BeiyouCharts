package com.supermap.dao;

import com.supermap.modal.TGalleryVisits;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

/**
 * A data access object (DAO) providing persistence and search support for
 * TGalleryVisits entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.supermap.modal.TGalleryVisits
 * @author MyEclipse Persistence Tools
 */
@Repository
public class TGalleryVisitsDAO extends BaseHibernateDAO<TGalleryVisits> {
	private static final Logger log = LoggerFactory.getLogger(TGalleryVisitsDAO.class);
	
	@Override
	public List<TGalleryVisits> findAll() {
		return findByHql("FROM TGalleryVisits");
	}

	
}