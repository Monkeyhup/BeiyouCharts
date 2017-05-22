// Various accessors that specify the four dimensions of data to visualize.
$(function() {
	function x(d) {
		return d.income;
	}
	function y(d) {
		return d.lifeExpectancy;
	}
	function radius(d) {
		return d.population;
	}
	function color(d) {
		return d.region;
	}
	function key(d) {
		return d.name;
	}

	// Chart dimensions.
	var margin = {
		top : 19.5,
		right : 19.5,
		bottom : 19.5,
		left : 45
	}, width = 900 - margin.right, height = 500 - margin.top - margin.bottom;
	
	var durationTime = 7000;

	// Various scales. These domains make assumptions of data, naturally.
	//var xScale = d3.scale.log().domain([ 2000, 110000 ]).range([ 0, width ]), yScale = d3.scale
	//		.linear().domain([ 60, 90 ]).range([ height, 0 ]), radiusScale = d3.scale
	//		.sqrt().domain([ 1000, 40000 ]).range([ 0, 46 ]), colorScale = d3.scale
	//		.category10();
	var xScale = d3.scale.log().domain([ 10, 1900]).range([ 0, width ]), yScale = d3.scale
		.linear().domain([ 0, 100 ]).range([ height, 0 ]), radiusScale = d3.scale
		.sqrt().domain([ 0, 6000 ]).range([ 0, 46 ]), colorScale = d3.scale
		.category10();

	// The x & y axes.
	var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12,
			d3.format(",d")), yAxis = d3.svg.axis().scale(yScale).orient("left");

	// Create the SVG container and set the origin.
	var svg = d3.select("#chart").append("svg").attr("width",
			width + margin.left + margin.right).attr("height",
			height + margin.top + margin.bottom).append("g").attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	// Add the x-axis.
	svg.append("g").attr("class", "x axis").attr("transform",
			"translate(0," + height + ")").call(xAxis);

	// Add the y-axis.
	svg.append("g").attr("class", "y axis").call(yAxis);

	// Add an x-axis label.
	svg.append("text").attr("class", "x label").attr("text-anchor", "end").attr(
			"x", width).attr("y", height - 6).text("增加值(亿元)");

	// Add a y-axis label.
//	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr(
//			"y", 6).attr("dy", ".75em").attr("transform", "rotate(0)").text("从业人员(万人)");
	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr(
			"y", 36).attr("x",30).attr("dy", ".75em").attr("transform", "rotate(0)").text("从");
	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr(
			"y", 66).attr("x",30).attr("dy", ".75em").attr("transform", "rotate(0)").text("业");
	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr(
			"y", 96).attr("x",30).attr("dy", ".75em").attr("transform", "rotate(0)").text("人");
	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr(
			"y", 126).attr("x",30).attr("dy", ".75em").attr("transform", "rotate(0)").text("员");
	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr(
			"y", -28).attr("x",160).attr("dy", ".75em").attr("transform", "rotate(90)").text("(");
	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr(
			"y", 166).attr("x",30).attr("dy", ".75em").attr("transform", "rotate(0)").text("万");
	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr(
			"y", 196).attr("x",30).attr("dy", ".75em").attr("transform", "rotate(0)").text("人");
	svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr(
			"y", -28).attr("x",226).attr("dy", ".75em").attr("transform", "rotate(90)").text(")");

	// Add the year label; the value is set on transition.
	var label = svg.append("text").attr("class", "year label").attr("text-anchor",
			"end").attr("y", 120).attr("x", 395).text(2006);		//原来的："x", 345
	// Load the data.
	d3.json("data/data.json", function(nations) {

		// A bisector since many nation's data is sparsely-defined.
		var bisect = d3.bisector(function(d) {
			return d[0];
		});

		// Add a dot per nation. Initialize the data at 1800, and set the colors.
		var dot = svg.append("g").attr("class", "dots").selectAll(".dot").data(
				interpolateData(2006)).enter().append("circle")
				.attr("class", "dot").style("fill", function(d) {
					return colorScale(color(d));
				}).call(position).sort(order);

		// Add a title.
		dot.append("title").text(function(d) {
			return d.name;
		});

		// Add an overlay for the year label.
		var box = label.node().getBBox();

		var overlay = svg.append("rect").attr("class", "overlay").attr("x", box.x)
				.attr("y", box.y).attr("width", box.width).attr("height",
						box.height)/*.on("mouseover", enableInteraction)*/;

		// Start a transition that interpolates the data based on year.
		svg.transition().duration(durationTime).ease("linear").tween("year", tweenYear)
				.each("end", enableInteraction);

		// Positions the dots based on data.
		function position(dot) {

			dot.attr("cx", function(d) {
				return xScale(x(d));
			}).attr("cy", function(d) {
				return yScale(y(d));
			}).attr("r", function(d) {
				return radiusScale(radius(d));
			});
		}

		// Defines a sort order so that the smallest dots are drawn on top.
		function order(a, b) {
			return radius(b) - radius(a);
		}
		// After the transition finishes, you can mouseover to change the year.
		function enableInteraction() {
			var yearScale = d3.scale.linear().domain([ 2006, 2014 ]).range(
					[ box.x + 10, box.x + box.width - 10 ]).clamp(true);

			// Cancel the current transition, if any.
			svg.transition().duration(0);
//			overlay.on("mousemove", mousemove).on("mouseout", mouse);
			

//			overlay.on("mouseover", mouseover).on("mouseout", mouseout).on(
//					"mousemove", mousemove).on("mouseout", mouse).on("touchmove",
//					mousemove).on("mouseover", enable);

			function mouseover() {
				label.classed("active", true);
			}

			function mouseout() {
				label.classed("active", false);
			}

			function mousemove() {
				displayYear(yearScale.invert(d3.mouse(this)[0]));
			}
			function mouse() {
				svg.transition().duration(durationTime).ease("linear").tween("year",
						tweenYear).each("end", enableInteraction);
			}
			function enable() {
				enableInteraction();
			}
		}
		var recordYear = 2006;
		// Tweens the entire chart by first tweening the year, and then the data.
		// For the interpolated data, the dots and label are redrawn.
		function tweenYear() {
			var year = d3.interpolateNumber(recordYear, 2014);
			return function(t) {
				displayYear(year(t));
			};
		}

		// Updates the display to show the specified year.
		var numbersize = 0;
		var numver = 1.80;
		function displayYear(year) {
			numbersize = numbersize + numver;
			dot.data(interpolateData(year), key).call(position).sort(order);
			label.text(Math.round(year));
			recordYear = label.text(Math.round(year))[0][0].textContent;
			$("#youtube_play_icon").css("margin-left",""+numbersize+"px");
			$("#backward_cion").addClass("disabled");

			if(recordYear == 2014){
				numbersize = 785;
				//暂停
				$("#play_icon").attr("data-value","1").removeClass("pause").addClass("play");
				$("#youtube_play_icon").css("margin-left",""+numbersize+"px");
				$("#backward_cion").removeClass("disabled");
			}
			if(numbersize > 785){
				numbersize = 785;
				//暂停
				$("#play_icon").attr("data-value","1").removeClass("pause").addClass("play");
				$("#youtube_play_icon").css("margin-left",""+numbersize+"px");
				$("#backward_cion").removeClass("disabled");
			}
		}
		
		// Interpolates the dataset for the given (fractional) year.
		function interpolateData(year) {
			return nations.map(function(d) {
				return {
					name : d.name,
					region : d.region,
					income : interpolateValues(d.gdp, year),					//x轴
					population : interpolateValues(d.consume, year),			//气泡大小
					lifeExpectancy : interpolateValues(d.lifeExpectancy, year)	//y轴
				};
			});
		}
		$("#play_icon").click(function(){
			var $this = $(this);
			var icon = $this.attr("data-value");
			numbersize = numbersize + numver;

			if(recordYear == 2014){
				recordYear = 2006;
				numbersize = -3;
				svg.transition().duration(durationTime).ease("linear").tween("year", tweenYear).each("end", enableInteraction);
				$("#youtube_play_icon").css("margin-left",""+numbersize+"px");
				$this.attr("data-value","1").removeClass("pause").addClass("play");
			}
			if(icon =="0"){
				//暂停
				$this.attr("data-value","1").removeClass("pause").addClass("play");
				enableInteraction();
			} else {
				//播放
				$this.attr("data-value","0").removeClass("play").addClass("pause");
				svg.transition().duration(durationTime).ease("linear").tween("year", tweenYear).each("end", enableInteraction);
				$("#youtube_play_icon").css("margin-left",""+numbersize+"px");
			}
		});
		$("#backward_cion").click(function(){
			var isDisabled = $(this).hasClass("disabled");
			if(isDisabled){
				return false;
			}

			recordYear = 2006;
			numbersize = 1;
			svg.transition().duration(durationTime).ease("linear").tween("year", tweenYear).each("end", enableInteraction);
			$("#youtube_play_icon").css("margin-left",""+numbersize+"px");
		});
 		// Finds (and possibly interpolates) the value for the specified year.
		function interpolateValues(values, year) {
			var i = bisect.left(values, year, 0, values.length - 1), a = values[i];
			if (i > 0) {
				var b = values[i - 1], t = (year - a[0]) / (b[0] - a[0]);
				return a[1] * (1 - t) + b[1] * t;
			}
			return a[1];
		}

		//先暂停
		$("#play_icon").click();
	});
});