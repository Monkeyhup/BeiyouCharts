package com.supermap.result;

/**
 * 对象结果
 * 
 * @author Linhao
 *
 */
public class ObjectResult extends Result{
	
	public ObjectResult(){}
	
	public ObjectResult(int code,String message){
		super(code,message);
	}

	public ObjectResult(int code,String message,Object data){
		super(code,message);
		setData(data);
	}
	
	private Object data;

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

}
