/**
 * 初始化
 */
$(function(){
    //是否开启自动播放
    var GLABAB_IS_AUTO_PLAY = true;

    //是否播放声音
    var GLABAB_IS_PLAY_RADIO = true;

    //是否显示左下角的控件（回到首页、上一个、下一个）
    var GLABAB_IS_DISPLAY_CONTROLL = false;

/*********************旧版时间开始（备份）******************************
    //全局的播放时间配置
    var GLABAB_AUTO_PLAY_TIME_CONFIG = {
        "defaultTime":5000,
        "step-1":2000,
        "step-2":3000,
        "step-8":2000,
        "step-9":3000,
        "step-10":3000,
        "step-11":3000,
        "step-12":3000,
        "step-13":3000,
        "step-temp-1":5000,
        "step-temp-2":3000,
        "step-temp-2-1":5000,
        "step-temp-3":3000,
        "step-temp-4-1":10000,
        "step-14-01":3000,
        "step-14":3000,
        "step-15":3000,
        "step-16":5000,
        "step-18":5000,
        "step-20":5000,
        "step-temp-9":8000,
        "step-temp-8":8000,
        "step-3":3000,
        "step-4":3000,
        "step5":3000,
        "step5-01":5000,
        "step-6":3000,
        "step-6-01":5000,
        "step-7":6000,
        "step-7-1":5000,
        "step-22":5000,
        "step-temp-10":6000,
        "step-temp-11":2000,
        "step-temp-11-1":5000,
        "step-23":3000,
        "step-23-1":5000,
        "step-24":3000
    };
******************************旧版时间结束************************************/

/*************************新版时间开始********************************/
    //全局的播放时间配置
    var GLABAB_AUTO_PLAY_TIME_CONFIG = {
        "defaultTime":5000,
        "step-1":2000,
        "step-2":4000,
        "step-8":2000,
        "step-9":3000,
        "step-10":8000,
        "step-11":8000,
        "step-12":10000,
        "step-13":7000,
        "step-temp-1":3000,
        "step-temp-2":3000,
        "step-temp-2-1":5000,
        "step-temp-3":3000,
        "step-temp-4-1":10000,
        "step-14-01":3000,
        "step-14":3000,
        "step-15":3000,
        "step-16":5000,
        "step-18":5000,
        "step-20":4000,
        "step-temp-9":11000,
        "step-temp-8":8000,
        "step-3":4000,
        "step-4":1000,
        "step5":2000,
        "step5-01":2000,
        "step-6":2000,
        "step-6-01":2000,
        "step-7":6000,
        "step-7-1":5000,
        "step-22":5000,
        "step-temp-10":6000,
        "step-temp-11":2000,
        "step-temp-11-1":7000,
        "step-23":3000,
        "step-23-1":15000,
        "step-24":5000
    };
/*************************新版时间结束********************************/

    /**
     * 取得当前的播放延时时间
     *
     * @param impressTime
     */
    var getCurrentAutoPlayTime = function(impressTime){
        if(!impressTime || impressTime == ""){
            //console.log("默认时间，id="+impressTime+";时间="+GLABAB_AUTO_PLAY_TIME_CONFIG.defaultTime);
            return GLABAB_AUTO_PLAY_TIME_CONFIG.defaultTime;
        }
        var time = GLABAB_AUTO_PLAY_TIME_CONFIG[impressTime];
        if(time > 0){
            //console.log("配置时间，id="+impressTime+";时间="+time);
            return time;
        }else{
            //console.log("没有配置时间，id="+impressTime+";时间="+GLABAB_AUTO_PLAY_TIME_CONFIG.defaultTime);
            return GLABAB_AUTO_PLAY_TIME_CONFIG.defaultTime;
        }
    };


    //save is move
	var _timeOutObj = null;
    var _audio = null;
    var _isPlayAudio = false;

	/**
	 * 界面操作
	 *
	 * @type {{resize}}
	 */
	var UI = (function(){
		var resize = SGIS.Util.throttle(function(){
			var h = $(window).height();
			var $body = $("body");
            $("body").height(h);
			$("#div_impress_container").height(h).width($body.width());
		}, 200);

		$(window).resize(resize);

		return {
			resize : resize
		}
	})();//UI end

	/**
	 * 初始化地图
	 */
	(function() {
        var _isInit = false;
		UI.resize();
        init();


        function init(){
            if(GLABAB_IS_DISPLAY_CONTROLL){
                $("#tool").removeClass("hide");
            }else{
                $("#tool").addClass("hide");
            }

            loadWavFile(function(re){
                if(_isInit){
                    return ;
                }

                if ("ontouchstart" in document.documentElement) {
                    document.querySelector(".hint").innerHTML = "<p>使用左右键导航</p>";
                }
                //初始化impress
                impress().init(impressCallback);
                //绑定事件
                bindEvent();
//
//                if(GLABAB_IS_AUTO_PLAY){
//                    //5s后播放下一个
//                    _timeOutObj = window.setTimeout(function(){
//                        if(!_isPlayAudio && _audio){
//                            _audio.play();
//                            _isPlayAudio = true;
//                        }
//
//                        impress().next();
//                    },getCurrentAutoPlayTime());
//                }

                _isInit = true;
            });
        };

        /**
         * 加载音频文件
         *
         * @param callback
         */
        function loadWavFile(callback){
            try {
                //Shortcut which doesn't work in Chrome (always returns ""); pass through
                // if "maybe" to do asynchronous check by loading MP3 data: URI
                _audio = document.getElementById("my-radio");
                if(_audio.canPlayType('audio/mp3') == "probably"){
                    //If this event fires, then MP3s can be played
                    _audio.addEventListener('canplaythrough', function(e){
                        callback(true,_audio);
                    }, false);

                    //If this is fired, then client can't play MP3s
                    _audio.addEventListener('error', function(e){
                        callback(false, null,this.error)
                    }, false);

                    //Smallest base64-encoded MP3 I could come up with (<0.000001 seconds long)
                    _audio.src = "data/quan.MP3";
                    _audio.load();
                }else{
                    callback(false,null,"无法播放音频文件！");
                }
            }catch(e){
                callback(false,null,e);
            }
        }

		/**
		 * 幻灯片回调行数
		 * @param activeStep
		 * 				当前的步骤
		 * @param target
		 * 				当前的步骤目标参数
		 */
		function impressCallback(activeStep,target){
			//播放旋转图
			if(activeStep.id == "step-temp-4-1" || activeStep.id == "step-7-1"){
				if(activeStep.id == "step-temp-4-1"){
					//step-temp-4-1
					var iframe = document.getElementById("step-temp-4-1-iframe");
					if(iframe){
						if(typeof iframe.contentWindow == "object"){
							var obj = iframe.contentWindow.document.getElementById("play_icon");
							if(obj){
								if(obj.getAttribute("data-value") == 1){
									obj.click();
								}
							}else{
								setTimeout(function(){
									obj = iframe.contentWindow.document.getElementById("play_icon");
									if(obj){
										if(obj.getAttribute("data-value") == 1){
											obj.click();
										}
									}
								},2000);
							}
						}
					}
					
					//恢复step-7-1
					var iframe2 = document.getElementById("step-7-1-iframe");
					if(iframe2){
						if(typeof iframe2.contentWindow == "object"){
							var obj = iframe2.contentWindow.document.getElementById("play_icon");
							if(obj){
								if(obj.getAttribute("data-value") != 1){
									obj.click();
								}
							}else{
								setTimeout(function(){
									obj = iframe2.contentWindow.document.getElementById("play_icon");
									if(obj){
										if(obj.getAttribute("data-value") != 1){
											obj.click();
										}
									}
								},2000);
							}
						}
					}
				}else{
					//step-7-1
					var iframe = document.getElementById("step-7-1-iframe");
					if(iframe){
						if(typeof iframe.contentWindow == "object"){
							var obj = iframe.contentWindow.document.getElementById("play_icon");
							if(obj){
								if(obj.getAttribute("data-value") == 1){
									obj.click();
								}
							}else{
								setTimeout(function(){
									obj = iframe.contentWindow.document.getElementById("play_icon");
									if(obj){
										if(obj.getAttribute("data-value") == 1){
											obj.click();
										}
									}
								},2000);
							}
						}
					}
					
					//恢复step-temp-4-1
					var iframe2 = document.getElementById("step-temp-4-1-iframe");
					if(iframe2){
						if(typeof iframe2.contentWindow == "object"){
							var obj = iframe2.contentWindow.document.getElementById("play_icon");
							if(obj){
								if(obj.getAttribute("data-value") != 1){
									obj.click();
								}
							}else{
								setTimeout(function(){
									obj = iframe2.contentWindow.document.getElementById("play_icon");
									if(obj){
										if(obj.getAttribute("data-value") != 1){
											obj.click();
										}
									}
								},2000);
							}
						}
					}
				}
			}else{
				//恢复step-temp-4-1
				var iframe1 = document.getElementById("step-temp-4-1-iframe");
				if(iframe1){
					if(typeof iframe1.contentWindow == "object"){
						var obj = iframe1.contentWindow.document.getElementById("play_icon");
						if(obj){
							if(obj.getAttribute("data-value") != 1){
								obj.click();
							}
						}else{
							setTimeout(function(){
								obj = iframe1.contentWindow.document.getElementById("play_icon");
								if(obj){
									if(obj.getAttribute("data-value") != 1){
										obj.click();
									}
								}
							},2000);
						}
					}
				}
				
				//恢复step-7-1
				var iframe3 = document.getElementById("step-7-1-iframe");
				if(iframe3){
					if(typeof iframe3.contentWindow == "object"){
						var obj = iframe3.contentWindow.document.getElementById("play_icon");
						if(obj){
							if(obj.getAttribute("data-value") != 1){
								obj.click();
							}
						}else{
							setTimeout(function(){
								obj = iframe3.contentWindow.document.getElementById("play_icon");
								if(obj){
									if(obj.getAttribute("data-value") != 1){
										obj.click();
									}
								}
							},2000);
						}
					}
				}
			}
            if(GLABAB_IS_AUTO_PLAY){
                //播放到最后一个
                window.clearTimeout(_timeOutObj);
                if(activeStep.id == "step-24"){
                    //5s后播放下一个
                    _timeOutObj = window.setTimeout(function(){
                        //播放到最后一个
                        window.clearTimeout(_timeOutObj);
                        impress().goto(document.getElementById('overview'));

                        if(GLABAB_IS_PLAY_RADIO){
                            //重投播放
                            if(_isPlayAudio && _audio){
                                _audio.currentTime = 0;
                                _audio.pause();
                                _isPlayAudio = false;
                            }
                        }
                    },getCurrentAutoPlayTime('step-24'));
                }else{

                    if(activeStep.id == "step-14-01"
                        || activeStep.id == "step-22"
                        || activeStep.id == "step-23"){
                        if(!_isPlayAudio && _audio){
                            _audio.play();
                            _isPlayAudio = true;
                        }
                    }

                    //延时后播放下一个
                    _timeOutObj = window.setTimeout(function(){
                        if(GLABAB_IS_PLAY_RADIO){
                            //重太阳开始播放
                            if(activeStep.id == "overview"){
                                if(!_isPlayAudio && _audio){
                                    _audio.play();
                                    _isPlayAudio = true;
                                }
                            }else if(activeStep.id == "step-temp-3"){
                                if(_isPlayAudio && _audio){
                                    setTimeout(function(){
                                        _audio.pause();
                                        _isPlayAudio = false;
                                    },1300);
                                }
                            }else if(activeStep.id == "step-6-01"){
                                if(_isPlayAudio && _audio){
                                    setTimeout(function(){
                                        _audio.pause();
                                        _isPlayAudio = false;
                                    },9500);
                                }
                            }else if(activeStep.id == "step-temp-11-1"){
//                                if(_isPlayAudio && _audio){
//                                    setTimeout(function(){
//                                        _audio.pause();
//                                        _isPlayAudio = false;
//                                    },2400);
//                                }
                            }
                        }

                        //播放到最后一个
                        window.clearTimeout(_timeOutObj);
                        impress().next();
                    },getCurrentAutoPlayTime(activeStep.id));
                }


                //
            }
		}

		/**
		 * 动态加载js文件
		 * @callback
		 * 		加载成功后回调
		 */
		function loadJs(callback){
			var body = document.body;
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "lib/impress/impress.new.js";
			body.appendChild(script);
			//判断服务器
			if (navigator.userAgent.indexOf("IE") >= 0) {
				//IE下的事件
				script.onreadystatechange = function () {
					//IE下的判断，判断是否加载完成
					if (script && (script.readyState == "loaded"
						|| script.readyState == "complete")) {
						script.onreadystatechange = null;
						callback && callback(script);
					}
				};
			}else {
				//其他浏览器的加载完毕
				script.onload = function () {
					script.onload = null;
					callback && callback(script);
				};
			}
		}

		/**
		 * 绑定事件
		 */
		function bindEvent(){
			/**
			 * 样式1
			 */
			$('.first.circle').circleProgress({
				startAngle: 0,
				animationStartValue: 0.1,
				//animation: false,
				value: 1,
				size: 780,			//半径大小780
				thickness: 30,		//环厚度
				fill: { gradient: [['#220231', .7], ['#EA05C2', .2]], gradientAngle: -Math.PI/2-3}
			});

			/**
			 * 样式1
			 */
			$('.first-middle.circle').circleProgress({
				startAngle: 0,
				animationStartValue: 0.1,
				animation: false,
				value: 1,
				size: 160,			//半径大小780
				thickness: 10,		//环厚度
				fill: { gradient: [['#220231', .7], ['#EA05C2', .2]], gradientAngle: -Math.PI/2-3}
			});

			/**
			 * 样式1
			 */
			$('.first-small.circle').circleProgress({
				startAngle: 0,
				animationStartValue: 0.1,
				animation: false,
				value: 1,
				size: 120,			//半径大小780
				thickness: 8,		//环厚度
				fill: { gradient: [['#220231', .7], ['#EA05C2', .2]], gradientAngle: -Math.PI/2-3}
			});

			/**
			 * 样式1
			 */
			$('.first-smaller.circle').circleProgress({
				startAngle: 0,
				animationStartValue: 0.1,
				animation: false,
				value: 1,
				size: 80,			//半径大小780
				thickness: 8,		//环厚度
				fill: { gradient: [['#220231', .7], ['#EA05C2', .2]], gradientAngle: -Math.PI/2-3}
			});

			/**
			 * 样式1
			 */
			$('.first-inner.circle').circleProgress({
				startAngle: 0,
				animationStartValue: 0.1,
				animation: false,
				value: 1,
				size: 500,			//半径大小780
				thickness: 20,		//环厚度
				fill: { gradient: [['#220231', .7], ['#EA05C2', .2]], gradientAngle: -Math.PI/2-3}
			});


			/**
			 * 样式2
			 */
			$('.two.circle').circleProgress({
				startAngle: 0,
				animationStartValue: 0.1,
				//animation: false,
				value: 1,
				size: 780,			//半径大小780
				thickness: 30,		//环厚度
				fill: { gradient: [['#35AFA9', .7], ['#35AFA9', .2]], gradientAngle: -Math.PI/2-3}
			});

			/**
			 * 样式2
			 */
			$('.two-normal.circle').circleProgress({
				startAngle: 0,
				animationStartValue: 0.1,
				//animation: false,
				value: 1,
				size: 780,			//半径大小780
				thickness: 50,		//环厚度
				fill: { gradient: [['#35AFA9', .7], ['#35AFA9', .2]], gradientAngle: -Math.PI/2-3}
			});

			/**
			 * 样式2-big
			 */
			$('.two-big.circle').circleProgress({
				startAngle: 0,
				animationStartValue: 0.1,
				//animation: false,
				value: 1,
				size: 870,			//半径大小780
				thickness: 90,		//环厚度
				fill: { gradient: [['#35AFA9', .7], ['#35AFA9', .2]], gradientAngle: -Math.PI/2-3}
			});

			/**
			 * 样式2-big2
			 */
			$('.two-middle.circle').circleProgress({
				startAngle: 0,
				animationStartValue: 0.1,
				value: 1,
				size: 840,			//半径大小780
				thickness: 90,		//环厚度
				fill: { gradient: [['#35AFA9', .7], ['#35AFA9', .2]], gradientAngle: -Math.PI/2-3}
			});

			/**
			 * 样式1事件
			 */
			$('.first.circle').on("mouseover",function(){
				var $this = $(this);
				var $step = $this.parent(".step");

				var thickness = 35;
				if($step.hasClass("active")){
					thickness = 31;
				}
				$this.circleProgress({
					thickness: thickness,		//环厚度
					animation: false,
					fill: { gradient: [['#220231', .9], ['#EA05C2', .1]], gradientAngle: -Math.PI/2-3}
				});
			}).on("mouseout",function(){
				var $this = $(this);
				$this.circleProgress({
					thickness: 30,		//环厚度
					fill: { gradient: [['#220231', .9], ['#EA05C2', .1]], gradientAngle: -Math.PI/2-3}
				})
			});
			/**
			 * 绑定窗口
			 */
			$("body:not(.step)").on("click",function(e){
				window.clearTimeout(_timeOutObj);
				if(window.location.hash != "#/overview"){
					impress().goto(document.getElementById('overview'));
				}
			});

			/**
			 * 控件操作
			 */
			$("#tool>div").on("click",function(e){
				//阻止冒泡
				e.stopPropagation();

				var value = $(this).attr("data-value");
				switch (value){
					case "refresh":
						window.clearTimeout(_timeOutObj);
						impress().goto(document.getElementById('overview'));
                        if(GLABAB_IS_PLAY_RADIO){
                            //重投播放
                            if(_isPlayAudio && _audio){
                                _audio.currentTime = 0;
                                _audio.pause();
                                _isPlayAudio = false;
                            }
                        }
						break;
					case "pre":
						window.clearTimeout(_timeOutObj);
						impress().prev();
						break;
					case "next":
						window.clearTimeout(_timeOutObj);
						impress().next();
						break;
				}
			});


			var refreshObj = $("#tool").find(">div.refresh")[0];
			if(refreshObj){
				refreshObj.addEventListener("touchstart", function ( event ) {
					//阻止冒泡
					event.stopPropagation();
					if (event.touches.length === 1) {
						window.clearTimeout(_timeOutObj);
						impress().goto(document.getElementById('overview'));
					}
				}, false);
			}//end if


			var preObj = $("#tool").find(">div.pre")[0];
			if(preObj){
				preObj.addEventListener("touchstart", function ( event ) {
					//阻止冒泡
					event.stopPropagation();
					if (event.touches.length === 1) {
						window.clearTimeout(_timeOutObj);
						impress().prev();
					}
				}, false);
			}//end if

			var nextObj = $("#tool").find(">div.next")[0];
			if(nextObj){
				nextObj.addEventListener("touchstart", function ( event ) {
					//阻止冒泡
					event.stopPropagation();
					if (event.touches.length === 1) {
						window.clearTimeout(_timeOutObj);
						impress().next();
					}
				}, false);
			}//end if

		}
	})();
});