package com.supermap.servlet;

import com.supermap.http.Parameters;
import com.supermap.service.DeleteFileServer;
import com.supermap.service.Service;
import com.supermap.system.AuthManager;
import net.sf.json.JSONObject;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Linhao on 2015/10/27.
 */
public class AuthServlet extends AbstractSuperMapServlet {

    @Override
    public void init(ServletConfig config) throws ServletException {
        AuthManager authManager = AuthManager.getInstance(config.getServletContext());
        if(authManager.authValidate()){
            super.init(config);
        }
    }

    /**
     * http的get请求入口
     *
     * @throws IOException
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        return;
    }

    /**
     * http的post请求入口
     *
     * @throws IOException
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        return;
    }

    @Deprecated
    @Override
    protected JSONObject action(HttpServletRequest request,
                                HttpServletResponse response, Parameters parameters, String action) {
        return null;
    }
}
