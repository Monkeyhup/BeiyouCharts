var echartsInit = {

    //初始化
    init: function () {
        var seriesData1 = [];
        var seriesData2 = [];
        var seriesName = [];
        var legendData = [];
        var unit ="";
        var regex = /\([^\)]+\)/g;
        var excelData = [];
        //取得数据
        $.getJSON("data/ceshi-1.json",function(data){
            seriesData1.push(data.traPortPercent,data.linkPortPercent);
            seriesData2.push(data.freePercent,data.throughPercent,data.upPercent,data.downPercent);
            //console.log(seriesData1);
            //console.log(seriesData2);
            var re = {
                seriesData1:seriesData1,
                seriesData2:seriesData2
            };
            //alert(data.traPortPercent);
            //for (var i = 0; i < data.length; i++) {
            //    console.log("Sample log");
            //    if (!isNaN(data[i].value)) {
            //        seriesName.push(data[i][0]);
            //        seriesData.push(data[i][1]);
            //    }
            //    //第一行为表头
            //    if(i == 0){
            //        //数据指标名称
            //        legendData = data[i].value || "";
            //
            //        var v = regex.exec(legendData);
            //        if(v && v[0]){
            //            unit = v[0];
            //            legendData = legendData.split(v)[0] || "";
            //        }
            //    }
            //    //excel表格需要的数据
            //    excelData.push({
            //        0:data[i].name,
            //        1:data[i].value
            //    });
            //}
            //var re = {
            //    seriesName:seriesName,
            //    seriesData:seriesData,
            //    unit:unit,
            //    excelData:excelData,
            //    legendData:legendData
            //};
            //画图
            echartsInit.drawEchart(re);
            //画表格
            echartsInit.drawExcel(re);
        });

    },

    //画图函数
    drawEchart: function(re) {
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            //tooltip: {},
            ////legend: {
            ////    data: ["traPortPercent","linkPortPercent"]
            ////},
            //xAxis: {
            //    data: ["traPortPercent","linkPortPercent"]
            //    //data:re.seriesName
            //},
            ////xAxis: {
            ////    data: re.seriesName
            ////},
            //yAxis: {},
            //series: [{
            //    name: '销量',
            //    type: 'bar',
            //    //data: [5, 20, 36, 10, 10, 20]
            //    data:re.seriesData1
            //}]
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                top:'center',
                data: ["traPortPercent","linkPortPercent"]
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['25%', '50%'],
                    data:re.seriesData1,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['75%', '50%'],
                    data:re.seriesData2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);

        //绑定事件
        $("button[type='button']").bind("click",function(){
            $(".list-group-item").removeClass("active");
            $(this).addClass("active");
            var myChart = echarts.init(document.getElementById('main'));
            var type = $(this).attr("id");

            var option1 = $.extend(true,{},option,
                {
                    series:[{
                        type: type
                    }]
                }
            );

            myChart.setOption(option1);
        });
        $("#changeCheckbox").bind("click",function(){
            if($(this).is(":checked")) {
                $("#content").removeClass("container").addClass("container-fluid");
                $("#content2,#example").removeClass("col-md-12").addClass("col-md-6");
            }else{
                $("#content").removeClass("container-fluid").addClass("container");
                $("#content2,#example").removeClass("col-md-6").addClass("col-md-12");
            }
        })

    },

    //画excel表格函数
    drawExcel: function(re) {
        var container = document.getElementById("example");
        var hot = new Handsontable(container, {
            data: re.excelData
        });
    }
};
echartsInit.init();