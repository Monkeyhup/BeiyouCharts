jQuery(function() {
	population_of_permanent();
});
/*
 * 指标选择
 */
var population_of_permanent = function() {
	$("#nytg-wenhua").css("background", "#1F77B4");
	$("#nytg-wenhua").css("color", "#F8F8FF");
	$("#nytg-wenhua").css("font-weight", "bold");
	$(".nytg-population_of_permanent li")
			.click(
					function(re) {
						var liId = re.currentTarget.id;
						$("#" + liId).css("background", "#1F77B4");
						$("#" + liId).css("color", "#F8F8FF");
						$("#" + liId).css("font-weight", "bold");
						var change_name = $("#" + liId).text();
						var dataroot = null;
						switch (change_name) {
						case "文化":
							dataroot = "Dynamic_view/population_of_permanent/wenhua.json";
							var text = "文化";
							$.getJSON(dataroot, function(data) {
								change_year(data, text);
							});
							break;
						default:
							break;
						}
						$(".nytg-population_of_permanent li").each(
								function(index, element) {
									if (liId == element.id) {
										return "";
									} else {
										$("#" + element.id).css("background",
												"#f9f9f9");
										$("#" + element.id).css("color",
												"#333333");
										$("#" + element.id).css("font-weight",
												"normal");
									}
								});
					});
	var text = "文化";
	var dataroot = "Dynamic_view/population_of_permanent/wenhua.json";
	$.getJSON(dataroot, function(data) {
		change_year(data, text);
	});
};
		/**
		 * 取有效数字
		 * 
		 * @param src
		 *            数据
		 * @param pos
		 *            保留的小数位数
		 */
		var fomatFloat = function(src, pos) {
			return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
		};
var map_chart = function(data, name_indicators) {
	// 取最大值
	for ( var i = 0; i < data.length; i++) {
		for ( var j = 0; j < data.length; j++) {
			if (parseInt(data[i].value) > parseInt(data[j].value)) {
				var change = data[i];
				data[i] = data[j];
				data[j] = change;
			}
		}
	}
	// 把value字符串的值转换成数值
	for ( var i = 0; i < data.length; i++) {
		data[i].value = parseInt(data[i].value);
		if (data[i].name == "内蒙古自治区" || data[i].name == "黑龙江省") {
			data[i].name = (data[i].name).substring(0, 3);
		} else {
			if (data[i].name == "内蒙古" || data[i].name == "黑龙江") {
				data[i].name = (data[i].name).substring(0, 3);
			} else {
				data[i].name = (data[i].name).substring(0, 2);
			}
		}
	}
	var myChart = echarts.init(document.getElementById('map_industry'));
	var color_data = [ 'red', '#FF7F50', '#87CEFA', '#DA70D5' ];
	var maxData = fomatFloat(data[0].value,0);
	var option = {
		tooltip : {
			trigger : 'item'
		},
		dataRange : {
			min : 0,
			max : maxData,
			text : [ '高', '低' ], // 文本，默认为数值文本
			calculable : true,
		},
		series : [ {
			name : name_indicators,
			type : 'map',
			mapType : 'china',
			roam : false,
			itemStyle : {
				normal : {
					label : {
						show : true
					}
				},
				emphasis : {
					label : {
						show : true
					}
				}
			},
			data : data
		} ]
	};
	myChart.setOption(option);
};
var zhu_chart = function(data, name_indicators) {
	var myChart = echarts.init(document.getElementById('zhu_industry'));
	var color_data = [ '#FF7F50', '#87CEFA', '#DA70D5' ];
	for ( var i = 0; i < data.length; i++) {
		for ( var j = 0; j < data.length; j++) {
			if (parseInt(data[i].value) < parseInt(data[j].value)) {
				var change = data[i];
				data[i] = data[j];
				data[j] = change;
			}
		}
	}
	var name_data = {
		name : [],
		data : []
	};
	for ( var number = 0; number < data.length; number++) {
		name_data.data.push(parseInt(data[number].value));
		name_data.name.push(data[number].name);
	}
	var option = {
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'shadow'
			}
		},
		xAxis : [ {
			type : 'value',
			splitLine : {
				show : false
			},
			axisLabel : {
				show : false
			},
			axisLine : {
				lineStyle : {
					width : 0,
				}
			}
		} ],
		yAxis : [ {
			type : 'category',
			splitLine : {
				show : false
			},
			axisTick : {
				show : false
			},
			data : name_data.name
		} ],
		grid : {
			borderColor : '#ffffff'
		},
		series : [ {
			name : name_indicators,
			type : 'bar',
			stack : name_indicators,
			itemStyle : {
				normal : {
					label : {
						show : true,
						// formatter : function(a, b, c) {
						 	/*var sum = 0;
						 	for ( var i = 0; i < option.series[0].data.length; i++) {
						 		sum += option.series[0].data[i];
							}
							var dot = (c / sum) * 100 + '';
						 	var vl = dot.substring(0, dot.lastIndexOf("."));
							return sum*/
						//  	var re = c + '(件)' 
						// 	return re;
						// }
					},
					color : (function() {
						return color_data[0];
					})
				}
			},
			data : name_data.data
		} ]
	};
	myChart.setOption(option);
};

