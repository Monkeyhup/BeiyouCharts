package com.supermap.dao;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.math.BigDecimal;
import java.util.List;

import com.supermap.common.PageInfo;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.internal.SessionImpl;
import org.springframework.beans.factory.annotation.Autowired;


/**
 * Data access object (DAO) for domain model
 * @author MyEclipse Persistence Tools
 */
public abstract class BaseHibernateDAO<T> implements IBaseHibernateDAO {

    /**mysql数据库驱动*/
    private static final String HIBERNATE_MYSQL_DIALECT = "org.hibernate.dialect.MySQLDialect";
    /**sqlite数据库驱动*/
    private static final String HIBERNATE_SQLITE_DIALECT = "com.supermap.dialect.SQLiteDialect";

    /**数据库类型状态码：0（oracle,默认）*/
    protected static final int DB_CODE_ORACLE = 0x00;
    /**数据库类型状态码：1（mysql）*/
    protected static final int DB_CODE_MYSQL = 0x01;
    /**数据库类型状态码：2（sqlite）*/
    protected static final int DB_CODE_SQLITE = 0x02;

    /**是否校验过数据库类型（防止重复校验）*/
    private static boolean isHasValited = false;

    /**全局标记当前被使用的数据库状态码：0（oracle,默认）*/
    private static int currentUsedDbCode = DB_CODE_ORACLE;

    /***模拟HibernateSessionFactory保存当前的Session**/
    private static final ThreadLocal<Session> threadLocal = new ThreadLocal<Session>();

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Session getSession() {
        Session session = threadLocal.get();
        if (session == null || !session.isOpen()) {
            session = sessionFactory.openSession();
            threadLocal.set(session);
        }

        return session;
    }


    @Override
    public void closeSession() {
        Session session = threadLocal.get();
        if(session != null){
            session.close();
        }
    }

