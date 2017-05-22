package com.supermap.common;

/**
 * 分页信息
 * <p style="color:red;">
 *     注意：此处与PageInfo的区别，Paging对应的前端的分页
 * </p>
 * Created by Linhao on 2015/10/19.
 *
 */
public class Paging {
    /**
     * 默认第一页
     */
    private int pageNumber = 1;

    /**
     * 默认每页10条
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
     * 分页信息转换为sql的查询分页
     * @return
     */
    public PageInfo toPageInfo(){
        int start = (getPageNumber()-1) * getPageSize();
        int end = getPageSize();
        return new PageInfo(start,end);
    }
}
