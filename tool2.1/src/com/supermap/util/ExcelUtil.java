package com.supermap.util;

import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.hssf.util.Region;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by W.Qiong on 14-8-21. Excel操作类
 */
@SuppressWarnings("deprecation")
public class ExcelUtil {

	private static String getExtensionName(String filename) {
		if ((filename != null) && (filename.length() > 0)) {
			int dot = filename.lastIndexOf('.');
			if ((dot > -1) && (dot < (filename.length() - 1))) {
				return filename.substring(dot + 1);
			}
		}
		return filename;
	}

	public static List<List<Object>> readExcel(String uploadFilePath,
			String filename, String sheetName, boolean isContainHeader) {
		String path_name = uploadFilePath + filename;
		String extStr = getExtensionName(path_name);
		if (extStr.toLowerCase().equals("xls")) {
			return readHssfExcel(path_name, sheetName, isContainHeader);
		} else if (extStr.toLowerCase().equals("xlsx")) {
			return readXssfExcel(path_name, sheetName, isContainHeader);
		} else {
			return new ArrayList<List<Object>>();
		}
	}

	private static List<List<Object>> readHssfExcel(String path,
			String sheetName, boolean isContainHeader) {
		List<List<Object>> dataList = new ArrayList<List<Object>>();
		File file = new File(path);
		if (file.exists()) {
			HSSFWorkbook xwb = null;
			try {
				xwb = new HSSFWorkbook(new FileInputStream(file));
			} catch (IOException e) {
				e.printStackTrace();
			}
			int index = 0;
			if (sheetName != "") {
				index = xwb.getSheetIndex(sheetName);
			} else
				index = 0;
			if (index != -1) {
				HSSFSheet sheet = xwb.getSheetAt(index);
				HSSFRow row = null;
				HSSFCell cell = null;
				Object val = null;
				int i = sheet.getFirstRowNum();
				if (!isContainHeader) {
					i++;// 多维表头或者有空行,这样有问题吧？？？
				}
				for (; i < sheet.getPhysicalNumberOfRows(); i++) {
					row = sheet.getRow(i);
					if (row == null) {
						continue;
					}
					List<Object> objList = new ArrayList<Object>();
					for (int j = row.getFirstCellNum(); j < row
							.getLastCellNum(); j++) {
						cell = row.getCell(j);
						if (cell == null) {
							val = null;
							objList.add(val);
							continue;
						}
						switch (cell.getCellType()) {
						case XSSFCell.CELL_TYPE_STRING:
							val = cell.getStringCellValue();
							break;
						case XSSFCell.CELL_TYPE_NUMERIC:
							val = cell.getNumericCellValue();
							// 这块有问题？？先注掉？？
							// if
							// ("@".equals(cell.getCellStyle().getDataFormatString()))
							// {
							// val = df.format(cell.getNumericCellValue());
							// } else if ("General".equals(cell.getCellStyle()
							// .getDataFormatString())) {
							// val = df.format(cell.getNumericCellValue());
							// } else {
							// val = sdf.format(HSSFDateUtil.getJavaDate(cell
							// .getNumericCellValue()));
							// }
							break;
						case XSSFCell.CELL_TYPE_BOOLEAN:
							val = cell.getBooleanCellValue();
							break;
						case XSSFCell.CELL_TYPE_BLANK:
							val = "";
							break;
						default:
							val = cell.toString();
							break;
						}
						objList.add(val);
					}
					dataList.add(objList);
				}
			}
		}
		return dataList;
	}

