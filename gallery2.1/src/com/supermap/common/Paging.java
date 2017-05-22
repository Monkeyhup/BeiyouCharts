package com.supermap.common;

/**
 * ��ҳ��Ϣ
 * <p style="color:red;">
 *     ע�⣺�˴���PageInfo������Paging��Ӧ��ǰ�˵ķ�ҳ
 * </p>
 * Created by Linhao on 2015/10/19.
 *
 */
public class Paging {
    /**
     * Ĭ�ϵ�һҳ
     */
    private int pageNumber = 1;

    /**
     * Ĭ��ÿҳ10��
     */
    private int pageSize = 10;

    public Paging(){}

    public Paging(int pageNumber,int pageSize){
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }

    public void setPageNumber(int pageNumber){
        this.pageNumber = pageNumber;
    }

    public int getPageNumber(){
        return pageNumber;
    }

    public void setPageSize(int pageSize){
        this.pageSize = pageSize;
    }

    public int getPageSize(){
        return pageSize;
    }

    /**
     * ��ҳ��Ϣת��Ϊsql�Ĳ�ѯ��ҳ
     * @return
     */
    public PageInfo toPageInfo(){
        int start = (getPageNumber()-1) * getPageSize();
        int end = getPageSize();
        return new PageInfo(start,end);
    }
}
