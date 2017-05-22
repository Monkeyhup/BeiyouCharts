/**
 * cookie 操作工具
 * Created by Linhao on 2015/12/31.
 */
define(function(require, exports, module) {

    /**
     * 取得cookie信息
     * @param Cookie
     *          对象
     * @param callback
     *          回调
     */
    var getCookieInfo = function(Cookie,callback){
        var cookie = Cookie.getCookies();
        var params = [];
        if(cookie && cookie.length > 0){
            for ( var i = 0, len = cookie.length; i < len; i++) {
                var item = cookie[i];
                params.push(JSON.parse(item));
            }
        }

        var $history = $("#history").html("");
        if(params.length > 0){
            var dbChartIds = [];
            for ( var j = 0, jLen = params.length; j < jLen; j++) {
                if(params[j].dataIsThirdCharts === "1"
                    || params[j].dataIsThirdCharts === 1){
                    //解码
                    var chartName = decodeURI(params[j].chartName);

                    //显示浏览过的第三方集成图
                    var name = decodeURI(params[j].chartName);
                    if(name && name.length > 21){
                        name = name.substr(0,17);
                        name += "...";
                    }

                    var li = "<li class='image-history'>"
                        +"<div class='circular heart icon link' data-variation='large' data-html='"+params[j].chartName+"' >"
                        + name
                        +"</div>"
                        + "<img data-id='"+ params[j].chartId
                        + "' class='history-thumbnail' alt='"+chartName+"' src='"
                        + SGIS.Util.getLocalPath()+"http/"+params[j].img
                        + "' data-value='"+ chartName + "' "
                        + " data-is-form-sgis='"+ params[j].chartIsfromSgis + "' "
                        + " data-is-third-charts='1' "
                        + " data-url='"+ params[j].url + "' "
                        +">"
                        +"</li>";

                    $history.append(li);
                }else{
                    //保存数据库中的图
                    dbChartIds.push(params[j].chartId);
                }
            }

            //判断是否浏览过数据库中的图
            if(dbChartIds.length > 0){
                SGIS.API.get("chart/list/chartids").data(JSON.stringify(dbChartIds))
                    .json(function(re){
                        if(re && re.code == 0){
                            var data = re.data;
                            if(data){
                                for ( var i = 0, len = data.length; i < len; i++) {
                                    var name = data[i].chartName;
                                    if(name && name.length > 21){
                                        name = name.substr(0,17);
                                        name += "...";
                                    }

                                    var li = "<li class='image-history'>"
                                        +"<div class='circular heart icon link' data-variation='large' "
                                        +" data-html='"+data[i].chartName+"' >"
                                        + name
                                        +"</div>"
                                        + "<img data-id='"+ data[i].id
                                        + "' class='history-thumbnail' alt='"+data[i].chartName+"' src='"
                                        + data[i].chartImagePath
                                        + "' data-value='"+ data[i].chartName + "' "
                                        + " data-is-form-sgis='"+ data[i].chartIsfromSgis + "' "
                                        +">"
                                        +"</li>";

                                    $history.append(li);
                                }
                            }
                        }else{
                            SGIS.Log("消息提示："+re.message);
                        }

                        callback && callback();
                    });
            }else{
                callback && callback();
            }//end if(dbChartIds.length > 0) else
        }//end if(params.length > 0)
    };

    /**
     * 绑定历史纪录的点击事件
     */
    var bindHistoryListEvent = function(){
        $("#history img").click(function(re) {
            var $this = $(this);
            var id = $this.attr("data-id");
            var dataIsThirdCharts = $this.attr("data-is-third-charts");
            if(dataIsThirdCharts === "1" || dataIsThirdCharts === 1){
                var url = $this.attr("data-url");
                window.location = SGIS.Util.getLocalPath()+"http/"+url+"?chart-id="+id;
            }else{
                var chartIsfromSgis = $this.attr("data-is-form-sgis");
                if(chartIsfromSgis === "1" || chartIsfromSgis === 1){
                    window.location = SGIS.Util.getLocalPath()+"http/sgis.html?chart-id="+id;
                }else{
                    window.location = SGIS.Util.getLocalPath()+"http/chart.html?chart-id="+id;
                }
            }
        });
    };

    return {
        getCookieInfo:getCookieInfo,
        bindHistoryListEvent:bindHistoryListEvent
    };
});