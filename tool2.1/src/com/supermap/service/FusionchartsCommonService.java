package com.supermap.service;

import com.supermap.common.Result;
import com.supermap.util.DataUtil;
import com.supermap.util.JsonFormatTool;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by LH on 2016/11/30.
 */
public class FusionchartsCommonService extends FusionchartsService{
    @Override
    public Result createJsonFileByExcel(File excelFile, File dir,
                                        String fileName) {

        Result result = new Result();

        List<List<Object>> re = parseExcel(excelFile, result);
        if (re == null) {
            return result;
        }

        // 取行
        JSONArray jsonArray = new JSONArray();
        JSONObject json = null;
        String[] keys = { "name", "value" };
        for (int i = 0, len = re.size(); i < len; i++) {
            json = new JSONObject();
            List<Object> rowList = re.get(i);
            int len2 = rowList.size();
            // 多指标时
            if (len2 > 2) {
                List<List<Object>> newRe = new ArrayList<List<Object>>();
                for (int k = 0; k < len; k++) {
                    List<Object> oldRowList = re.get(k);
                    List<Object> newRowList = new ArrayList<Object>();
                    for (int m = 0; m < len2; m++) {
                        Object o = oldRowList.get(m);
                        // 03
                        if (o instanceof Double) {
                            Number value = (Number) o;
                            newRowList.add(value);
                        } else {
                            // 07
                            String valueStr = (String) o;
                            boolean isNumber = DataUtil.isNumber(valueStr);
                            if (isNumber) {
                                double value = 0;
                                if (valueStr.equals("")) {
                                    value = 0;
                                } else {
                                    value = retainOne(Double
                                            .parseDouble(valueStr));
                                }
                                newRowList.add(value);
                            } else {
                                valueStr = DataUtil.stringAllReplace(valueStr,
                                        "（", "(");
                                valueStr = DataUtil.stringAllReplace(valueStr,
                                        "）", ")");
                                newRowList
                                        .add(valueStr != null ? valueStr : "");
                            }
                        }
                    }
                    newRe.add(newRowList);
                }
                json.put(keys[i], newRe);
                jsonArray.add(json);
                break; // 多指标时处理完毕，跳出循环.
                // 单指标时
            } else {
                for (int j = 0; j < len2; j++) {
                    Object object = rowList.get(j);
                    if (j > 0) {
                        // 03
                        if (object instanceof Double) {
                            Number value = (Number) object;
                            json.put(keys[j], value != null ? value : 0);
                        } else {
                            // 07
                            String valueStr = (String) object;
                            boolean isNumber = DataUtil.isNumber(valueStr);
                            if (isNumber) {
                                double value = retainOne(Double
                                        .parseDouble(valueStr));
                                json.put(keys[j], value);
                            } else {
                                valueStr = DataUtil.stringAllReplace(valueStr,
                                        "（", "(");
                                valueStr = DataUtil.stringAllReplace(valueStr,
                                        "）", ")");
                                json.put(keys[j], valueStr != null ? valueStr
                                        : "");
                            }
                        }
                    } else {
                        String valueStr = (String) object;
                        valueStr = DataUtil
                                .stringAllReplace(valueStr, "（", "(");
                        valueStr = DataUtil
                                .stringAllReplace(valueStr, "）", ")");
                        // 文字
                        json.put(keys[j], object != null ? object.toString()
                                : "");
                    }
                }
                jsonArray.add(json);
            }// end if (len2 > 2)
        }
        String content = JsonFormatTool.formatJson(jsonArray.toString());

        try {
            writeFile(new File(dir, fileName), content);
            result.setCode(Result.RESULT_EXECUTE_OK);
            result.setMessage("result.execute.ok");
        } catch (IOException e) {
            e.printStackTrace();
            result.setMessage("result.execute.fail.file.no.create");
        }

        return result;
    }


    @Override
    public JSONObject FusionchartsFormat(JSONArray jsonArray){
        int len=jsonArray.size();
        JSONObject json = new JSONObject();

        if(jsonArray == null){
            json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_FAIL);
            json.put(Result.JSON_RESULT_MESSAGE, "result.execute.fail");
            return json;
        }
            // 取行
            JSONArray reJsonArray = new JSONArray();
            JSONObject reJson = null;
            String[] keys = { "name", "value" };

            for (int i = 0; i < len; i++) {
                reJson = new JSONObject();

                List<Object> rowList = (List<Object>) jsonArray.get(i);
                int len2 = rowList.size();
                // 多指标时
                if (len2 > 2) {
                    List<List<Object>> newRe = new ArrayList<List<Object>>();
                    for (int k = 0; k < len; k++) {
                        List<Object> oldRowList = (List<Object>) jsonArray.get(k);
                        List<Object> newRowList = new ArrayList<Object>();
                        for (int m = 0; m < len2; m++) {
                            Object o = oldRowList.get(m);
                            // 03
                            if (o instanceof Double) {
                                Number value = (Number) o;
                                newRowList.add(value);
                            } else {
                                // 07
                                String valueStr = o.toString();
                                boolean isNumber = DataUtil.isNumber(valueStr);
                                if (isNumber) {
                                    double value = 0;
                                    if (valueStr.equals("")) {
                                        value = 0;
                                    } else {
                                        value = retainOne(Double.parseDouble(valueStr));
                                    }
                                    newRowList.add(value);
                                } else {
                                    valueStr = DataUtil.stringAllReplace(valueStr,
                                            "（", "(");
                                    valueStr = DataUtil.stringAllReplace(valueStr,
                                            "）", ")");
                                    newRowList
                                            .add(valueStr != null ? valueStr : "");
                                }
                            }
                        }
                        newRe.add(newRowList);
                    }
                    reJson.put(keys[i], newRe);
                    reJsonArray.add(reJson);
                    break; // 多指标时处理完毕，跳出循环.
                    // 单指标时
                } else {
                    for (int j = 0; j < len2; j++) {
                        Object object = rowList.get(j);
                        if (j > 0) {
                            // 03
                            if (object instanceof Double) {
                                Number value = (Number) object;
                                reJson.put(keys[j], value != null ? value : 0);
                            } else {
                                // 07
                                String valueStr = object.toString();
                                boolean isNumber = DataUtil.isNumber(valueStr);
                                if (isNumber) {
                                    double value = retainOne(Double.parseDouble(valueStr));
                                    reJson.put(keys[j], value);
                                } else {
                                    valueStr = DataUtil.stringAllReplace(valueStr,
                                            "（", "(");
                                    valueStr = DataUtil.stringAllReplace(valueStr,
                                            "）", ")");
                                    reJson.put(keys[j], valueStr != null ? valueStr
                                            : "");
                                }
                            }
                        } else {
                            String valueStr = object.toString();
                            valueStr = DataUtil
                                    .stringAllReplace(valueStr, "（", "(");
                            valueStr = DataUtil
                                    .stringAllReplace(valueStr, "）", ")");
                            // 文字
                            reJson.put(keys[j], object != null ? object.toString()
                                    : "");
                        }
                    }
                    reJsonArray.add(reJson);
                }// end if (len2 > 2)
            }
            json.put(Result.JSON_RESULT_CODE, Result.RESULT_EXECUTE_OK);
            json.put(Result.JSON_RESULT_MESSAGE, "result.execute.ok");
            json.put("data", reJsonArray.toString());


        return json;
    }
}
