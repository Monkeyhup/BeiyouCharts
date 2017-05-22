package com.supermap.service;

import com.supermap.common.Result;
import com.supermap.util.DataUtil;
import com.supermap.util.JsonFormatTool;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lmy on 2015/12/4.
 */
public class D3BarHorizontalStackService extends D3Service {

    public static final String KEY_NAME = "name";

    public static final String KEY_SALES = "sales";

    public static final String KEY_YEAR = "year";

    public static final String KEY_PROFIT = "profit";


    @Override
    public Result createJsonFileByExcel(File excelFile, File dir, String fileName) {
        Result result = new Result();

        List<List<Object>> list = parseExcel(excelFile,result);
        if(list == null){
            result.setMessage("result.execute.fail.file.no.parse");
            return result;
        }

        JSONObject json = new JSONObject();
        List<JSONObject> datas = null;				    //存储数据
        Map<String,String> head = null;                 //存储头部


        //行遍历
        for(int r = 0,rLen = list.size(); r < rLen; r++){
            List<Object> row = (List<Object>) list.get(r);


            //列遍历
            for (int c = 0,cLen = row.size(); c < cLen; c++) {
                //第一行,取标题、单位
                if(r == 0){
                    if(c == 0){
                        String title = row.get(c).toString();
                        String unit = getUnitByTitle(title);

                        head = new HashMap<String,String>();
                        head.put("data_title", title);
                        head.put("data_unit", unit);
                    }else{
                        if(datas == null){
                            datas = new ArrayList<JSONObject>();
                        }

                        JSONObject data = new JSONObject();
                        //取得指标名
                        data.put(KEY_NAME,row.get(c).toString());
                        //初始化sales
                        data.put(KEY_SALES,new JSONArray());
                        datas.add(data);
                    }//end if(c == 0) else
                }else{
                    //按年份取数据
                    if(c == 0){
                        String year = row.get(c).toString();
                        //将年份放入所有指标中
                        for(JSONObject data : datas){
                            JSONObject sale = new JSONObject();
                            sale.put(KEY_YEAR,year);
                            ((JSONArray)data.get(KEY_SALES)).add(sale);
                        }
                    }else{
                        //取得当前年的profit
                        String profit = row.get(c).toString();

                        //放入值(c-1:代表当前的指标所在data1_data的下标；r-1：代表当前年份所在sales的下标)
                        JSONObject sale = ((JSONObject)((JSONArray)datas.get(c-1)
                                .get(KEY_SALES)).get(r-1));

                        if(DataUtil.isNumber(profit)){
                            //判断是否是小数
                            if(profit.indexOf(".") > -1){
                                sale.put(KEY_PROFIT, Double.valueOf(profit));
                            }else{
                                sale.put(KEY_PROFIT, Integer.valueOf(profit));
                            }
                        }
                    }//end if(c == 0) else
                }//else if(r == 0) else
            }//end for
        }//end for

        if (head != null) {
            json.put("data1_title", head.get("data_title"));
            json.put("data1_unit", head.get("data_unit"));
        }

        if(datas != null){
            json.put("data1_data", datas);
        }
        String content = json.toString();
        if(content.isEmpty()){
            result.setMessage("result.execute.fail.file.no.create");
            return result;
        }
        content = JsonFormatTool.formatJson(content);

        try {
            writeFile(new File(dir,fileName), content);

            result.setCode(Result.RESULT_EXECUTE_OK);
            result.setMessage("result.execute.ok");
        } catch (IOException e) {
            e.printStackTrace();
            result.setMessage("result.execute.fail.file.no.create");
        }

        return result;
    }

    @Override
    public JSONObject d3Format(JSONArray jsonArray) {
        JSONObject json = new JSONObject();

        List<JSONObject> datas = null;				    //存储数据
        Map<String,String> head = null;                 //存储头部


        //行遍历
        for(int r = 0,rLen = jsonArray.size(); r < rLen; r++){
            List<Object> row = (List<Object>) jsonArray.get(r);
            if(r == 0 && (row == null || row.size() < 1)){
                json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
                json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
                return json;
            }

            //列遍历
            for (int c = 0,cLen = row.size(); c < cLen; c++) {
                //第一行,取标题、单位
                if(r == 0){
                    if(c == 0){
                        String title = row.get(c).toString();
                        String unit = getUnitByTitle(title);

                        head = new HashMap<String,String>();
                        head.put("data_title", title);
                        head.put("data_unit", unit);
                    }else{
                        if(datas == null){
                            datas = new ArrayList<JSONObject>();
                        }

                        JSONObject data = new JSONObject();
                        //取得指标名
                        data.put(KEY_NAME,row.get(c).toString());
                        //初始化sales
                        data.put(KEY_SALES,new JSONArray());
                        datas.add(data);
                    }//end if(c == 0) else
                }else{
                    //按年份取数据
                    if(c == 0){
                        String year = row.get(c).toString();
                        //将年份放入所有指标中
                        for(JSONObject data : datas){
                            JSONObject sale = new JSONObject();
                            sale.put(KEY_YEAR,year);
                            ((JSONArray)data.get(KEY_SALES)).add(sale);
                        }
                    }else{
                        //取得当前年的profit
                        String profit = row.get(c).toString();

                        //放入值(c-1:代表当前的指标所在data1_data的下标；r-1：代表当前年份所在sales的下标)
                        JSONObject sale = ((JSONObject)((JSONArray)datas.get(c-1)
                                .get(KEY_SALES)).get(r-1));

                        if(DataUtil.isNumber(profit)){
                            //判断是否是小数
                            if(profit.indexOf(".") > -1){
                                sale.put(KEY_PROFIT, Double.valueOf(profit));
                            }else{
                                sale.put(KEY_PROFIT, Integer.valueOf(profit));
                            }
                        }else{
                            //有非法数字
                            json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
                            json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail.is.no.number");
                            return json;
                        }
                    }//end if(c == 0) else
                }//else if(r == 0) else
            }//end for
        }//end for

        if (head != null) {
            json.put("data1_title", head.get("data_title"));
            json.put("data1_unit", head.get("data_unit"));
        }else{
            json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
            json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail.no.head");
            return json;
        }

        if(datas != null){
            json.put("data1_data", datas);
        }else{
            json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
            json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail.no.data");
            return json;
        }

        String data = json.toString();
        json = new JSONObject();
        json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_OK);
        json.put(Result.JSON_RESULT_MESSAGE, "result.execute.ok");
        json.put("data", data);

        return json;
    }


}
