package com.supermap.service;

import com.supermap.system.SGISClassLoader;
import com.supermap.util.PropertiesConfigUtil;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by LH on 2016/11/30.
 * fusioncharts 服务工厂
 */
public class FusionchartsServiceFactory {
    /****/
    private static Map<String,FusionchartsService> map = new HashMap<String, FusionchartsService>();

    /**
     * 获取fusioncharts服务实例
     *
     * @param type
     * 			fusioncharts 类型
     */
    public static FusionchartsService getServiceInstance(String type) {
        if(type == null)
            return null;

        FusionchartsService service = map.get(type);
        if(service != null)
            return service;

        //服务对应的key
        String serverKey = type+ PropertiesConfigUtil.DEFAULT_SUFFIX_SERVICE;
        //取得服务名称
        String serverValue = PropertiesConfigUtil.getValue(serverKey);
        if(serverValue != null && !"".equals(serverValue)){
            //创建类加载器
            SGISClassLoader sgisClassLoader = new SGISClassLoader();
            String className = Service.SERVICE_PACKAGE_NAME+"."+serverValue;
            Object object = sgisClassLoader.getObject(className);
            if(object != null && object instanceof FusionchartsService){
                service = (FusionchartsService)object;
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
