package com.supermap.common;

/**
 * 检索的范围信息
 * 
 * @author Linhao
 *
 */
public class PageInfo {

	private int start = 1;
	
	private int end = 10;
	
	public PageInfo(){}
	
	public PageInfo(int start,int end){
		this.start = start;
		this.end = end;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getEnd() {
		return end;
	}

	public void setEnd(int end) {
		this.end = end;
	}
	
	
}
