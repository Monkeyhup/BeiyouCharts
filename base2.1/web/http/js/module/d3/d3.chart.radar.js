/**
 * Created by lmy on 2016/1/23.
 */
define(function(require, exports, module) {
    var ChartRadar = function() {
        this.currentColors = [];
        this.config = {
            margin: {top: 100, right: 100, bottom: 100, left: 100}, //The margins of the SVG
            w: 700,			//Width of the circle
            h: 500,				//Height of the circle
            levels: 5,				//How many levels or inner circles should there be drawn
            maxValue: 0, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
            //colors: d3.scale.category10(),
            colors:["#2BA02B","#428CBF","#FF9332","#D01D20", "#D85C14", "#DEB714", "#B7D326", "#29BB28", "#1DB7C3",
                "#713EB7", "#6E8EA7", "#9e0142", "#f46d43", "#A4838A",
                "#938175", "#A9A077", "#989862", "#8AAA67", "#80B08A",
                "#78A882", "#599490", "#508983", "#5097B3", "#4F92AF", "#567DA8",
                "#7B75A5", "#8063A5", "#8668A8", "#A85FAE"],//Color function
            url:"js/module/d3/d3.chart.radar.text.json",   //json's url
            containerId: "#",
            dataType: "",
            isShowLabel:true,
            isShowText:true,
            fontsize:"10px",
            fontfamily:"SimSun"
        }
    };
    ChartRadar.prototype={
        init: function(config) {
            config = config ? config : {};
            this.config = $.extend(true, this.config, config);
            var containerId = this.config.containerId;
            var container = document.getElementById(containerId ? containerId : "");
            if (container) {
                this.config.containerId = "#" + containerId
            }
            $(containerId).html("");
            //添加配置样式
            if(config.config){
                this.config = $.extend(true,this.config,config.config || {});
            }
            this.excute();
        },
        excute: function() {
            var that = this;
            that.currentColors = [];

            var w=this.config.w;
            var h=this.config.h;
            var margin=this.config.margin;
            var levels=this.config.levels;
            var maxValue_1=this.config.maxValue;
            var labelFactor=this.config.labelFactor;
            var wrapWidth=this.config.wrapWidth;
            var opacityArea=this.config.opacityArea;
            var dotRadius=this.config.dotRadius;
            var opacityCircles=this.config.opacityCircles;
            var strokeWidth=this.config.strokeWidth;
            var colors=this.config.colors;
            var dataUrl=this.config.url;
            var containerId = this.config.containerId;
            var dataData = this.config.data;
            var dataType = this.config.dataType;
            var isShowLabel=this.config.isShowLabel;
            var roundStrokes=this.config.roundStrokes;
            var isShowText=this.config.isShowText;
            var fontsize=this.config.fontsize;
            var fontfamily=this.config.fontfamily;

            if(typeof dataData == "object" && dataData != null){
                //console.log(dataData);
                showData(dataData);
            }else{
                d3.json(dataUrl, function(re) {
                    showData(re);
                });
            }

            function showData(re) {
                if (dataType && dataType != "") {
                    var dataset = re[dataType + "_data"];

                } else {
                    var dataset = re["_data"];

                }
                if (!dataset) {
                    SGIS.Log("错误提示:数据为 null!");
                    return
                }


                var data = new Array();
                for (var i = 0; i < dataset.length; i++) {
                    data[i] = dataset[i].data;
                }
                var dataname = new Array();
                for (var i = 0; i < dataset.length; i++) {
                    dataname[i] = dataset[i].name;
                }


                //If the supplied maxValue is smaller than the actual one, replace by the max in the data
                var maxValue = Math.max(maxValue_1, d3.max(data, function (i) {
                    return d3.max(i.map(function (o) {
                        return o.value;
                    }))
                }));
                var allAxis = (data[0].map(function (i) {
                        return i.axis
                    })),
                    total = allAxis.length,					//The number of different axes
                    radius = Math.min(w / 3, h / 3), 	//Radius of the outermost circle
                    Format = d3.format('%'),			 	//Percentage formatting
                    angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"


                //Scale for the radius
                var rScale = d3.scale.linear()
                    .range([0, radius])
                    .domain([0, maxValue]);

                /////////////////////////////////////////////////////////
                //////////// Create the container SVG and g /////////////
                /////////////////////////////////////////////////////////

                //Remove whatever chart with the same id/class was present before
                d3.select(containerId).select("svg").remove();

                //Initiate the radar chart SVG
                var svg = d3.select(containerId).append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("class", "radar" + containerId);
                //Append a g element
                var g = svg.append("g")
                    .attr("transform", "translate(" + (w / 3 + margin.left) + "," + (h / 3 + margin.top) + ")");


                /////////////////////////////////////////////////////////
                ////////// Glow filter for some extra pizzazz ///////////
                /////////////////////////////////////////////////////////

                //Filter for the outside glow
                var filter = g.append('defs').append('filter').attr('id', 'glow'),
                    feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
                    feMerge = filter.append('feMerge'),
                    feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
                    feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');



                /////////////////////////////////////////////////////////
                /////////////// 背景雷达圈 //////////////////
                /////////////////////////////////////////////////////////

                //Wrapper for the grid & axes
                var axisGrid = g.append("g").attr("class", "axisWrapper");

                //Draw the background circles
                axisGrid.selectAll(".c")
                    .data(d3.range(1,(levels+1)).reverse())
                    .enter()
                    .append("circle")
                    .attr("class", "gridCircle")
                    .attr("r", function(d){return radius/levels*d;})
                    .style("fill", "#CDCDCD")
                    .style("stroke", "#CDCDCD")
                    .style("fill-opacity", opacityCircles)
                    .style("filter" , "url(#glow)");


                //Text indicating at what % each level is
                axisGrid.selectAll(".axisLabel")
                    .data(d3.range(1,(levels+1)).reverse())
                    .enter().append("text")
                    .attr("class", "axisLabel")
                    .attr("x", 4)
                    .attr("y", function(d){return -d*radius/levels;})
                    .attr("dy", "0.4em")
                    .style("font-size", "10px")
                    .attr("fill", "#737373")
                    .text(function(d,i) { return Format(maxValue * d/levels); });

                /////////////////////////////////////////////////////////
                //////////////////// Draw the axes //////////////////////
                /////////////////////////////////////////////////////////

                //Create the straight lines radiating outward from the center
                var axis = axisGrid.selectAll(".axis")
                    .data(allAxis)
                    .enter()
                    .append("g")
                    .attr("class", "axis");
                //Append the lines
                axis.append("line")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
                    .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
                    .attr("class", "line")
                    .style("stroke", "white")
                    .style("stroke-width", "2px");

                //Append the labels at each axis
                if(isShowText) {
                    axis.append("text")
                        .attr("class", "legend")
                        .style("font-size", fontsize)
                        .style("font-family",fontfamily)
                        .style("fill","##242424")
                        .attr("text-anchor", "middle")
                        .attr("dy", "0.35em")
                        .attr("x", function(d, i){ return rScale(maxValue * labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
                        .attr("y", function(d, i){ return rScale(maxValue * labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
                        .text(function(d){return d})
                        .call(wrap, wrapWidth);
                }


                /////////////////////////////////////////////////////////
                ///////////// Draw the radar chart blobs ////////////////
                /////////////////////////////////////////////////////////

                //The radial line function
                var radarLine = d3.svg.line.radial()
                    .interpolate("linear-closed")
                    .radius(function(d) { return rScale(d.value); })
                    .angle(function(d,i) {	return i*angleSlice; });

                if(roundStrokes){
                    radarLine.interpolate("cardinal-closed");
                }



                //Create a wrapper for the blobs
                var blobWrapper = g.selectAll(".radarWrapper")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "radarWrapper");

                //Append the backgrounds
                var colorLen = colors.length;
                blobWrapper
                    .append("path")
                    .attr("class",  "radarArea")
                    .attr("id",function(d,i){
                        return "radarArea_"+i;
                    })
                    .attr("d", function(d,i) { return radarLine(d); })
                    .style("fill", function(d,i) {
                        that.currentColors.push(colors[i%colorLen]);
                        return colors[i%colorLen];
                    })
                    .style("fill-opacity", opacityArea)
                    .on('mouseover', function (d,i){
                        //Dim all blobs
                        d3.selectAll(".radarArea")
                            .transition().duration(200)
                            .style("fill-opacity", 0.1);

                        //Bring back the hovered over blob
                        d3.select(this)
                            .transition().duration(200)
                            .style("fill-opacity", 0.7);

                        //标签样式同步
                        $("text#show-label_"+i).css("fill",colors[i%colorLen]);
                    })
                    .on('mouseout', function(d,i){
                        //Bring back all blobs
                        d3.selectAll(".radarArea")
                            /* .transition().duration(200)*/
                            .style("fill-opacity", opacityArea);

                        $("text#show-label_"+i).css("fill","");
                    });

                //Create the outlines
                blobWrapper.append("path")
                    .attr("class", "radarStroke")
                    .attr("d", function(d,i) { return radarLine(d); })
                    .style("stroke-width", strokeWidth + "px")
                    .style("stroke", function(d,i) { return  colors[i%colorLen]; })
                    .style("fill", "none")
                    .style("filter" , "url(#glow)");

                //Append the circles
                blobWrapper.selectAll("containerId")
                    .data(function(d,i) { return d; })
                    .enter().append("circle")
                    .attr("class", "radarCircle")
                    .attr("r", dotRadius)
                    .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
                    .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
                    .style("fill", function(d,i,j) { return colors[j%colorLen]; })
                    .style("fill-opacity", 0.8);

                //create labels
                if(isShowLabel) {
                    var labHeight = 50;
                    var labRadius = 10;
                    var padding = {left: 50, right: 500, top: 130, bottom: 30};




                    //标签
                    blobWrapper.append("circle")
                        . attr("class", "radarLabel")
                        .attr("id","radarLabel")
                        .attr("r",labRadius)
                        .attr("cx", function (){
                            return w - padding.right ;
                        })
                        .attr("cy", function (d, i) {
                            return -padding.top * 2 + labHeight * i;
                        })
                        .style("fill",function(d,i){
                            return  colors[i%colorLen];
                        })
                        .style("fill-opacity", 0.8);


                    var labelText = blobWrapper
                        .append("text")
                        .attr("class","show-label")
                        .attr("id", function(d,i){
                            return "show-label_"+i;
                        })
                        .style("display", "block")
                        .attr("x", function (d) {
                            return w - padding.right * 0.95;
                        })
                        .attr("y", function (d, i) {
                            return -padding.top * 2 + labHeight * i;
                        })
                        .attr("dy", labRadius / 2)
                        .text(function (d,i) {
                            return dataname[i];
                        }) .on('mouseover', function (d,i){
                            d3.select(this)
                                .style("fill",function(){
                                    return colors[i%colorLen];
                                });

                            d3.selectAll(".radarArea").style("fill-opacity","0.1");
                            $("path#radarArea_"+i).css("fill-opacity",0.7);
                        })
                        .on('mouseout',function(d,i){
                            d3.select(this)
                                .style("fill","");
                            $("path#radarArea_"+i).css("fill-opacity",0.35);
                        });
                }


                /////////////////////////////////////////////////////////
                //////// Append invisible circles for tooltip ///////////
                /////////////////////////////////////////////////////////

                //Wrapper for the invisible circles on top
                var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
                    .data(data)
                    .enter().append("g")
                    .attr("class", "radarCircleWrapper");

                //Append a set of invisible circles on top for the mouseover pop-up
                blobCircleWrapper.selectAll(".radarInvisibleCircle")
                    .data(function(d,i) { return d; })
                    .enter().append("circle")
                    .attr("class", "radarInvisibleCircle")
                    .attr("r", dotRadius*1.5)
                    .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
                    .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
                    .style("fill", "none" )
                    .style("pointer-events", "all")
                    .on("mouseover", function(d,i,j) {
                        d3.select(this).style("fill",function(){return colors[j%colorLen]});

                        newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                        newY =  parseFloat(d3.select(this).attr('cy')) - 10;

                        tooltip
                            .attr('x', newX)
                            .attr('y', newY)
                            .text(Format(d.value))
                            .transition().duration(200)
                            .style('opacity', 1);


                    })
                    .on("mouseout", function(){
                        tooltip.transition().duration(200)
                            .style("opacity", 0);
                        d3.selectAll(".radarInvisibleCircle")
                            .style("fill","none");


                        //Bring back the hovered over blob
                        d3.selectAll(".radarInvisibleCircle")
                            .transition().duration(200)
                            .style("fill","none" );

                    });

                //Set up the small tooltip for when you hover over a circle
                var tooltip = g.append("text")
                    .attr("class", "tooltip")
                    .style("opacity", 0);


                /////////////////////////////////////////////////////////
                /////////////////// Helper Function /////////////////////
                /////////////////////////////////////////////////////////

                //Taken from http://bl.ocks.org/mbostock/7555321
                //Wraps SVG t
                function wrap(text, width) {
                    text.each(function() {
                        var text = d3.select(this),
                            words = text.text().split(/\s+/).reverse(),
                            word,
                            line = [],
                            lineNumber = 0,
                            lineHeight = 1.4, // ems
                            y = text.attr("y"),
                            x = text.attr("x"),
                            dy = parseFloat(text.attr("dy")),
                            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

                        while (word = words.pop()) {
                            line.push(word);
                            tspan.text(line.join(" "));
                            if (tspan.node().getComputedTextLength() > width) {
                                line.pop();
                                tspan.text(line.join(" "));
                                line = [word];
                                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                            }
                        }
                    });
                }//wrap



            }


        }
    };
    return ChartRadar;


})