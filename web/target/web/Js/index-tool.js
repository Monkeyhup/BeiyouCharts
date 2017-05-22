/**
 * Created by lmy on 2016/10/19.
 */
define(function(require, exports, module) {
    /**
     * 接口
     */
    var Hanlder = (function(){
        //当前的图形类型
        var _chartTypeChart = "echarts.bar.vertical.single";
        var _chartObj = null;
        var _chartConfig = null;

        var url = "json/map.json";

        /*初始化*/
        var init= function(){
            //获取模板数据
            getTemplateData();
            bindEvent();

            User.init();
            User.getUserInfo(function(){
                console.log("消息提示：获取用户信息成！");
            });
        }

        /**
         * 用户信息
         */
        var User = (function(){
            var userInfo = null;

            /**
             * 初始化数据
             */
            var init = function(){
                userInfo = null;

                //绑定事件
                bindEvent();
            };

            /**
             * 获取用户登录信息
             */
            var getUserInfo =  function(callback){
                SGIS.API.get("user/is/login").json(function(re){
                    userInfo = null;
                    if(re && re.code == 0){
                        if(re.data){
                            //保存用户信息
                            userInfo = re.data;
                        }
                    }
                    if(userInfo == null){
                        //未登录
                        /*showLoginWindow();*/
                    }else{
                        //已经登录
                        showUserInfo(userInfo.userName);
                    }
                    callback && callback(userInfo);
                });
            };

            /**
             * 展示登录窗口
             */
            var showLoginWindow = function(){
                //窗口高度
                $('#login-modal').modal("show");
                $('#login-span').removeClass("hide");
                $('#logout-span').addClass("hide");

                //删除登录名
                $("#login-name").html("");

                //判断是否保存用户名
                checkIsSaveUserLogin();
            };

            /**
             * 判断是否保存用户名
             */
            var checkIsSaveUserLogin = function(){
                var cookie = Cookie.getCookies();
                if(cookie && cookie[0]){
                    $("#login_form input[name='user_login']").val(cookie[0]);
                    $("#login_form input[type='checkbox']").attr("checked",true);
                }else{
                    $("#login_form input[name='user_login']").val("");
                    $("#login_form input[name='user_password']").val("");
                    $("#login_form input[type='checkbox']").attr("checked",false);
                }
                $("#login-modal input[name='user_login']").focus();
            };

            /**
             * 设置是否保存用户名
             *
             * @param userLogin
             */
            var setIsSaveUserLogin = function(userLogin){
                var isCheck = $("#login_form input[type='checkbox']").is(":checked");
                if(isCheck){
                    Cookie.addCookie(userLogin);
                }else{
                    Cookie.clearCookie();
                }
            };


            /**
             * 展示用户信息
             */
            var showUserInfo = function(userName){
                $('#login-span').addClass("hide");
                $('#register-span').addClass("hide");
                $('#logout-span').removeClass("hide");
                $('#login-name').html(userName || "");
                $("#my-charts-btn").removeClass("hide");
            };

            /**
             * 展示注销后
             */
            var showLogouted = function(){
                $('#login-span').removeClass("hide");
                $('#register-span').removeClass("hide");
                $('#logout-span').addClass("hide");

                //删除登录名
                $("#login-name").html("");
                $("#my-charts-btn").addClass("hide");
            };

            /**
             * 绑定事件
             */
            var bindEvent = function(){
                //登录弹出
                $("a[data-target='#login-modal']").click(function(){
                    //判断是否保存用户名
                    checkIsSaveUserLogin();
                });

                // 回车事件
                $("#login-modal input[name='user_login'],#login-modal input[name='user_password']")
                    .on("keypress", function(e) {
                        if (e.keyCode && e.keyCode == 13) {
                            //登录
                            login();
                        }
                    });

                //登录提交
                $("#login_submit").click(function(){
                    //登录
                    login();
                });

                //注销
                $("#logout-btn").click(function(){
                    logout();
                });

                //注册
                $("#register-span").click(function(){
                    var url = SGIS.Config.TOOL_MODULE_URL+"register.html";
                    window.location = url;
                })
            };

            /**
             * 判断是否登录
             */
            var checkIsLogin = function(){
                return userInfo && userInfo != null ? true : false;
            };

            /**
             * 用户登录
             */
            var login = function(){
                var $useruLogin = $("form#login_form input[name='user_login']");
                var $userPassword = $("form#login_form input[name='user_password']");
                var $loginMessage = $("form#login_form #login-message");

                var userLogin = $useruLogin.val();
                var userPassword = $userPassword.val();
                if(!userLogin || userLogin == ""){
                    $loginMessage.html("登录名不能为空！");
                    var $error = $useruLogin.parent(".field").addClass("error");
                    setTimeout(function(){
                        $error.removeClass("error");
                        $loginMessage.html("");
                        $useruLogin.focus();
                    },1500);
                    return ;
                }

                if(!userPassword || userPassword == ""){
                    $loginMessage.html("密码不能为空！");
                    var $error2 = $userPassword.parent(".field").addClass("error");
                    setTimeout(function(){
                        $error2.removeClass("error");
                        $loginMessage.html("");
                        $userPassword.focus();
                    },1500);
                    return ;
                }
                $("#login_submit").button("loading");
                SGIS.API.get("user/login").data({
                    "userLogin":userLogin,
                    "userPassword":userPassword
                }).json(function(re){
                    $("#login_submit").button("reset");
                    userInfo = null;
                    if(re && re.code == 0){
                        if(re.data){
                            //保存用户信息
                            userInfo = re.data;
                            if(userInfo != null){
                                //设置是否保存用户名
                                setIsSaveUserLogin(userInfo.userLogin);

                                //已经登录
                                showUserInfo(userInfo.userName);

                                //登录提示
                                $loginMessage.html("登录成功！");
                                setTimeout(function(){
                                    $loginMessage.html("");
                                    $('#login-modal').modal("hide");
                                },500);
                            }else{
                                $loginMessage.html("登录失败，用户名或者密码错误！");
                                setTimeout(function(){
                                    $loginMessage.html("");
                                },1500);
                            }
                        }else{
                            $loginMessage.html("登录失败，用户名或者密码错误！");
                            setTimeout(function(){
                                $loginMessage.html("");
                            },1500);
                        }
                    }else{
                        $loginMessage.html(re.message || "登录失败，用户名或者密码错误！");
                        setTimeout(function(){
                            $loginMessage.html("");
                        },1500);
                    }
                });
            };

            /**
             * 注销
             */
            var logout = function(){
                SGIS.API.get("user/logout").json(function(re){
                    if(re && re.code == 0){
                        SGIS.UI.alert("注销成功!",null,false,function(modal){
                            modal.css({
                                "top":"40%",
                                "height":"60px",
                                "width":"300px",
                                "margin-left":"-20px",
                                "overflow":"hidden",
                                "background-color":"transparent",
                                "border":"none"
                            });

                            modal.find(".content>.ui.label").css({
                                "font-size":"18px"
                            });
                        });
                        userInfo = null;
                        //展示注销后
                        showLogouted();
                    }
                });
            };

            return {
                init:init,
                getUserInfo:getUserInfo,
                checkIsLogin:checkIsLogin,
                showLoginWindow:showLoginWindow
            };
        })();

        /**
         * 绑定事件
         */

        var bindEvent = function(){
            /**
             * 可视化图类型选择
             */

            $(".btn-li").click(function (re) {
                    var picType = $(this).html();
                    $(".select-type").html(picType + '<span class="caret"></span>');
                    _chartTypeChart=re.currentTarget.id;
                    getTemplateData();
                }
            );
            //当浏览器窗口大小改变时，设置显示内容的宽度
            window.onresize=function(){
                if($("#content").width<400){
                    $("#content").parent().css('width',window.width);
                }
                getTemplateData();
            };
            //查看图库
            $("#go-gallery-btn").click(function(){
                //查看图库
                var url = SGIS.API.getURL("")+"http/";
                window.open(url, "_blank");
            });
            //制图界面
            $("#go-tool-btn").click(function(){
                //查看图库
                var url = SGIS.API.getToolURL("")+"http/";
                window.open(url, "_blank");
            });

        };

        /**
         * 取得模板数据
         */
        var getTemplateData = function(callback){
            $.getJSON(url,function(data){
                    //出图
                    var jsUrl = SGIS.Config.BASE_MODULE_URL+"/js/module/echarts/"+_chartTypeChart;
                    seajs.use([jsUrl],function(re){
                        if(re){
                            var obj = new re();
                            var height = $(window).height()/2+50;
                            var objConfig = {
                                container:'content',
                                width:$("#content").parent().width()-46,	//36->46
                                height:(height < 400) ? 400 : height,
                                data:data
                            };
                            obj.init(objConfig);
                            //保存信息
                            _chartObj = obj;
                            _chartConfig = objConfig;
                        }
                        else{
                            SGIS.UI.alert("未找到数据！该图无法显示！",
                                null,false,function(modal){
                                    modal.css({
                                        "top":"40%",
                                        "height":"60px",
                                        "width":"300px",
                                        "margin-left":"-20px",
                                        "overflow":"hidden",
                                        "background-color":"transparent",
                                        "border":"none"
                                    });

                                    modal.find(".content>.ui.label").css({
                                        "font-size":"16px"
                                    });
                                });
                        }
                        callback && callback();
                    });
            });
        };

        return {
                init:init
            };

    })();

    return Hanlder;

})
