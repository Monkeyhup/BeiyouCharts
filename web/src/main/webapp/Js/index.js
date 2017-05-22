// var ecConfig = require('lib/config.js');
$(function () {
    region = "";
    myChart1 = echarts2.init(document.getElementById('MapShow'));
    $.getJSON('./json/map.json', function (data) {
        option1.series[0].data = data;
    }).done(function () {
        myChart1.setOption(option1);
    });

    var citySelect = $("#cityselect");
    citySelect.change(function () {
        var selected = $("#cityselect option:selected").attr('value');
        option1.series[0].mapType = selected;
        option1.title.text = selected + "地图";
        myChart1.setOption(option1, true);
    });
    myChart1.on(mapEventConfig.EVENT.HOVER, function (param) {
        myChart.dispatchAction({
            type: 'highlight',
            name: param.name
        });
        myChart.dispatchAction({
            type: 'showTip',
            name:param.name
        });
    });
    myChart1.on(mapEventConfig.EVENT.MOUSEOUT, function (param) {
        myChart.dispatchAction({
            type: 'downplay',
            name: param.name
        });
    });
});

$(window).resize(function () {
    myChart1.resize();
});