package com.supermap.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.supermap.dao.TGalleryVisitsDAO;
import com.supermap.modal.TGalleryVisits;

@Service
public class TGalleryVisitsService {

	@Autowired
	TGalleryVisitsDAO tGalleryVisitsDAO;
	
	public List<TGalleryVisits> list(){
		return tGalleryVisitsDAO.findAll();
	}
}
