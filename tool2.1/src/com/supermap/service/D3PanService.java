package com.supermap.service;

import java.io.File;

import com.supermap.common.Result;

/**
 * 
 * @author Linhao
 *
 */
public class D3PanService extends D3BarDrillService  {
	
	@Override
	public Result createJsonFileByExcel(File excelFile, File dir,
			String fileName) {
		return super.createJsonFileByExcel(excelFile, dir, fileName);
	}
}
