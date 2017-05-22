package com.supermap.service;

import com.supermap.system.SGISClassLoader;
import com.supermap.util.PropertiesConfigUtil;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * d3 服务工厂
 * 
 * @author Linhao
 *
 */
public class D3ServiceFactory{
    /****/
    private static Map<String,D3Service> map = new HashMap<String, D3Service>();
	
	/**
	 * 获取d3服务实例
	 * 
	 * @param type
	 * 			d3 类型
	 */
	public static D3Service getServiceInstance(String type) {
		if(type == null)
			return null;

        D3Service service = map.get(type);
        if(service != null)
            return service;

        //服务对应的key
        String serverKey = type+PropertiesConfigUtil.DEFAULT_SUFFIX_SERVICE;
        //取得服务名称
        String serverValue = PropertiesConfigUtil.getValue(serverKey);
        if(serverValue != null && !"".equals(serverValue)){
            //创建类加载器
            SGISClassLoader sgisClassLoader = new SGISClassLoader();
            String className = Service.SERVICE_PACKAGE_NAME+"."+serverValue;
            Object object = sgisClassLoader.getObject(className);
            if(object != null && object instanceof D3Service){
                service = (D3Service)object;
                //保存当前服务
                map.put(type,service);
                return service;
            }else{
                System.out.println("\n");
                System.out.println("****************************************************");
                System.out.println("系统错误：【可视化制图工具】无法初始化服务【"+serverValue+"】！");
                System.out.println("****************************************************");
                System.out.println("\n");
            }
        }else{
            System.out.println("\n");
            System.out.println("****************************************************");
            System.out.println("系统错误：【可视化制图工具】配置文件chart.name.config.properties中");
            System.out.println("\t无法找到【"+serverKey+"】对应的配置！");
            System.out.println("****************************************************");
            System.out.println("\n");
        }
		
		return service;
	}
}