/*
 * 选择年份
 */
var change_year = function(data, text) {
	var f = document.getElementById("ui_li");
	var childs = f.childNodes;
	if (childs.length != 0) {
		for ( var num = childs.length - 1; num >= 0; num--) {
			f.removeChild(childs[num]);
		}
	}
	var knowledge = null;
	var name_indicators = null;
	switch (text) {
	case "文化":
		name_indicators = "国内发明专利申请受理数：";
		knowledge = data.knowledge2010;
		/*var li_append1 = "<li class='ui_item' id='ui_2004'>2004</li>";
		$(".ui_menu").append(li_append1);
		var li_append2 = "<li class='ui_item' id='ui_2005'>2005</li>";
		$(".ui_menu").append(li_append2);
		var li_append3 = "<li class='ui_item' id='ui_2006'>2006</li>";
		$(".ui_menu").append(li_append3);
		var li_append4 = "<li class='ui_item' id='ui_2007'>2007</li>";
		$(".ui_menu").append(li_append4);*/
		var li_append7 = "<li class='ui_item' id='ui_2010'>2010</li>";
		$(".ui_menu").append(li_append7);
		var li_append8 = "<li class='ui_item' id='ui_2011'>2011</li>";
		$(".ui_menu").append(li_append8);
		var li_append9 = "<li class='ui_item' id='ui_2012'>2012</li>";
		$(".ui_menu").append(li_append9);
		var li_append10 = "<li class='ui_item' id='ui_2013'>2013</li>";
		$(".ui_menu").append(li_append10);
		var li_append11 = "<li class='ui_item' id='ui_2014'>2014</li>";
		$(".ui_menu").append(li_append11);



		$("#ui_2010").css("background", "#564F8A");
		$("#ui_2010").css("color", "#F8F8FF");
		break;
	default:
		break;
	}
	map_chart(knowledge, name_indicators);
	zhu_chart(knowledge, name_indicators);
	$(".ui_menu li").click(function(re) {
		knowledge = null;
		var change_id = re.currentTarget.id;
		$("#" + change_id).css("background", "#564F8A");
		$("#" + change_id).css("color", "#F8F8FF");
		switch (re.currentTarget.innerText) {
		case "2004":
			knowledge = data.knowledge2004;
			break;
		case "2005":
			knowledge = data.knowledge2005;
			break;
		case "2006":
			knowledge = data.knowledge2006;
			break;
		case "2007":
			knowledge = data.knowledge2007;
			break;
		case "2008":
			knowledge = data.knowledge2008;
			break;
		case "2009":
			knowledge = data.knowledge2009;
			break;
		case "2010":
			knowledge = data.knowledge2010;
			break;
		case "2011":
			knowledge = data.knowledge2011;
			break;
		case "2012":
			knowledge = data.knowledge2012;
			break;
		case "2013":
			knowledge = data.knowledge2013;
			break;
			case "2014":
				knowledge = data.knowledge2014;
				break;
		default:
			alert("没有数据");
			break;
		}
		map_chart(knowledge, name_indicators);
		zhu_chart(knowledge, name_indicators);
		$(".ui_menu li").each(function(index, element) {
			if (change_id == element.id) {
				return "";
			} else {
				$("#" + element.id).css("background", "#F8F8FF");
				$("#" + element.id).css("color", "#000000");
			}
		});
	});
};