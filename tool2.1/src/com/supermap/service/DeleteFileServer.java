package com.supermap.service;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;

/**
 * 删除文件服务
 */
public class DeleteFileServer implements ActionListener {
	/**一天的毫秒数*/
	public static final long ONE_DAY = 24 * 3600 * 1000;
	/**一小时的毫秒数*/
	public static final int ONE_HOUR = 3600 * 1000;

	/**时间*/
	private Timer timer = null;
	/**上传的excel 目录*/
	private String uploadExcelPath = null;
	/**上传的json 目录*/
	private String uploadJsonPath = null;

	/**
	 * 无参构造函数
	 */
	private DeleteFileServer(){
	}

	/**
	 * 构造函数
	 * @param uploadExcelPath
	 * 			上传的excel 目录
	 * @param uploadJsonPath
	 * 			上传的json 目录
	 */
	public DeleteFileServer(String uploadExcelPath,String uploadJsonPath){
		this.uploadExcelPath = uploadExcelPath;
		this.uploadJsonPath = uploadJsonPath;
	}


	/**
	 * 启动服务
	 */
	public void startServer() {
		if(timer == null){
			timer = new Timer(ONE_HOUR,this);
			timer.start();
		}
	}

	/**
	 * 停止服务
	 */
	public void stopServer(){
		if(timer != null){
			timer.stop();
			timer = null;
		}
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		delAllFile(uploadExcelPath);
		delAllFile(uploadJsonPath);
	}


	/**
	 * 删除指定文件夹下所有文件
	 * @param path
	 * 			文件路径
	 * @return
	 */
	private boolean delAllFile(String path) {
		boolean flag = false;
		if (path == null) {
			return flag;
		}
		File file = new File(path);
		if (!file.exists()) {
			return flag;
		}
		if (!file.isDirectory()) {
			return flag;
		}
		String[] tempList = file.list();
		if (tempList == null || tempList.length <= 0) {
			return false;
		}

		File temp = null;
		for (int i = 0, len = tempList.length; i < len; i++) {
			if (path.endsWith(File.separator)) {
				temp = new File(path + tempList[i]);
			} else {
				temp = new File(path + File.separator + tempList[i]);
			}

			if (temp.isFile()) {
				long lastModifyTime = temp.lastModified();
				if (isCanDeleteFile(lastModifyTime)) {
					temp.delete();
				}
			}
			if (temp.isDirectory()) {
				// 先删除文件夹里面的文件
				delAllFile(path + File.separator + tempList[i]);
				flag = true;
			}
		}
		return flag;
	}

	/**
	 * 判断是否可以删除文件
	 * <p>
	 * 	删除一天前的文件
	 * </p>
	 * @param lastModifyTime
	 * 			文件最后修改时间
	 * @return
	 */
	private boolean isCanDeleteFile(long lastModifyTime) {
		long currentTime = System.currentTimeMillis();
		if (currentTime > lastModifyTime + ONE_DAY) {
			return true;
		}
		return false;
	}
}