    /**
     * 保存数据
     *
     * @param entity
     */
    public boolean save(T entity) {
        Session session = getSession();
        try {
            Transaction transaction = session.beginTransaction();
            session.save(entity);
            transaction.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 更新一条数据
     * @param entity
     * 			更新的实体
     * @return
     */
    public boolean update(T entity) {
        boolean re = false;
        try {
            //先清除一下session
            closeSession();

            Session session = getSession();
            Transaction transaction = session.beginTransaction();
            session.update(entity);
            transaction.commit();
            session.clear();

            re = true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return re;
    }

    /**
     * 删除实体
     * @param entity
     * 			更新的实体
     * @return
     */
    public boolean delete(T entity) {
        Session session = getSession();
        boolean re = false;
        try {
            Transaction transaction = session.beginTransaction();
            session.merge(entity);
            session.delete(entity);
            transaction.commit();
            re = true;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return re;
    }

    /**
     * 取得一条实体记录
     *
     * @param id
     * 			实体id
     * @return
     */
    @SuppressWarnings("unchecked")
    public T getOne(Serializable id) {
        Session session = null;
        T obj = null;

        try {
            Class<T> entityClass = (Class<T>) ((ParameterizedType) getClass()
                    .getGenericSuperclass()).getActualTypeArguments()[0];
            session = getSession();
            session.clear();
            Transaction transaction = session.beginTransaction();

            obj = (T) session.get(entityClass, id);
            transaction.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return obj;
    }

    /**
     * 根据ID加载数据 延迟加载lazy
     *
     * @param id
     *            数据ID
     * @return 数据对象
     */
//    @SuppressWarnings("unchecked")
//    public T loadOne(Serializable id) {
//        Session session = null;
//        T obj = null;
//        try {
//            Class<T> entityClass = (Class<T>) ((ParameterizedType) getClass()
//                    .getGenericSuperclass()).getActualTypeArguments()[0];
//            session = getSession();
//            obj = (T) session.load(entityClass, id);
//        } catch (Exception ex) {
//            ex.printStackTrace();
//        }
//        return obj;
//    }

    /**
     * 列表数据
     * @param hql
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<T> list(String hql) {
        try {
            Query queryObject = getSession().createQuery(hql);
            List<T> t =  queryObject.list();
            return t;
        } catch (RuntimeException re) {
            throw re;
        }
    }

    /**
     * 根据列表数据
     * @param hql
     * @param args
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<T> findByHql(String hql,Object... args){
        Session session = getSession();
        try {
            Query query = session.createQuery(hql);

            for (int i = 0; i < args.length; i++) {
                query.setParameter(i+"", args[i]);
            }
            List<T> t = query.list();
            return t;
        } catch (RuntimeException re) {
            throw re;
        }
    }

    /**
     * 根据列表数据
     * @param hql
     * @param pageInfo
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<T> findByHql(String hql,PageInfo pageInfo) {
        try {
            Query query = getSession().createQuery(hql);
            if(pageInfo != null){
                query.setFirstResult(pageInfo.getStart());
                query.setMaxResults(pageInfo.getEnd());
            }

            List<T> t =  query.list();
            return t;
        } catch (RuntimeException re) {
            throw re;
        }
    }

    /**
     * 根据列表数据
     * @param hql
     * @param pageInfo
     * @param args
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<T> findByHql(String hql,PageInfo pageInfo,Object... args) {
        try {
            Session session = getSession();
            Query query = session.createQuery(hql);
            if(pageInfo != null){
                query.setFirstResult(pageInfo.getStart());
                query.setMaxResults(pageInfo.getEnd());
            }

            for (int i = 0; i < args.length; i++) {
                query.setParameter(i+"", args[i]);
            }

            List<T> t =  query.list();
            return t;
        } catch (RuntimeException re) {
            throw re;
        }
    }

    /**
     * 根据条件，获取总条目数
     *
     * @param hql
     * @return
     */
    public int findCountByHql(String hql) {
        int retVal = 0;
        try {
            Session session = getSession();
            Query query = session.createQuery("select count(*) " + hql);
            retVal = ((Number) query.uniqueResult()).intValue();
        } catch (Exception ex) {
            ex.printStackTrace();
            retVal = -1;
        }
        return retVal;
    }

    /**
     * 根据条件，获取总条目数
     *
     * @param hql
     * @param args
     *            条件数据
     * @return
     */
    public int findCountByHql(String hql, Object... args) {
        int retVal = 0;
        try {
            Session session = getSession();
            Query query = session.createQuery("select count(*) " + hql);
            for (int index = 0, size = args.length; index < size; index++) {
                query.setParameter(index+"", args[index]);
            }
            retVal = ((Number) query.uniqueResult()).intValue();
        } catch (Exception ex) {
            ex.printStackTrace();
            retVal = -1;
        }
        return retVal;
    }

    /**
     * 根据sql列表数据
     * @param queryString
     * @param args
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<Object> findBysql(String queryString,Object... args){
        try {
            Query query = getSession().createSQLQuery(queryString);

            for (int i = 0; i < args.length; i++) {
                query.setParameter(i+"", args[i]);
            }
            return query.list();
        } catch (RuntimeException re) {
            throw re;
        }
    }

    /**
     * 列表所有的数据
     *
     * @return
     */
    public abstract List<T> findAll();


    /**
     * 执行sql语句
     * @param sql
     * @param args
     * @return
     */
    public int excuteBySql(String sql,Object... args){
        try {
            //先清除一下session
            closeSession();
            Session session = getSession();

            Transaction transaction = session.beginTransaction();
            Query query = session.createSQLQuery(sql);

            for (int i = 0; i < args.length; i++) {
                query.setParameter(i+"", args[i]);
            }
            int result =  query.executeUpdate();
            transaction.commit();
            session.clear();

            return result;
        } catch (RuntimeException re) {
            throw re;
        }
    }


    /**
     * 根据列表指定列数据（需要加上select）
     * @param hql
     * @param args
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<Object> findObjectListByHql(String hql,Object... args){
        Session session = getSession();
        try {
            Query query = session.createQuery(hql);

            for (int i = 0; i < args.length; i++) {
                query.setParameter(i+"", args[i]);
            }
            List<Object> t = query.list();
            return t;
        } catch (RuntimeException re) {
            throw re;
        }
    }

    /**
     * 根据列表指定列数据（需要加上select）
     * @param hql
     * @param pageInfo
     * @param args
     * @return
     */
    @SuppressWarnings("unchecked")
    public List<Object> findObjectListByHql(String hql,PageInfo pageInfo,Object... args) {
        try {
            Session session = getSession();
            Query query = session.createQuery(hql);
            if(pageInfo != null){
                query.setFirstResult(pageInfo.getStart());
                query.setMaxResults(pageInfo.getEnd());
            }

            for (int i = 0; i < args.length; i++) {
                query.setParameter(i+"", args[i]);
            }

            List<Object> t =  query.list();
            return t;
        } catch (RuntimeException re) {
            throw re;
        }
    }

    /**
     * 获取索引下标
     * <p>
     *    说明：指从返回的只有一个结果的数值中取得
     * </p>
     * <p style="color:#ff0000;">
     *    注意此方法的调用 参数list格式注意
     * </p>
     * @param list
     * @return
     */
    protected int getIndexFromIndexList(List<Object> list){
        if(list != null && list.size() > 0){
            Object o = list.get(0);
            if(o != null){
                if(o instanceof Double){
                    return ((Double) o).intValue();
                }else if(o instanceof Integer){
                    return ((Integer) o).intValue();
                }else if (o instanceof  BigDecimal){
                    return ((BigDecimal) o).intValue();
                }else{
                    return list.size();
                }
            }
        }

        return -1;
    }

    /**
     * 取得当前被使用的数据库状态标记码
     *
     * @return
     */
    protected int getCurrentUsedDbCode(){
        if(isHasValited){
            return currentUsedDbCode;
        }

        String dialect = ((SessionImpl) getSession()).getFactory()
                .getDialect().getClass().getName();
        if(dialect != null){
            dialect = dialect.trim();
            if(dialect.equalsIgnoreCase(HIBERNATE_MYSQL_DIALECT)){
                //标记为mysql
                currentUsedDbCode = DB_CODE_MYSQL;
            }else if (dialect.equalsIgnoreCase(HIBERNATE_SQLITE_DIALECT)){
                //标记为sqlite
                currentUsedDbCode = DB_CODE_SQLITE;
            }else {
                //标记为默认的oracle
                currentUsedDbCode = DB_CODE_ORACLE;
            }
        }else{
            //标记为默认的oracle
            currentUsedDbCode = DB_CODE_ORACLE;
        }

        //标记已经校验了
        isHasValited = true;

        return currentUsedDbCode;
    }
}