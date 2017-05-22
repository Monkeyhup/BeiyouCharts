package com.supermap.system;

/**
 * 通过反射机制 获取类加载器
 *
 * @author linhao-2014-05-22
 *
 */
public class SGISClassLoader {

    private static final boolean isDebug = true;

    /**
     * 通过类（完整类名）获取指定的对象
     *
     * @param className
     * 			指定类名（完整类名）
     * @return	成功返回对象，否则返回null
     */
    public Object getObject(String className){

        Class<?> c = getClass(className);
        if(c != null)
            return getObject(c);
        return null;
    }

    /**
     * 通过类获取指定的对象
     *
     * @param c
     * 			指定类对象
     * @return	成功返回对象，否则返回null
     */
    public Object getObject(Class<?> c){
        Object object = null;

        if(c != null){
            try {
                object = c.newInstance();
            } catch (InstantiationException e) {
                print("\n");
                print("SGISClassLoader ERROR:");
                println(e.getMessage());
                print("\n");
            } catch (IllegalAccessException e) {
                print("\n");
                print("SGISClassLoader ERROR:");
                println(e.getMessage());
                print("\n");
            }
        }
        return object;
    }

    /**
     * 通过指定类名（完整类名）获取类实例
     *
     * @param className
     * 			指定类名
     * @return 成功返回其类对象，否则null
     */
    public Class<?> getClass(String className){
        if(className == null){
            print("\n");
            println("SGISClassLoader ERROR: className is null!");
            print("\n");
            return null;
        }

        Class<?> c = null;
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        if(cl != null){
            try {
                c = cl.loadClass(className);
            } catch (ClassNotFoundException e) {
                print("\n");
                print("SGISClassLoader ERROR:[");
                print(className);
                println("] is no found !");
                print("\n");
            }catch (NoClassDefFoundError e) {
                print("\n");
                print("SGISClassLoader ERROR:[");
                print(className);
                println("] class not found!");
                print("\n");
            }
        }//end if(cl != null)

        if(c == null){
            print("\n");
            print("SGISClassLoader ERROR:Can find class-[");
            print(className);
            println("] by ClassLoader !\n");

            try {
                c = Class.forName(className);
            } catch (ClassNotFoundException e) {
                print("\n");
                print("SGISClassLoader ERROR:[");
                print(className);
                println("] is no found !");
                print("\n");
            }
            if(c == null){
                print("\n");
                print("SGISClassLoader ERROR:Can find class-[");
                print(className);
                println("] by Class.forName(name) !\n");
            }else{
                print("\n");
                print("SGISClassLoader MSG:load class-[");
                print(className);
                println("] ok by Class.forName(name) !\n");
            }
        }else{
            print("\n");
            print("SGISClassLoader MSG:load class-[");
            print(className);
            println("] ok by ClassLoader !\n");
        }

        return c;
    }

    private void print(String msg){
        if(isDebug)
            System.out.print(msg);
    }

    private void println(String msg){
        if(isDebug)
            System.out.println(msg);
    }
}
