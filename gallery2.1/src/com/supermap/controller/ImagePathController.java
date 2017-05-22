package com.supermap.controller;

import com.supermap.system.SystemUtil;
import sun.misc.BASE64Decoder;

import javax.servlet.http.HttpServletRequest;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Calendar;
import java.io.File;


/**
 * Created by ${lmy} on 2016/5/24.
 */
public class ImagePathController extends BaseController{
    public static String chartImagePath(String chartImage,HttpServletRequest request){
        String chartImagePath=null;
        String current = getCurrentYYYYMMddHHmmSS();
        String newPngName = current+".png";
        String excelPath =  getTomcatRootLocalPath(request)+ UPLOAD_PICTURE_FILE_DIR;
        String chartImageLast=chartImage.substring(chartImage.indexOf(",")+1);
        File file =new File(excelPath);
        //如果文件夹不存在则创建
        if  (!file .exists()  && !file .isDirectory()) {
            file.mkdir();
        }
        chartImagePath=excelPath+"\\"+newPngName;
        GenerateImage(chartImageLast,chartImagePath);
        String url = "../../uploads/picture/"+newPngName;
        return url;
        
    }
    /**
     * 取得当前时间的年月日时分秒_毫秒
     *
     * @return
     */
    public static String getCurrentYYYYMMddHHmmSS(){
        String re = null;

        Calendar calen = Calendar.getInstance();
        // 得到年
        int year = calen.get(Calendar.YEAR);
        // 得到月
        int month = calen.get(Calendar.MONTH)+1;
        // 得到日
        int date = calen.get(Calendar.DATE);
        // 得到小时
        int hour = calen.get(Calendar.HOUR);
        // 得到分钟
        int minute = calen.get(Calendar.MINUTE);
        // 得到秒
        int second = calen.get(Calendar.SECOND);
        //毫秒
        int millisecond = calen.get(Calendar.MILLISECOND);


        StringBuilder sb = new StringBuilder();
        sb.append(year);
        sb.append(month < 10 ? ("0"+month) : (""+month));
        sb.append(date < 10 ? ("0"+date) : (""+date));
        sb.append(hour < 10 ? ("0"+hour) : (""+hour));
        sb.append(minute < 10 ? ("0"+minute) : (""+minute));
        sb.append(second < 10 ? ("0"+second) : (""+second));

        sb.append("_");
        sb.append(""+millisecond);

        re = sb.toString();

        return re;
    }

    /**
     *     将64位image编码转换成.png格式的图片
     * @param imgStr
     * @param imgFilePath
     * @return
     */
    public static boolean GenerateImage(String imgStr, String imgFilePath) {
        // 对字节数组字符串进行Base64解码并生成图片
        if (imgStr == null) // 图像数据为空
            return false;
        BASE64Decoder decoder = new BASE64Decoder();
        try {
        // Base64解码
            byte[] bytes = decoder.decodeBuffer(imgStr);
            for (int i = 0; i < bytes.length; ++i) {
                if (bytes[i] < 0) {// 调整异常数据
                    bytes[i] += 256;
                }
            }
// 生成jpeg图片
            OutputStream out = new FileOutputStream(imgFilePath);
            out.write(bytes);
            out.flush();
            out.close();
            System.out.print("成功");
            return true;

        } catch (Exception e) {
            return false;
        }
    }




}
