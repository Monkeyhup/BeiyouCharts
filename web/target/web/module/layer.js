/**
 * Created by jinn on 2015/10/21.
 */
define(function (require, exprots, module) {
    //var convertTool = require("component/convertTool");
    //var Tools = require("component/tools");
    var events = require("component/app.events");
    var spatial = require("spatial.query.js");
    var container = "map-container";          //整个画布？
    var map, layer,boundaryLayer,boundarySel,labelLayer,hlblayer;//边界图层、标签图层、高亮边界图层


    var shenRegion;
    var currRegion;
    var mapLevel;
    var rtnBtn = $('#rtn-map');

    myDataConfig = new dataConfig();
    ruturnMap = function (regionCode, regionName, regionLevel) {
        this.regionCode = regionCode;
        this.regionName = regionName;
        this.regionLevel = regionLevel
    };


    var selCallbacks = {
        dblclick: function (_fea) {
            myDataConfig.flag = false;
            //console.log(_fea);
            //双击下钻
            var data = _fea.data;
            var regionCode = data.QH_CODE;
            var regionName = data.QH_NAME;
            //返回一个行政区划对象
            var _region = new SGIS.Region(regionCode,regionName);
            console.log(_region);
            if(_region.getLevel()<4)
                //真正执行下钻
                events.trigger("region.dbclick",_region);

            if (_region.getLevel() == 2){
                currRegion = _region;
                shenRegion = _region;
            } else{
                currRegion = _region;
            }

            rtnBtn.removeClass('hidden');
            $('#chartTable').addClass('hidden');

        }
        ,click: function (_fea) {    //???
            //TODO 单击选中区域
            //var data = _fea.data;
            //var regionCode = data.QH_CODE;
            //var regionName = data.QH_NAME;
            //
            //var _region = new SGIS.Region(regionCode,regionName);
            //events.trigger("region.click",_region);
        }
    };

    //返回上级按钮事件 （返回上级的）点击事件 ==> action（双击下钻回全国）
    rtnBtn.click(function () {
        var regionset = require("regionset");
        var Idens = require("idens");
        var regions = regionset.getRegions();
        Idens.clearAllThematic();
        $('#chartTable').addClass('hidden');
        if (currRegion.getLevel() == 2){
            //跳回全国 ==> 双击下钻到全国 人为构造
            events.trigger("region.dbclick",new SGIS.Region('##0000000000',shenRegion.getName()));
            rtnBtn.addClass('hidden');
            var queryParm = {
                "catalog": "1",
                "indicatorCodes": [],
                "matmids": [myDataConfig.getMatId()],
                "parid": "",
                "regionLevel": "2",
                "regions":[new SGIS.Region('##0000000000',"全国","2")],
                "reportType": "1",
                "sort": null,
                "timeRank": null
            };

            $.ajax({
                method: "POST",
                url: "http://localhost:8080/data/macro/Data/Query/hasRanks",
                data: JSON.stringify(queryParm),
                contentType: 'application/json',
                success: function (re) {
                    queryParm.timeRank = re;
                    $.ajax({
                        method: "POST",
                        url: "http://localhost:8080/data/macro/data/queryext",
                        data: JSON.stringify(queryParm),
                        contentType: 'application/json',
                        success: function (re) {
                            console.log(re);
                            allData = re;
                            console.log(allData);
                            Idens.drawThematic(re);
                            myDataConfig.setData(re);
                            console.log(re);
                        }
                    });
                }
            });
        } else{
            myDataConfig.flag = true;
            events.trigger("region.dbclick",shenRegion);
            ruturnMap=shenRegion;
            console.log(shenRegion,"1");
            console.log(ruturnMap,"2");
            ruturnMap["regionLevel"]=shenRegion["regionLevel"]+1;
            ruturnMap["regionCode"]=shenRegion["regionCode"].substr(0,2)+"##00000000";
            console.log(ruturnMap,"2");
            var queryParm = {
                "catalog": "1",
                "indicatorCodes": [],
                "matmids": [myDataConfig.getMatId()],
                "parid": "",
                "regionLevel": ruturnMap.getLevel(),
                "regions":[ruturnMap],
                "reportType": "1",
                "sort": null,
                "timeRank": null
            };

            console.log(queryParm)
            $.ajax({
                method: "POST",
                url: "http://localhost:8080/data/macro/Data/Query/hasRanks",
                data: JSON.stringify(queryParm),
                contentType: 'application/json',
                success: function (re) {
                    queryParm.timeRank = re;
                    $.ajax({
                        method: "POST",
                        url: "http://localhost:8080/data/macro/data/queryext",
                        data: JSON.stringify(queryParm),
                        contentType: 'application/json',
                        success: function (re) {
                            console.log(re);
                            allData = re;
                            console.log(allData);
                            Idens.drawThematic(re);
                            myDataConfig.setData(re);
                            console.log(re+"666");
                        }
                    });
                }
            });
        }
    });

    var initMap = function (config,callback) {
        var mapfile = config.mapfile;        //无省级划分的中国地图
        var mapbounds = config.mapbounds;    //mapbounds:[5000000,0, 17000000, 11000000]
        mapfile = 'assets/map/' + mapfile;   //url

        map = new SuperMap.Map(container, {
                allOverlays: true    //图层相互叠加，最先绘制的图层可以被视为是底图
            , controls: [new SuperMap.Control.DragPan(),//可以拖拽?
                //new SuperMap.Control.MousePosition(),
                new SuperMap.Control.Navigation({
                    dragPanOptions: {
                        enableKinetic:true      //拖拽时有动画(改变没作用？)
                    }
                })
            ],
            maxResolution:11718.75       //数字的含义??最大比例下的每像素屏幕地图单位值
            //restrictedExtent:new SuperMap.Bounds(5000000,0, 17000000, 11000000)
            //,maxExtent: new SuperMap.Bounds(50,0, 160, 60)
            ,projection: "EPSG:900913"   //投影为 900913,google 墨卡托投影 units: "m", 屏幕坐标以米为单位
            //displayProjection: "EPSG:900913"
        });

        var scales = [1.0318602803469382e-13,2.0318602803469382e-13,3.0637205606938765e-13,4.0637205606938765e-13,8.127441121387753e-13,1.6254882242775506e-12,3.250976448555101e-12,6.501952897110202e-12,1.3003905794220405e-11,2.600781158844081e-11,5.201562317688162e-11,2.0806249270752648e-10,4.1612498541505295e-10];
        var options = {numZoomLevels:15,useCanvas:false,isBaseLayer:true}; //,scales:scales
        var bounds= new SuperMap.Bounds(mapbounds[0],mapbounds[1], mapbounds[2], mapbounds[3]);
        layer=new SuperMap.Layer.Image(
            'map',
            mapfile,
            bounds,
            options
        );

        boundaryLayer = new SuperMap.Layer.Vector("bline", {renderers: ["Canvas2"]}); //边界图层  //如何绑定省份信息？
        boundaryLayer.showcolor = false; //显示图层颜色(自定义变量)
        labelLayer = new SuperMap.Layer.Markers("lbregion",{});                //行政区划标签

        //浏览器判断
        if(SGIS.agent=="pc"){
            hlblayer = new SuperMap.Layer.Vector("hl", {renderers: ["Canvas2"]}); //边界高亮图层
            //向地图中添加多个图层,layer:地图背景图片,添加各种图层,然后这些图层分别在main.js,spatial.query.js中处理
            map.addLayers([layer,boundaryLayer,labelLayer,hlblayer]);
        }else{
            map.addLayers([layer,boundaryLayer,labelLayer]);
        }

        //map.zoomToMaxExtent();

        //设置选择要素控件(边界图层)
        boundarySel = new SuperMap.Control.SelectFeature(boundaryLayer, {
            callbacks:selCallbacks,
            hover: false,
            repeat: false
        });
        boundarySel.selectStyle = {};
        map.addControl(boundarySel);
        boundarySel.activate();

        //map.setCenter(new SuperMap.LonLat(116, 32), 1);

        map.events.on({
            "zoomend": function (o) {
                //var r = map.getResolution();
                //var sc = map.getScale();
                //console.log("分辨率：" + r);
                //console.log("比例尺：" + sc);
                var size = map.getZoom()*1+10;
                $(".reglab").css({"font-size":size+"px"});
                var $tooltip = $("#thematic-tooltip");
                //缩放结束,如果此时标签存在,则去除
                if ($tooltip.length > 0) {
                    $tooltip.remove();
                }

                var ecTip = $(".echarts-tooltip.zr-element");
                if(ecTip.length>0){
                    ecTip.remove();
                }
            },
            //应该是鼠标移开
            "moveend": function () {
                var $tooltip = $("#thematic-tooltip");
                if ($tooltip.length > 0) {
                    $tooltip.remove();
                }

                var ecTip = $(".echarts-tooltip.zr-element");
                if(ecTip.length>0){
                    ecTip.remove();
                }
            }
        });

        //判断callback是否定义,如果定义则直接运行.
        callback&&callback();
    };

    (function () {
        //initMap();
        //getConfig();
    })();

    return {
        init:initMap,
        getMap: function () {
            return map;
        },
        getSelCallbacks: function () {
            return selCallbacks;
        }
    }
});
