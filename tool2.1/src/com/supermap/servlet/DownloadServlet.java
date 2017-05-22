package com.supermap.servlet;


import com.supermap.common.Result;
import com.supermap.http.Parameters;
import com.supermap.service.Service;
import com.supermap.util.DataUtil;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

/**
 * 下载文件servlet
 *
 * @author Linhao
 *
 */
public class DownloadServlet extends AbstractSuperMapServlet {

    /**
	 * 
	 */
	private static final long serialVersionUID = 5949860548628646390L;
	
	
	private String msg;


    /**
     * 重写doPost方法
     */
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        this.request = request;	//保存当前的request

        Parameters parameters = new Parameters(request);

        String fileName = parameters.getParameter("fileName");

        if(fileName == null || fileName.isEmpty()){
            msg = getLocaleString("result.execute.fail.param.null");
            super.doPost(request,response);
            return;
        }

        File file = new File(getTomcatRootLocalPath()+Service.CREATE_JSON_FILE_DIR,fileName);
        if(!file.exists() || !file.isFile()){
            msg = getLocaleString("result.execute.fail.file.no.exist");
            super.doPost(request,response);
            return;
        }

        String name = fileName.substring(0,fileName.lastIndexOf("."));
        String suffix = DataUtil.getFileNameSuffix(fileName);

        // 以流的形式下载文件。
        InputStream fis = new BufferedInputStream(new FileInputStream(file));
        byte[] buffer = new byte[fis.available()];
        fis.read(buffer);
        fis.close();

        response.reset();
        //注意，如果去掉下面一行代码中的attachment; 那么也会使IE自动打开文件。
        response.setHeader("Content-Disposition", "attachment;filename="
                +new String(name.getBytes("utf-8"),"ISO-8859-1")+"."+suffix);
        response.setContentType("application/octet-stream");
        OutputStream out  =response.getOutputStream() ;
        out.write(buffer);
        out.flush();
        out.close();
    }


    @Override
    protected JSONObject action(HttpServletRequest request,
                                HttpServletResponse response, Parameters parameters, String action) {
        if(msg != null){
            JSONObject json = new JSONObject();
            json.put(Result.JSON_RESULT_CODE,Result.RESULT_EXECUTE_FAIL);
            json.put(Result.JSON_RESULT_MESSAGE,msg);
            return json;
        }
        return null;
    }

}