	private static List<List<Object>> readXssfExcel(String path,
			String sheetName, boolean isContainHeader) {
		List<List<Object>> dataList = new ArrayList<List<Object>>();
		try {
			File file = new File(path);
			if (file.exists()) {
				FileInputStream inputStream = new FileInputStream(file);
				XSSFWorkbook xwb = new XSSFWorkbook(inputStream);
				int index = 0;
				if (sheetName == "") {
					index = 0;
				} else
					index = xwb.getSheetIndex(sheetName);
				if (index != -1) {
					XSSFSheet sheet = xwb.getSheetAt(index);
					XSSFRow row = null;
					XSSFCell cell = null;
					Object val = null;
					int i = sheet.getFirstRowNum();
					if (!isContainHeader) {
						i++;
					}
					for (; i < sheet.getPhysicalNumberOfRows(); i++) {
						row = sheet.getRow(i);
						if (row == null) {
							continue;
						}
						List<Object> objList = new ArrayList<Object>();
						row.getPhysicalNumberOfCells();
						for (int j = row.getFirstCellNum(); j < row
								.getLastCellNum(); j++) {
							cell = row.getCell(j);
							if (cell == null) {
								val = "";
								objList.add(val);
								continue;
							}
							cell.setCellType(XSSFCell.CELL_TYPE_STRING);
							objList.add(cell.getStringCellValue());
						}
						dataList.add(objList);
					}
				}
				inputStream.close();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return dataList;
	}

	public static String[] readExcelHeader(String uploadFilePath,
			String fileName, String sheetName) {
		String path = uploadFilePath + fileName;
		String extStr = getExtensionName(fileName);
		if (extStr.toLowerCase().equals("xls")) {
			return readHssfExcelHeader(path, sheetName);
		} else if (extStr.toLowerCase().equals("xlsx")) {
			return readXssfExcelHeader(path, sheetName);
		} else {
			return null;
		}
	}

	private static String[] readHssfExcelHeader(String path, String sheetName) {
		String[] header = new String[0];
		File file = new File(path);
		if (file.exists()) {
			HSSFWorkbook xwb = null;
			try {
				xwb = new HSSFWorkbook(new FileInputStream(file));
				int index = 0;
				if (sheetName != "") {
					index = xwb.getSheetIndex(sheetName);
				} else
					index = 0;
				if (index != -1) {
					HSSFSheet sheet = xwb.getSheetAt(index);
					HSSFRow row = sheet.getRow(0);
					int colNum = row.getPhysicalNumberOfCells();
					header = new String[colNum];
					for (int i = 0; i < colNum; i++) {
						header[i] = row.getCell(i).getStringCellValue();
					}
				}
			} catch (IOException e) {
				// e.printStackTrace();
				return header;
			}
		}
		return header;
	}

	private static String[] readXssfExcelHeader(String path, String sheetName) {
		String[] header = new String[0];
		File file = new File(path);
		if (file.exists()) {
			XSSFWorkbook xwb = null;
			try {
				xwb = new XSSFWorkbook(new FileInputStream(file));
				int index = 0;
				if (sheetName != "") {
					index = xwb.getSheetIndex(sheetName);
				} else
					index = 0;
				if (index != -1) {
					XSSFSheet sheet = xwb.getSheetAt(index);
					XSSFRow row = sheet.getRow(0);
					int colNum = row.getPhysicalNumberOfCells();
					header = new String[colNum];
					for (int i = 0; i < colNum; i++) {
						header[i] = row.getCell(i).getStringCellValue();
					}
				}
			} catch (IOException e) {
				// e.printStackTrace();
				return header;
			}
		}
		return header;
	}

	/**
	 * 只支持一维表头
	 * 
	 * @param sheetName
	 * @param head
	 * @param detalist
	 * @return
	 */
	public static HSSFWorkbook dataToWorkbook(String sheetName, String[] head,
			List<List<String>> detalist) {
		try {
			HSSFWorkbook wk = new HSSFWorkbook();
			HSSFSheet sheet = wk.createSheet(sheetName);
			HSSFRow headrow = sheet.createRow(0);
			int index = 0;
			for (String h : head) { // 表头写入
				// 设置字体
				HSSFFont font = wk.createFont();
				font.setFontHeightInPoints((short) 10); // 字体高度
				font.setFontName("黑体"); // 字体
				font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD); // 宽度

				// 设置单元格类型样式
				HSSFCellStyle cellStyle = wk.createCellStyle();
				cellStyle.setFont(font);
				cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 水平布局：居中
				cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);// 带边框
				cellStyle.setWrapText(true);
				cellStyle
						.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);// 行底色
				cellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);

				HSSFCell headcell = headrow.createCell(index++);
				headcell.setCellStyle(cellStyle);
				headcell.setCellValue(h);
			}
			int rownum = detalist.size();
			for (int i = 1; i < rownum + 1; i++) {
				List<String> list = detalist.get(i - 1);
				HSSFRow row = sheet.createRow(i);
				for (int cindex = 0; cindex < list.size(); cindex++) {
					HSSFCell cell = row.createCell(cindex);
					cell.setCellValue(list.get(cindex));
				}
			}
			return wk;
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}

	/**
	 * 支持一维表头
	 * 
	 * @param sheetName
	 * @param head
	 * @param detaArr
	 *            二维数组
	 * @return
	 */
	public static HSSFWorkbook dataToWorkbook(String sheetName, String[] head,
			String[][] dataArr) {
		try {
			HSSFWorkbook wk = new HSSFWorkbook();
			HSSFSheet sheet = wk.createSheet(sheetName);
			HSSFRow headrow = sheet.createRow(0);
			int index = 0;
			for (String h : head) { // 表头写入
				// 设置字体
				HSSFFont font = wk.createFont();
				font.setFontHeightInPoints((short) 10); // 字体高度
				font.setFontName("黑体"); // 字体
				font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD); // 宽度

				// 设置单元格类型样式
				HSSFCellStyle cellStyle = wk.createCellStyle();
				cellStyle.setFont(font);
				cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 水平布局：居中
				cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);// 带边框
				cellStyle.setWrapText(true);
				cellStyle
						.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);// 行底色
				cellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);

				HSSFCell headcell = headrow.createCell(index++);
				headcell.setCellStyle(cellStyle);
				headcell.setCellValue(h);
			}
			int rownum = dataArr.length;
			for (int i = 1; i < rownum + 1; i++) {
				String[] rData = dataArr[i - 1];
				HSSFRow row = sheet.createRow(i);
				for (int cindex = 0; cindex < rData.length; cindex++) {
					HSSFCell cell = row.createCell(cindex);
					cell.setCellValue(rData[cindex]);
				}
			}
			return wk;
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}

	/**
	 * 支持多维表头 汇总数据导出
	 * 
	 * @param sheetName
	 * @param head
	 * @param detalist
	 * @return
	 */
	@SuppressWarnings("unused")
	public static HSSFWorkbook dataToWorkbook(String sheetName,
			List<List<String>> head, List<List<String>> detalist) {
		try {
			HSSFWorkbook wk = new HSSFWorkbook();
			HSSFSheet sheet = wk.createSheet(sheetName);
			// 设置字体
			HSSFFont font = wk.createFont();
			font.setFontHeightInPoints((short) 10); // 字体高度
			font.setFontName("黑体"); // 字体
			font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD); // 宽度

			// 设置单元格类型样式
			HSSFCellStyle cellStyle = wk.createCellStyle();
			cellStyle.setFont(font);
			cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 水平布局：居中
			cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
			cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);// 带边框
			cellStyle.setWrapText(true);
			cellStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);// 行底色
			cellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);

			// 表头写入
			int rowIndex = 0;
			for (List<String> r : head) {
				HSSFRow headrow = sheet.createRow(rowIndex++);
				int colIndex = 0;
				for (String c : r) {
					HSSFCell headcell = headrow.createCell(colIndex++);
					headcell.setCellStyle(cellStyle);
					headcell.setCellValue(null != c
							&& (c.equals("#rspan") || c.equals("#cspan")) ? ""
							: c);
				}
			}
			// 处理表头合并单元格
			rowIndex = 0;
			for (List<String> r : head) {
				int colIndex = 0;
				for (String c : r) {

					if (colIndex < r.size() - 1) {
						String right = r.get(colIndex + 1);// 检测右边单元格是否为列合并
						if (null != right && right.equals("#cspan")) {
							int endColspan = colIndex + 1;
							for (int ci = colIndex + 2; ci < r.size(); ci++) {
								String s = r.get(ci);
								if (null != s && s.equals("#cspan")) {
									endColspan = ci;
								} else {
									break;
								}
							}
							sheet.addMergedRegion(new Region(rowIndex,
									(short) colIndex, rowIndex,
									(short) endColspan));
						}
					}
					if (rowIndex < head.size() - 1) {
						String bottom = head.get(rowIndex + 1).get(colIndex);
						if (null != bottom && bottom.equals("#rspan")) {
							int endRowspan = rowIndex + 1;
							for (int ri = rowIndex + 2; ri < head.size(); ri++) {
								String s = head.get(ri).get(colIndex);
								if (null != s && s.equals("#cspan")) {
									endRowspan = ri;
								} else {
									break;
								}
							}
							sheet.addMergedRegion(new Region(rowIndex,
									(short) colIndex, endRowspan,
									(short) colIndex));
						}
					}

					colIndex++;
				}
				rowIndex++;
			}

			int rownum = detalist.size();
			for (int i = head.size(); i < rownum + head.size(); i++) {
				List<String> list = detalist.get(i - head.size());
				HSSFRow row = sheet.createRow(i);
				for (int cindex = 0; cindex < list.size(); cindex++) {
					HSSFCell cell = row.createCell(cindex);
					cell.setCellValue(list.get(cindex));
				}
			}
			return wk;
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}

	public static boolean exportExcel(String path, String sheetName,
			String[] head, List<List<String>> detalist) {
		String extStr = getExtensionName(path);
		if (extStr.toLowerCase().equals("xls")) {
			return exportExcelLowVersion(path, sheetName, head, detalist);
		} else if (extStr.toLowerCase().equals("xlsx")) {
			return exportExcelAdvanceVersion(path, sheetName, head, detalist);
		} else {
			return false;
		}
	}

	private static boolean exportExcelLowVersion(String path, String sheetName,
			String[] head, List<List<String>> detalist) {
		try {
			HSSFWorkbook wk = new HSSFWorkbook();
			HSSFSheet sheet = wk.createSheet(sheetName);
			HSSFRow headrow = sheet.createRow(0);
			int index = 0;
			for (String h : head) { // 表头写入
				HSSFCell headcell = headrow.createCell(index++);
				headcell.setCellValue(h);
			}
			int rownum = detalist.size();
			for (int i = 1; i < rownum + 1; i++) {
				List<String> list = detalist.get(i - 1);
				HSSFRow row = sheet.createRow(i);
				for (int cindex = 0; cindex < list.size(); cindex++) {
					HSSFCell cell = row.createCell(cindex);
					cell.setCellValue(list.get(cindex));
				}
			}
			OutputStream out = null;
			out = new FileOutputStream(path);
			wk.write(out);
			out.close();
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
		return true;
	}

	private static boolean exportExcelAdvanceVersion(String path,
			String sheetName, String[] head, List<List<String>> detalist) {
		try {
			XSSFWorkbook wk = new XSSFWorkbook();
			XSSFSheet sheet = wk.createSheet(sheetName);
			XSSFRow headrow = sheet.createRow(0);
			int index = 0;
			for (String h : head) { // 表头写入
				XSSFCell headcell = headrow.createCell(index++);
				headcell.setCellValue(h);
			}
			int rownum = detalist.size();
			for (int i = 1; i < rownum + 1; i++) {
				List<String> list = detalist.get(i - 1);
				XSSFRow row = sheet.createRow(i);
				for (int cindex = 0; cindex < list.size(); cindex++) {
					XSSFCell cell = row.createCell(cindex);
					cell.setCellValue(list.get(cindex));
				}
			}
			OutputStream out = null;
			out = new FileOutputStream(path);
			wk.write(out);
			out.close();
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
		return true;
	}

	public static List<Map<String, String>> getSheets(String uploadFilePath,
			String fileName) {
		String pather = uploadFilePath + fileName;
		String ext = getExtensionName(pather);
		
		if (ext.equalsIgnoreCase("xls")) {
			return getHssfSheets(pather);
		} else if(ext.equalsIgnoreCase("xlsx")){
			return getXssfSheets(pather);
		}else{
			return new ArrayList<Map<String,String>>();
		}
	}

	private static List<Map<String,String>> getHssfSheets(String filePath){
        List<Map<String,String>> re = new ArrayList<Map<String,String>>();
        try {
            InputStream in = new FileInputStream(filePath);
            POIFSFileSystem poi = new POIFSFileSystem(in);
            HSSFWorkbook wk = new HSSFWorkbook(poi);
            int num = wk.getNumberOfSheets();
            for(int i =0 ; i< num ;i++){
                Map<String,String> map = new HashMap<String,String>();
                map.put("index",i+"");
                map.put("name",wk.getSheetName(i));
                re.add(map);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return  re ;
    }

    private static  List<Map<String,String>> getXssfSheets(String filePath){
        List<Map<String,String>> re = new ArrayList<Map<String,String>>();
        try {
            InputStream in = new FileInputStream(filePath);
            XSSFWorkbook wk = new XSSFWorkbook(in);
            int num = wk.getNumberOfSheets();
            for(int i =0 ; i< num ;i++){
                Map<String,String> map = new HashMap<String,String>();
                map.put("index",i+"");
                map.put("name",wk.getSheetName(i));
                re.add(map);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return  re ;
    }

}
