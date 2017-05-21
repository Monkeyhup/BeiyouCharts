//版本说明：bootstrap-3.3.5-dist
var echartsInit = {

    //初始化
    init: function () {
        var seriesData = [];
        var seriesName = [];
        var legendData = [];
        var unit ="";
        var regex = /\([^\)]+\)/g;
        var excelData = [];
        var myChart;
        var echartsType = [];

        //取得数据
        $.getJSON("data/EvaluationResult.json",function(data){
            for (var i = 0; i < data.length; i++) {
                //if(i=0){
                //    if (!isNaN(data[i].data)) {
                //        seriesName.push(data[i].name);
                //        seriesData.push(data[i].data);
                //        type.push(data[i].type);
                //    }
                //}else{
                //    if (!isNaN(data[i].data)) {
                //        seriesName.push(data[i].name);
                //        seriesData.push(data[i].data);
                //    }
                //}
                if (!isNaN(data[i].data)) {
                    seriesName.push(data[i].name);
                    seriesData.push(data[i].data);
                }
                //第一行为表头
                //if(i == 0){
                //    //数据指标名称
                //    legendData = data[i].data || "";
                //
                //    var v = regex.exec(legendData);
                //    if(v && v[0]){
                //        unit = v[0];
                //        legendData = legendData.split(v)[0] || "";
                //    }
                //}
                //excel表格需要的数据
                if(data[i].type){
                    echartsType.push(data[i].type);
                }
                excelData.push({
                    0:data[i].name,
                    1:data[i].data
                });
            }
            var re = {
                seriesName:seriesName,
                seriesData:seriesData,
                unit:unit,
                echartsType:echartsType,
                excelData:excelData,
                legendData:legendData
            };
            //画图
            myChart = echartsInit.drawEchart(re);
            //画表格
            var hot;
            hot = echartsInit.drawExcel(re);

            var currentIndex = 0;
            $('#example .ht_master tbody td').click(function(){
                //取消上一个选中的高亮状态
                myChart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: currentIndex
                });
                //取得当前的表格所在的行
                var tddd=this.parentNode;
                currentIndex = tddd.rowIndex -1;
                //$(".handsontableInputHolder").css("z-index","0");
                $(this).parent().css('background','yellow');
                //$(this).parent().addClass("yell");
                //alert(hot.getValue());
                //标记当前数据
                myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: currentIndex
                });
                myChart.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: currentIndex
                });
            });
        });

    },



    //画图函数
    drawEchart: function(re) {

        // 指定图表的配置项和数据
        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: "{b}: {c}"
            },
            legend: {
                data:['']
            },
            xAxis: {
                data:re.seriesName
            },
            yAxis: {
                name:'(%)'
            },
            series: [{
                name: re.seriesName,
                type: re.echartsType[0],
                label: {

                },
                labelLine: {
                    normal: {
                        show:false
                    }
                },
                "itemStyle": {
                    "normal": {
                        "barBorderRadius": [0,0,0,0],
                        "label": {
                            "show": true,
                            "position": "top",
                            "textStyle": {
                                "fontSize": 12,
                                "fontFamily": "微软雅黑",
                                /*"color": "#26C0C0",*/
                                "fontWeight": "bold"
                            }
                        }
                    },
                    emphasis: {
                        //color:'#ff00ff',
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.7)'
                    }
                },
                //data: [5, 20, 36, 10, 10, 20]
                data:re.seriesData
            }]
        };
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(option);

        //调整大小
        window.onresize = function() {
            myChart.resize();
        };


        //绑定事件
        $("button[type='button']").bind("click",function(){
            $(".list-group-item").removeClass("active");
            $(this).addClass("active");
            //var myChart = echarts.init(document.getElementById('main'));
            myChart.clear();
            var type = $(this).attr("id");
            var option1;
            var series1 = new Array();
            option.series = null;
            var appStop;
            var dataStyle = {
                normal: {
                    //label: {show:false},
                    labelLine: {show:false},
                    shadowBlur: 40,
                    shadowColor: 'rgba(40, 40, 40, 0)'
                }
            };
            var placeHolderStyle = {
                normal : {
                    //color: '#ebebeb',
                    color: 'rgba(0,0,0,0)',
                    label: {show:false},
                    borderColor:'#ebebeb',
                    borderWidth:1,
                    labelLine: {show:false}
                },
                emphasis : {
                    color: '#ebebeb'
                }
            };

            //饼图
            if(type == "pie"){
                clearShow();
                option1 = $.extend(true,{},option,
                    {
                        xAxis: {
                            show:false
                        },
                        yAxis: {
                            show:false
                        },
                        series:[{
                            type: 'pie',
                            radius : '65%',
                            label: {
                                normal:{
                                    show : true,
                                    position : 'outside',
                                    formatter : '{d} %'
                                }
                            },
                            labelLine: {
                                normal:{
                                    show:true
                                }
                            },
                            data : re.seriesData,
                            name : re.seriesName
                        }]
                    }
                );
                myChart.setOption(option1);
            }
            //圆环
            else if(type == "pie-1") {
                clearShow();
                for(var m= 0; m<re.seriesData.length;m++) {
                    series1.push({
                        "name":re.seriesName[m],
                        "type":"pie",
                        clockWise: false,
                        hoverAnimation: false,
                        radius : [200-20*(m+1),200-20*m],
                        itemStyle : dataStyle,
                        data:[
                            {
                                value:re.seriesData[m],
                                name:re.seriesName[m]
                            },
                            {
                                value:1-re.seriesData[m],
                                name:re.seriesName[m],
                                itemStyle : placeHolderStyle
                            }
                        ]
                    })
                }
                option1 = $.extend(true,{},option,
                    {
                        xAxis: {
                            show:false
                        },
                        yAxis: {
                            show:false
                        },
                        series: series1
                    }

                );

                myChart.setOption(option1);
            }
            //多圆环
            else if(type == "pie-2") {
                clearShow();
                var n = re.seriesData.length;
                var rim = parseInt((100-10)/n);
                var rim1 = parseInt((100-10)/(3*n));
                for(var m= 0; m<n;m++) {
                    series1.push({
                        "type":'pie',
                        "name":re.seriesName[m],
                        clockwise:false,
                        radius:[(rim-rim1)+'%',rim+'%'],
                        center:[(5*m+rim*(m*2+1)/2)+'%','50%'],
                        itemStyle : dataStyle,
                        label: {
                            normal: {
                                position: 'center',
                                formatter: re.seriesName[m]+'\n{d} %'
                            }
                        },
                        data:[
                            {
                                value:re.seriesData[m],
                                name:re.seriesName[m],
                                label:{
                                    normal:{
                                        show:true
                                    }
                                }
                            },
                            {
                                value:1-re.seriesData[m],
                                name:re.seriesName[m],
                                itemStyle : placeHolderStyle
                            }
                        ]
                    })
                }
                option1 = $.extend(true,{},option,
                    {
                        xAxis: {
                            show:false
                        },
                        yAxis: {
                            show:false
                        },
                        series : series1
                    }
                );

                myChart.setOption(option1);
            }else if(type == "gauge"){
                clearShow();
                option1 = $.extend(true,{},option,
                    {
                        tooltip : {
                            formatter: "{a} <br/>{b} : {c}%"
                        },
                        xAxis: {
                            show:false
                        },
                        yAxis: {
                            show:false
                        },
                        series: [
                            {
                                name: re.seriesName[0],
                                type: 'gauge',
                                detail: {formatter:'{value}%'},
                                data: [{value: re.seriesData[0], name: re.seriesName[0]}]
                            }
                        ]
                    }
                );
                //myChart.setOption(option1);
                //var int=self.setInterval("clock()",1000);
                appStop = setInterval(function () {
                    option1.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
                    myChart.setOption(option1);
                },1000);
                $("#gauge-1").bind('click',function(){
                    appStop = window.clearInterval(appStop);
                    myChart.clear();
                })
            }
            //其他形状
            else{
                clearShow();
                option1 = $.extend(true,{},option,
                    {
                        xAxis: {
                            show:true
                        },
                        //xAxis: {
                        //    data: re.seriesName
                        //},
                        yAxis: {
                            show:true
                        },
                        series:[{
                            type: type,
                            data : re.seriesData
                        }]
                    }
                );

                myChart.setOption(option1);
            }
            //myChart.setOption(option1);
            //清理定时事件
            function clearShow(){
                appStop=window.clearInterval(appStop)
            }
            //function clock(){
            //    option1.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
            //    myChart.setOption(option1, true);
            //}

        });
        //改变布局
        $("#changeCheckbox").bind("click",function(){
            if($(this).is(":checked")) {
                $("#content").removeClass("container").addClass("container-fluid");
                $("#content1,#content2").removeClass("col-md-12").addClass("col-md-6");
                $('#example').css("margin-top","0px");
                myChart.resize();
            }else{
                $("#content").removeClass("container-fluid").addClass("container");
                $("#content1,#content2").removeClass("col-md-6").addClass("col-md-12");
                $('#example').css("margin-top","30px");
                myChart.resize();
            }
        });


        return myChart;
    },

    //画excel表格函数
    drawExcel: function(re) {
        var container = document.getElementById("example");
        var hot = new Handsontable(container, {
            //数据
            data: re.excelData,
            //当值为true时，启用observeChanges插件
            observeChanges: true,
            //只读模式，不允许修改任何数据
            //readOnly:true,
            //值为true时显示列头，当值为数组时，列头为数组的值
            //colHeaders: true,
            //当值为true时显示行头，当值为数组时，行头为数组的值
            //rowHeaders: true,
            //列宽值
            //colWidths: 70,
            //当值为true时，启用右键菜单，为false时禁用
            contextMenu: false,
            //当值为true时，允许拖动，当为false时禁止拖动
            manualRowResize: true,
            //当值为true时，允许拖动，当为false时禁止拖动
            manualColumnResize: true,
            //最小行空间，不足则添加空行
            //minSpareRows: 30,
            //cells: function(row, col, prop) {//单元格渲染
            //    this.renderer = myRenderer;
            //},
            //hansontable将合并的单元格单独拿出来放到了mergeCells数组的mergedCellInfoCollection集合中
            mergeCells: true
        });
        return hot;
    }
};

echartsInit.init();