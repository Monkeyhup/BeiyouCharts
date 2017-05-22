package com.supermap.service;

import java.io.File;

import com.supermap.common.Result;


/**
 * 
 * @author Linhao
 *
 */
public class D3RectService extends D3BarDrillService {

	/**
	 * 重写D3BarDrillService中的方法
	 */
	@Override
	public Result createJsonFileByExcel(File excelFile, File dir,
			String fileName) {
		return super.createJsonFileByExcel(excelFile, dir, fileName);
	}
}
