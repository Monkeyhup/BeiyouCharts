/**
 * 目前全国各省的地图换位指定的json文件
 * 为了兼容原来旧版的省级地图直接取的echarts自带的地图，
 * 故在此对旧的省级地图做了个对照表（省级名称-映射-对应的地图数据目录）
 * {
 *  "{省级名称}":"{对应的地图数据目录}"
 * }
 * Created by Linhao on 2016/1/26.
 */
define(function(require, exports, module) {

    /**
     *  "{省级名称}":"{对应的地图数据目录}"
     * @type {{}}
     */
    var ChinaAllProvinceConfig = {
        '北京':'js/module/map/sn/sn_11.json',      //北京
        '天津':'js/module/map/sn/sn_12.json',      //天津
        '河北':'js/module/map/sn/sn_13.json',      //河北
        '山西':'js/module/map/sn/sn_14.json',      //山西
        '内蒙古':'js/module/map/sn/sn_15.json',      //
        '辽宁':'js/module/map/sn/sn_21.json',      //
        '吉林':'js/module/map/sn/sn_22.json',      //
        '黑龙江':'js/module/map/sn/sn_23.json',      //
        '上海':'js/module/map/sn/sn_31.json',
        '江苏':'js/module/map/sn/sn_32.json',      //
        '浙江':'js/module/map/sn/sn_33.json',
        '安徽':'js/module/map/sn/sn_34.json',      //
        '福建':'js/module/map/sn/sn_35.json',
        '江西':'js/module/map/sn/sn_36.json',      //
        '山东':'js/module/map/sn/sn_37.json',
        '河南':'js/module/map/sn/sn_41.json',      //
        '湖北':'js/module/map/sn/sn_42.json',      //
        '湖南':'js/module/map/sn/sn_43.json',      //
        '广东':'js/module/map/sn/sn_44.json',      //
        '广西':'js/module/map/sn/sn_45.json',      //
        '海南':'js/module/map/sn/sn_46.json',      //
        '重庆':'js/module/map/sn/sn_50.json',      //
        '四川':'js/module/map/sn/sn_51.json',      //
        '贵州':'js/module/map/sn/sn_52.json',      //
        '云南':'js/module/map/sn/sn_53.json',      //
        '西藏':'js/module/map/sn/sn_54.json',      //
        '陕西':'js/module/map/sn/sn_61.json',      //
        '甘肃':'js/module/map/sn/sn_62.json',      //
        '青海':'js/module/map/sn/sn_63.json',      //
        '宁夏':'js/module/map/sn/sn_64.json',      //
        '新疆':'js/module/map/sn/sn_65.json',      //
        '台湾':'js/module/map/sn/sn_71.json',      //
        '香港':'js/module/map/sn/sn_81.json',      //
        '澳门':'js/module/map/sn/sn_82.json'      //
    };

    return ChinaAllProvinceConfig;
});
