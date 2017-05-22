package com.supermap.filter;

import com.supermap.system.AuthManager;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Created by Linhao on 2015/10/27.
 */
public class AuthFilter implements Filter{

    private FilterConfig filterConfig;

    @Override
    public void destroy() {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain filterChain) throws IOException, ServletException {
        ServletContext context = null;
        if(filterConfig != null){
            context = filterConfig.getServletContext();
        }
        AuthManager authManager = AuthManager.getInstance(context);
        if(authManager.authValidate()){
            filterChain.doFilter(request, response);
            return ;
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.filterConfig = filterConfig;
    }
}
