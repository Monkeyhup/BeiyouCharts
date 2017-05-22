package com.supermap.service;

/**
 * 基本服务
 * 
 * @author Linhao
 *
 * @param <T>
 */
public abstract class BaseService<T>{

	public abstract boolean add(T entity);
	
	public abstract boolean update(T entity);
	
	public abstract boolean delete(T entity);
}
