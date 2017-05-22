/*
 * 出图脚本
 */
define(function(require, exports, module) {
	var EchartsFactory = require("js/echarts/visualkization.tool.echarts.factory");
	var D3Factory = require("js/d3/visualkization.tool.d3.factory");

	/**
	 * 导航
	 */
	var Nav = (function() {

		var init = function() {
			// 绑定滚动条
			bindScroll();

			// 目录居中
			setDirToCenter();

			// 绑定目录点击
			bindDirEvent();

			// 绑定公报切换
			bindChangePageEvent();
		};

		/**
		 * 绑定滚动条
		 */
		var bindScroll = function() {
			/* 监听滚动条 */
			window.onscroll = function() {
				var t = document.documentElement.scrollTop
						|| document.body.scrollTop;
				if (t >= 300) {
					$("#top_div").fadeIn();
				} else {
					$("#top_div").fadeOut();
				}
			};

			// 点击出现导航条
			$(".change_label").click(function() {
				var value = $(".fix_index").attr("data-value");
				if (value == "false") {
					$(".fix_index").fadeIn();
					$(".fix_index").attr("data-value", "true");
					$(".return_hov").css("background-color", "#EEEEE0");
				} else {
					$(".fix_index").fadeOut();
					$(".fix_index").attr("data-value", "false");
					$(".return_hov").css("background-color", "#FFFFFF");
				}
			});

			// 点击回调顶部
			$("#top_div").click(function() {
				$("html,body").animate({
					scrollTop : 0
				}, 500);
			});
		};

		/**
		 * 设置目录居中
		 */
		var setDirToCenter = function() {
			var height_css = $(".fix_index").css("height");
			var height = parseInt(height_css);
			height = Math.round(height / 2);
			$(".fix_index").css("margin-top", "-" + height + "px");
		};

		/**
		 * 绑定目录点击
		 */
		var bindDirEvent = function() {

			// 目录-公报切换
			$(".book1 div[id^=page_]").on("click", function() {
				var $this = $(this);
				var id = $this.attr("id");
				var index = id.substr(id.indexOf("page_") + 5, id.length);
				switch (parseInt(index)) {
				case 1:
					window.location = "one.html";
					break;
				case 2:
					window.location = "two.html";
					break;
				case 3:
					window.location = "three.html";
					break;
				default:
					break;
				}
			});

			// 目录切换
			$("ul#dir-ul li").on("click", function() {
				var $li = $(this);
				var value = $li.attr("data-value");
				$("html,body").animate({
					scrollTop : $("#mari-" + value).offset().top
				}, 500);
			});
		};

		/**
		 * 绑定公报切换
		 */
		var bindChangePageEvent = function() {
			var curr = $("ul.pagination li.active").attr("data-value");
			var curr = parseInt(curr);
			if (curr == 1) {
				$("ul.pagination li.pre_page").remove(); // 没有前一页
			} else if (curr == 3) {
				$("ul.pagination li.next_page").remove(); // 没有下一页
			}
			// 绑定
			$("ul.pagination li").on("click", function() {
				var $this = $(this);
				var value = $this.attr("data-value");

				if (value == "pre")
					value = curr - 1;
				else if (value == "next")
					value = curr + 1;

				switch (value) {
				case "1":
				case 1:
					window.location = "one.html";
					break;
				case "2":
				case 2:
					window.location = "two.html";
					break;
				case "3":
				case 3:
					window.location = "three.html";
					break;
				default:
					break;
				}
			});
		};

		return {
			init : init
		};
	})();

	/**
	 * 入口
	 */
	var init = function() {
		Nav.init();


		// 图7
		grid7();
		// 图8
		grid8();
		// 图9
		grid9();
		// 图10
		grid10();
		// 图11
		gird11();
		// 图12
		grid12();
		// 图13
		grid13();
		// 图14
		grid14();
		// 图15
		grid15();
		// 图16
		grid16();
		// 图17
		grid17();
		// 图18
		grid18();
		// 图19
		grid19();
		// 图20
		grid20();
		// 图21
		grid21();
		// 图22
		grid22();
		// 图23
		grid23();
		// 图24
		grid24();
		// 图25
		grid25();
		showHide();
	};
	
	/**
	 * 图7
	 */
	var grid7 = function() {
		D3Factory.getInstance(D3Factory.D3.BAR.ICE, function(obj) {
			var config = {
				w : 850, // 图的宽度
				h : 480, // 图的高度
				containerId : "#gird7_1", // 容器id
				url : null,
				colors : [ "#D9AA64", "#93AA8D", "#E9CD6C" ]
			};
			config.url = "data/three/gird7_1.json";
			obj.init(config);
			$("#g_7_btn button").click(function() {
				var $this = $(this);
				var ID = $this.attr("data-value");
				$this.parent().find(">button").removeClass("btn-success");
				$this.addClass("btn-success");
				var path = null;
				switch (ID) {
				case "1":
					config.url = "data/three/gird7_1.json";
					obj.init(config);
					break;
				case "2":
					config.url = "data/three/gird7_2.json";
					obj.init(config);
					break;
				default:
					break;
				}
			});
		});
	};
	/**
	 * 图8
	 */
	var grid8 = function() {
		var custom1 = {
			"width" : "48%",
			"height" : "400px",
			fontColor : "#121212",
			pieFontColor : "#121212",
			fontSize : 12
		};
		var custom2 = {
			"width" : "52%",
			"height" : "400px",
			fontSize : 12,
			show : false,
			color : "#E3B5AD",
			fontColor : "#121212",
			barBorderWidth : 1,
			barBorderColor : "#E3B5AD",
			barBorderRadius : [ 0, 7, 7, 0 ],
		};
		var path1, path1 = null;
		$("#g_8_btn button").click(function() {
			var $this = $(this);
			var ID = $this.attr("data-value");
			$this.parent().find(">button").removeClass("btn-success");
			$this.addClass("btn-success");
			switch (ID) {
			case "1":
				path1 = "data/three/gird8_1.json";
				path2 = "data/three/gird8_2.json";
				gr8(path1, path2);
				break;
			case "2":
				path1 = "data/three/gird8_1_1.json";
				path2 = "data/three/gird8_2_2.json";
				gr8(path1, path2);
				break;
			default:
				break;
			}
		});
		path1 = "data/three/gird8_1.json";
		path2 = "data/three/gird8_2.json";
		gr8(path1, path2);
		function gr8(path1, path2) {
			EchartsFactory.make("gird8_1", path1, custom1, "pie");
			EchartsFactory.make("gird8_2", path2, custom2, "bar");
		}
	};
	/**
	 * 图9
	 */
	var grid9 = function() {
		var custom = {
			"width" : "800px",
			"height" : "400px",
			scatterRetain:"1",
			show : true
		};
		var path = "data/three/gird9_1.json";
		EchartsFactory.make("gird9_1", path, custom, "scatter");
	};
	/**
	 * 图10
	 */
	var grid10 = function() {
		var custom1 = {
			"width" : "48%",
			"height" : "400px",
			fontSize : 12
		};
		var custom2 = {
				"width" : "52%",
				"height" : "400px",
				fontSize : 12,
				show : false,
				color : "#E3B5AD",
				fontColor : "#121212",
				barBorderWidth : 1,
				barBorderColor : "#E3B5AD",
				barBorderRadius : [ 0, 7, 7, 0 ],
		};
		var path1, path1 = null;
		$("#g_10_btn button").click(function() {
			var $this = $(this);
			var ID = $this.attr("data-value");
			$this.parent().find(">button").removeClass("btn-success");
			$this.addClass("btn-success");
			var path = null;
			switch (ID) {
			case "1":
				path1 = "data/three/gird10_1.json";
				path2 = "data/three/gird10_2.json";
				gr10(path1, path2);
				break;
			case "2":
				path1 = "data/three/gird10_1_1.json";
				path2 = "data/three/gird10_2_2.json";
				gr10(path1, path2);
				break;
			default:
				break;
			}
		});
		path1 = "data/three/gird10_1.json";
		path2 = "data/three/gird10_2.json";
		gr10(path1, path2);
		function gr10(path1, path2) {
			EchartsFactory.make("gird10_1", path1, custom1, "pie");
			EchartsFactory.make("gird10_2", path2, custom2, "bar");
		}
	};
	/**
	 * 图11
	 */
	var gird11 = function() {
		var custom = {
			"width" : "800px",
			"height" : "400px",
			interval : 0,
			inter : 8,
			colmRetain : 2,
			show : true,
			barBorderRadius : [ 7, 7, 0, 0 ]
		};
		var path = "data/three/gird11.json";
		EchartsFactory.make("gird11_1", path, custom, "column");
	};
	/**
	 * 图12
	 */
	var grid12 = function() {
		var custom = {
			"width" : "60%",
			"height" : "370px",
			pieFontSize:16,
			pieSorting : true
		};
		var path1, path2 = null;
		$("#g_12_btn button").click(function() {
			var $this = $(this);
			var ID = $this.attr("data-value");
			$this.parent().find(">button").removeClass("btn-success");
			$this.addClass("btn-success");
			var path = null;
			switch (ID) {
			case "1":
				path1 = "data/three/gird12_1.json";
				path2 = "data/three/gird12_1_1.json";
				gr12(path1, path2);
				break;
			case "2":
				path1 = "data/three/gird12_2.json";
				path2 = "data/three/gird12_2_2.json";
				gr12(path1, path2);
				break;
			default:
				break;
			}
		});
		path1 = "data/three/gird12_1.json";
		path2 = "data/three/gird12_1_1.json";
		gr12(path1, path2);
		function gr12(path1, path2) {
			EchartsFactory.make("grid12_1", path1, custom, "pie");
			EchartsFactory.make("grid12_2", path2, custom, "pie");
		}
	};
	/**
	 * 图13
	 */
	var grid13 = function() {
		var custom1 = {
			"width" : "48%",
			"height" : "400px",
		};
		var custom2 = {
			"width" : "52%",
			"height" : "400px",
			fontSize : 12,
			show : false,
			barBorderRadius : [ 0, 7, 7, 0 ],
		};
		var path1, path1 = null;
		$("#g_13_btn button").click(function() {
			var $this = $(this);
			var ID = $this.attr("data-value");
			$this.parent().find(">button").removeClass("btn-success");
			$this.addClass("btn-success");
			var path = null;
			switch (ID) {
			case "1":
				path1 = "data/three/gird13_1.json";
				path2 = "data/three/gird13_2.json";
				gr13(path1, path2);
				break;
			case "2":
				path1 = "data/three/gird13_1_1.json";
				path2 = "data/three/gird13_2_2.json";
				gr13(path1, path2);
				break;
			default:
				break;
			}
		});
		path1 = "data/three/gird13_1.json";
		path2 = "data/three/gird13_2.json";
		gr13(path1, path2);
		function gr13(path1, path2) {
			EchartsFactory.make("gird13_1", path1, custom1, "pie");
			EchartsFactory.make("gird13_2", path2, custom2, "bar");
		}
	};
	/**
	 * 图14
	 */
	var grid14 = function() {
		var custom = {
			"width" : "600px",
			"height" : "400px",
		};
		var path = "data/three/gird14_1.json";
		EchartsFactory.make("gird14_1", path, custom, "nestedPie");
	};
	/**
	 * 图15
	 */
	var grid15 = function() {
		var custom1 = {
			"width" : "48%",
			"height" : "400px",
		};
		var custom2 = {
			"width" : "52%",
			"height" : "400px",
			fontSize : 12,
			show : false,
			color : "#E3B5AD",
			fontColor : "#121212",
			barBorderWidth : 1,
			barBorderColor : "#E3B5AD",
			barBorderRadius : [ 0, 7, 7, 0 ],
		};
		var path1, path1 = null;
		$("#g_15_btn button").click(function() {
			var $this = $(this);
			var ID = $this.attr("data-value");
			$this.parent().find(">button").removeClass("btn-success");
			$this.addClass("btn-success");
			var path = null;
			switch (ID) {
			case "1":
				path1 = "data/three/gird15_1.json";
				path2 = "data/three/gird15_2.json";
				gr15(path1, path2);
				break;
			case "2":
				path1 = "data/three/gird15_1_1.json";
				path2 = "data/three/gird15_2_2.json";
				gr15(path1, path2);
				break;
			default:
				break;
			}
		});
		path1 = "data/three/gird15_1.json";
		path2 = "data/three/gird15_2.json";
		gr15(path1, path2);
		function gr15(path1, path2) {
			EchartsFactory.make("gird15_1", path1, custom1, "pie");
			EchartsFactory.make("gird15_2", path2, custom2, "bar");
		}
	};
	/**
	 * 图16
	 */
	var grid16 = function() {
		var custom = {
			"width" : "800px",
			"height" : "400px",
			interval : 0,
			colmRetain : 2,
			show : true,
			barBorderRadius : [ 7, 7, 0, 0 ],
		};
		var path = "data/three/gird16.json";
		EchartsFactory.make("gird16_1", path, custom, "column");
	};
	/**
	 * 图17
	 */
	var grid17 = function() {
		var custom1 = {
			"width" : "50%",
			"height" : "350px",
			pieFontSize : 14
		};
		var custom2 = {
			"width" : "53%",
			"height" : "350px",
			pieFontSize : 14
		};
		var path1, path1 = null;
		path1 = "data/three/gird17_1.json";
		path2 = "data/three/gird17_2.json";
		EchartsFactory.make("gird17_1", path1, custom1, "pie");
		EchartsFactory.make("gird17_2", path2, custom2, "pie");
	};
	/**
	 * 图18
	 */
	var grid18 = function() {
		var custom = {
			"width" : "80%",
			"height" : "400px",
			pieFontSize : 14,
			pieSorting : false,
			retain : 2
		};
		var path = "data/three/gird18.json";
		EchartsFactory.make("gird18_1", path, custom, "pie");
	};
	/**
	 * 图19
	 */
	var grid19 = function() {
		var custom = {
			"width" : "800px",
			"height" : "400px",
			barBorderRadius : [ 7, 7, 0, 0 ],
			show : true
		};
		var path = null;
		$("#g_19_btn button").click(function() {
			var $this = $(this);
			var ID = $this.attr("data-value");
			$this.parent().find(">button").removeClass("btn-success");
			$this.addClass("btn-success");
			switch (ID) {
			case "1":
				path = "data/three/gird19_1.json";
				gr19(path);
				break;
			case "2":
				path = "data/three/gird19_2.json";
				gr19(path);
				break;
			default:
				break;
			}
		});
		path = "data/three/gird19_1.json";
		gr19(path);
		function gr19(path) {
			EchartsFactory.make("gird19_1", path, custom, "column");
		}
	};
	/**
	 * 图20
	 */
	var grid20 = function() {
		var custom = {
			"width" : "800px",
			"height" : "400px",
		};
		var path = "data/three/gird20.json";
		EchartsFactory.make("gird20_1", path, custom, "column");
	};
	/**
	 * 图21
	 */
	var grid21 = function() {
		var custom1 = {
			"width" : "48%",
			"height" : "400px",
			retain : 0
		};
		var custom2 = {
			"width" : "52%",
			"height" : "400px",
			fontSize : 12,
			show : false,
			barBorderRadius : [ 0, 7, 7, 0 ]
		};
		var path1, path1 = null;
		$("#g_21_btn button").click(function() {
			var $this = $(this);
			var ID = $this.attr("data-value");
			$this.parent().find(">button").removeClass("btn-success");
			$this.addClass("btn-success");
			var path = null;
			switch (ID) {
			case "1":
				path1 = "data/three/gird21_1.json";
				path2 = "data/three/gird21_2.json";
				gr21(path1, path2);
				break;
			case "2":
				path1 = "data/three/gird21_1_1.json";
				path2 = "data/three/gird21_2_2.json";
				gr21(path1, path2);
				break;
			default:
				break;
			}
		});
		path1 = "data/three/gird21_1.json";
		path2 = "data/three/gird21_2.json";
		gr21(path1, path2);
		function gr21(path1, path2) {
			EchartsFactory.make("gird21_1", path1, custom1, "pie");
			EchartsFactory.make("gird21_2", path2, custom2, "bar");
		}
	};
	/**
	 * 图22
	 */
	var grid22 = function() {
		var custom1 = {
			"width" : "48%",
			"height" : "400px",
		};
		var custom2 = {
			"width" : "52%",
			"height" : "400px",
			fontSize : 12,
			show : false,
			barBorderRadius : [ 0, 7, 7, 0 ]
		};
		var path1, path1 = null;
		$("#g_22_btn button").click(function() {
			var $this = $(this);
			var ID = $this.attr("data-value");
			$this.parent().find(">button").removeClass("btn-success");
			$this.addClass("btn-success");
			switch (ID) {
			case "1":
				path1 = "data/three/gird22_1.json";
				path2 = "data/three/gird22_2.json";
				gr22(path1, path2);
				break;
			case "2":
				path1 = "data/three/gird22_1_1.json";
				path2 = "data/three/gird22_2_2.json";
				gr22(path1, path2);
				break;
			default:
				break;
			}
		});
		path1 = "data/three/gird22_1.json";
		path2 = "data/three/gird22_2.json";
		gr22(path1, path2);
		function gr22(path1, path2) {
			EchartsFactory.make("gird22_1", path1, custom1, "pie");
			EchartsFactory.make("gird22_2", path2, custom2, "bar");
		}
	};
	/**
	 * 图23
	 */
	var grid23 = function() {
		var custom = {
			"width" : "800px",
			"height" : "400px",
			barBorderRadius : [ 7, 7, 0, 0 ],
			show : true
		};
		var path = "data/three/gird23.json";
		EchartsFactory.make("gird23_1", path, custom, "column");
	};
	/**
	 * 图24
	 */
	var grid24 = function() {
		var custom = {
			"width" : "800px",
			"height" : "450px",
		};
		$("#g_24_btn button").click(function() {
			var $this = $(this);
			var ID = $this.attr("data-value");
			$this.parent().find(">button").removeClass("btn-success");
			$this.addClass("btn-success");
			var path = null;
			switch (ID) {
			case "1":
				path = "data/three/gird24_1.json";
				gr24(path);
				break;
			case "2":
				path = "data/three/gird24_2.json";
				gr24(path);
				break;
			default:
				break;
			}
		});
		var path = "data/three/gird24_1.json";
		gr24(path);
		function gr24(path) {
			EchartsFactory.make("gird24_1", path, custom, "pie");
		}
	};
	/**
	 * 图25
	 */
	var grid25 = function() {
		var custom = {
			"width" : "800px",
			"height" : "400px",
			barBorderRadius : [ 7, 7, 0, 0 ],
			show : true
		};
		var path = "data/three/gird25.json";
		EchartsFactory.make("gird25_1", path, custom, "column");
	};
	/**
	 * 数据隐藏显示
	 */
	var showHide = function() {
		$(".ui.button").on("click", function() {
			var $this = $(this);
			var $next = $this.next();
			var value = $this.attr("data-value");
			switch (value) {
			case "hide":
				$this.attr("data-value", "show");
				$this.text("隐藏数据");
				break;
			case "show":
				$this.attr("data-value", "hide");
				$this.text("显示数据");
				break;
			default:
				break;
			}
			$next.toggle();
		});
	};

	init();
});