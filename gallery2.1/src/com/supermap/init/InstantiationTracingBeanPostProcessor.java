package com.supermap.init;

import com.supermap.system.AuthManager;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

/**
 * Spring MVC 扫描完后指定方法
 *
 * Created by Linhao on 2016/1/27.
 */
@Component("InstantiationTracingBeanPostProcessor")
public class InstantiationTracingBeanPostProcessor implements ApplicationListener<ContextRefreshedEvent> {

    /**
     * 需要执行的逻辑代码，当spring容器初始化完成后就会执行该方法。
     * <p>
     *    说明：此方法将被执行两次（1）：执行if；(2)：执行else
     * </p>
     * @param event
     */
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        //step1:Initializing Spring root WebApplicationContext
        if(event.getApplicationContext().getParent() == null){
            //授权认证
//            AuthManager authManager = AuthManager.getInstance(null);
//            authManager.authValidate();
        }else{
            //step2:Initializing Spring FrameworkServlet 'spring-mvc'
        }
    }
}
