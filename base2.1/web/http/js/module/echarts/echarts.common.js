/**
 * echart的公共借口
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(seaRequire, exports, module) {

    /**
     * Echart 包装器
     *
     * @constructor
     */
    var myECharts = (function(){

        /**
         * 获取图表对象
         * @param container
         *          容器
         * @returns {*}
         */
        var getChart = function(container){
            if(!container || container == ""){
                console.log("消息提示：没有指定容器ID!");
                return null;
            }
            var dom = document.getElementById(container);
            if(!dom){
                console.log("消息提示：无法找到指定容器【"+container+"】ID!");
                return null;
            }
            return echarts.init(dom);
        };

        return {
            getChart:getChart
        };
    })();

    /**
     * 工具类
     */
    var Util = (function(){

        /**
         * 设置容器的宽度和高度
         * @param $container
         * @param width
         * @param height
         */
        var setContainerWidAndHei = function($container,width,height){
            $container && $container.css({
                width:width,
                height:height
            });
        };

        return {
            setContainerWidAndHei:setContainerWidAndHei
        };
    })();

    /**
     * ajax请求
     */
    var Ajax = (function(){

        var getJsonData = function(url,callback){
            if(!url || url == ""){
                console.log("消息提示：未指定json数据位置！");
                callback && callback(null);
                return;
            }

            $.getJSON(url, function(data){
                if(data.UTF8Encoding === true){
                    // 压缩后的地图数据必须使用 decode 函数转换
                    callback(echarts.util.mapData.params.decode(data));
                }else{
                    callback && callback(data);
                }
            });
        };

        return {
            getJsonData:getJsonData
        };
    })();


    return {
        myECharts:myECharts,
        Util:Util,
        Ajax:Ajax
    };
});