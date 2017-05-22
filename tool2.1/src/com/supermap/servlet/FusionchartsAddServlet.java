package com.supermap.servlet;

import com.supermap.http.Parameters;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * fusioncharts，放置jsp文件直接暴露
 *
 * <p style="color:#ff0000;">
 *     注意：转发时应该用include而不用forward，
 *     应为有的tomcat使用forward服务解析jsp
 * </>
 *
 *
 * Created by LH on 2016/11/30.
 */
public class FusionchartsAddServlet extends AbstractSuperMapServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        request.getRequestDispatcher("../http/chart.fusioncharts.jsp").include(request, response);
    }


    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        request.getRequestDispatcher("../http/chart.fusioncharts.jsp").include(request, response);
    }

    @Deprecated
    @Override
    protected JSONObject action(HttpServletRequest request, HttpServletResponse response,
                                Parameters parameters, String action) {
        return null;
    }
}
