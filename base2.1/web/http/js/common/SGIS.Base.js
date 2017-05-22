/**
 * @fileOverview
 * 后台通用脚本
 * 聪明的孩纸们会不断优化重构代码 使其变得更加易用
 * 关于重构，请参考：http://blog.jobbole.com/19371/
 */

/**
 * 后台脚本库 主命名空间
 * @namespace
 * @type 
 */
var SGIS = SGIS || {};

/**
 * 公共配置
 * @type {{BASE, BASE_NAME: string, GALLERY_NAME: string, TOOL_NAME: string, SEAJS_BASE, DhtmlxImagePath: (*|string), log: boolean}}
 */
SGIS.Config = {
    BASE:(function(){
        var loc = window.location;
        if (loc.origin){
            return loc.origin;
        }
        return loc.protocol+"//"+loc.host;
    })(),
	SERVICE_NAME:"/gallery2.1/",								//后台服务名称
    BASE_NAME:"/base2.1/",                          			//base项目名称
    GALLERY_NAME:"/gallery2.1/",                    			//gallery项目名称
    TOOL_NAME:"/tool2.1/",                          			//tool项目名称
    WEB_NAME:"/web/",                                           //web项目名称
    log : true                                      			//是否控制台输出
};

/********************************************************************************************/
//dhtmlx图片位置
SGIS.Config.DhtmlxImagePath = SGIS.Config.BASE + SGIS.Config.BASE_NAME +"http/lib/dhtmlx/";

//seajs所用的基础路径
SGIS.Config.BASE_MODULE_URL = SGIS.Config.BASE + SGIS.Config.BASE_NAME + "http/";
//seajs所用的基础路径
SGIS.Config.GALLERY_MODULE_URL = SGIS.Config.BASE + SGIS.Config.GALLERY_NAME + "http/";
//seajs所用的基础路径
SGIS.Config.GALLERY_MOBILE_URL = SGIS.Config.BASE + SGIS.Config.GALLERY_NAME + "mobile/";
//seajs所用的基础路径
SGIS.Config.TOOL_MODULE_URL = SGIS.Config.BASE + SGIS.Config.TOOL_NAME + "http/";
//seajs所用的基础路径
SGIS.Config.WEB_MODULE_URL = SGIS.Config.BASE + SGIS.Config.WEB_NAME ;
/********************************************************************************************/

/**
 * 注册命名空间
 * @param {String}	nameSpace	命名空间,多层级的可以用"点"来分割
 */
SGIS.registerNamespace = function(nameSpace) {
	var d = window, c = nameSpace.split(".");
	for (var b = 0; b < c.length; b++) {
		var e = c[b], a = d[e];
		if (!a) {
			a = d[e] = {};
			a.__namespace = true;
			a.__typeName = c.slice(0, b + 1).join(".");
		}
		d = a;
	}
};
SGIS.Log = function(msg){
	if (SGIS.Config.log && window.console){
		console.log(msg);
	}
};
SGIS.Debug = function(msg, error){
};

/**
 * 分页对象
 * @param pageNumber
 * @param pageSize
 * @constructor
 */
SGIS.PageInfo =function(pageNumber,pageSize){
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
};

SGIS.PageInfo.prototype ={
    getPageNumber:function(){
        return this.pageNumber;
    },
    getPageSize:function(){
        return this.pageSize;
    }
};

/**
 * 工具包
 * @type 
 */
SGIS.Util = {
    /**
     * http://localhost:8080
     * @returns {*}
     */
     getBaseUrl : function(){
        var loc = window.location;
        if (loc.origin){
            return loc.origin;
        }
        return loc.protocol+"//"+loc.host;
    },
    /**
	 * 获取ContextPath，工程的起始URL
	 * @example
	 *       http://localhost:7080/base/http/index.jsp
	 *       获取到
	 *       http://localhost:7080/base/
	 * @return {String}
	 */
	getLocalPath : function() {
		var location = document.location.toString();
		var contextPath = "";
		if (location.indexOf("://") != -1) {
			contextPath += location.substring(0, location.indexOf("//") + 2);
			location = location.substring(location.indexOf("//") + 2, location.length);
		}
		var index = location.indexOf("/");
		contextPath += location.substring(0, index + 1);
		location = location.substring(index + 1);
		index = location.indexOf("/");
		contextPath += location.substring(0, index + 1);
		return contextPath;
	},
	/**
	 * 获取当前页面的起始地址
     * @example
     *       http://localhost:7080/base/http/index.jsp
     *       获取到
     *       http://localhost:7080/base/http
	 * @return {String}
	 */
	getLocalHref : function(){
		var _lochref = location.href;
		var indexlast = 0;
		var rhraf = "";
		if(_lochref){
			indexlast = _lochref.lastIndexOf("/");
			if(indexlast != 0){
				rhraf = _lochref.substring(0,indexlast+1);
			}
		}
		return rhraf;
	},
	/**
	 * 从URL里获取参数对象
	 * @param {String} url （optional）
	 * @return {SGIS.Util.Hashtable}
	 */
	getParamFromURL : function(url){
		var s = url || location.href, re = new SGIS.Util.Hashtable();
		var kvs = s.split("?")[1] ? s.split("?")[1].split("&") : [];
		for (var i = 0, _sizei = kvs.length; i < _sizei; i++) {
			var o = kvs[i].split("=");
			re.add(o[0], decodeURIComponent(o[1]));
		}
		return re;
	}
};

/**
 * 字符串格式化
 * @param {String} source
 * @param {Object} opts
 * @return {String}
 */
SGIS.Util.formatString = function (source, opts) {
    source = String(source);
    var data = Array.prototype.slice.call(arguments,1), toString = Object.prototype.toString;
    if(data.length){
	    data = data.length == 1 ? 
	    	/* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
	    	(opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
	    	: data;
    	return source.replace(/\{\{(.+?)\}\}/g, function (match, key){
	    	var replacer = data[key];
	    	// chrome 下 typeof /a/ == 'function'
	    	if('[object Function]' == toString.call(replacer)){
	    		replacer = replacer(key);
	    	}
	    	return ('undefined' == typeof replacer ? '' : replacer);
    	});
    }
    return source;
};

/**
 * 哈希表
 * @class SGIS.Util.Hashtable 哈希表
 * @constructor SGIS.Util.Hashtable
 */
SGIS.Util.Hashtable = function(){
	this._hash = {};
};
SGIS.Util.Hashtable.prototype = {
	add : function(key, value) {
		if (typeof(key) != "undefined") {
			if (this.contains(key) == false) {
				this._hash[key] = typeof(value) == "undefined" ? null : value;
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

    /**
     * 有则更新，无则添加  不同于add
     * @param key
     * @param value
     * @returns {boolean}
     */
    update: function (key, value) {
       if(typeof key != "undefined"){
           this._hash[key] = typeof(value) == "undefined" ? null : value;
           return true;
       }else{
           return false;
       }
    },
	/**
	 * 移除key对应的对象
	 * @param {String} key
     * @returns {*}
     */
	remove : function(key) {
        var re = this._hash[key];
		delete this._hash[key];
        return re;
	},
	/**
	 * 获取内容个数，由于内部每次使用此方法都会进行一次遍历，所以建议在外部常用时保存临时长度变量
	 * @return {Number}
	 */
	count : function() {
		var i = 0;
		for (var k in this._hash) {
			i++;
		}
		return i;
	},
	/**
	 * 获取key值对应的对象
	 * @param {String} key
	 * @return {Object}
	 */
	items : function(key) {
		return this._hash[key];
	},
	/**
	 * 是否包含key
	 * @param {String} key
	 * @return {Boolean}
	 */
	contains : function(key) {
		return typeof(this._hash[key]) != "undefined";
	},
	/**
	 * 清空
	 */
	clear : function() {
		for (var k in this._hash) {
			delete this._hash[k];
		}
	},
	/**
	 * 获取所有的key
	 * @return {Array<String>}
	 */
	keys : function() {
		var re = [];
		for (var k in this._hash) {
			re.push(k);
		}
		return re;
	},
	/**
	 * 对每一个元素做处理
	 * @param {function(obj, key)} handler
	 */
	each : function(handler){
		if (!jQuery.isFunction(handler)){return;}
		for (var k in this._hash){
			handler(this._hash[k], k);
		}
	},
	/**
	 * 将元素放入一个Array并返回，不保证元素顺序
	 * @return {Array}
	 */
	toArray : function(){
		var re = [];
		for(var k in this._hash){
			re.push(this._hash[k]);
		}
		return re;
	},
    /**
     * 批量添加项目，使用each进行遍历处理，each(obj)需要返回一个长度为2的hash数组：[key, obj]
     * @param arr
     * @param each
     */
    addAll : function(arr, each){
        var num = arr.length;
        for (var i = 0; i < num; i++) {
            var item = each.call(this, arr[i]);
            item && this.add(item[0], item[1]);
        }
    }
};
/**
 * 根据Objects的键值对来构建hashtable
 * （仅是对象的第一层键值对）
 * @param {Object} obj
 * @return {SGIS.Util.Hashtable}
 */
SGIS.Util.Hashtable.fromObject = function (obj){
	var re = new SGIS.Util.Hashtable();
	re._hash = obj;
	return re;
};

SGIS.Util.Set = function(){
	this._hash = new SGIS.Util.Hashtable();
};
SGIS.Util.Set.prototype = {
    add : function(key){
        this._hash.add(key, true);
    },
    remove : function(key){
    	this._hash.remove(key);
    },
    count : function(){
    	return this._hash.count();
    },
    clear : function(){
    	this._hash.clear();
    },
    each : function(handler){
        for (var k in this._hash._hash){
            handler(k);
        }
    }
};

/**
 * @param 时间长整形
 */
SGIS.Time = {
	longTimeToStringTime:function(l){
		
		var time = new Date(l);
		
		var month = time.getMonth()+1;
		if(month < 10){
			month = "0"+month;
		}
		
		return time.getFullYear()+"年"+month+"月"+time.getDate()+"日";
	},
    longTimeToFullStringTime:function(l,split){
        if(!split || split == ""){
            split = " ";
        }
        var time = new Date(l);

        var month = time.getMonth()+1;
        var hour = time.getHours();
        var minus = time.getMinutes();
        var second = time.getSeconds();
        if(month < 10){
            month = "0"+month;
        }
        if(hour < 10){
            hour = "0"+hour;
        }
        if(minus < 10){
            minus = "0"+minus;
        }
        if(second < 10){
            second = "0"+second;
        }

        return time.getFullYear()+"-"+month+"-"+time.getDate()
            + split + hour + ":" + minus + ":" + second;
    }
};

///**
//* 提供两个函数节流方法，摘自underscore
//* http://www.css88.com/archives/4728
//* http://www.cnblogs.com/gumutianqi/archive/2011/09/28/2194513.html
//*/
(function(){

    var _now = function(){
        return Date.now || function() { return new Date().getTime(); };
    };

    /**
     * 多用于Resize事件。
     * 用户在拖动时，每两次查询的间隔不少于500毫秒，如果用户拖动了1秒钟，这可能会触发200次onscroll事件，但我们最多只进行2次查询。
     * @param func
     * @param wait
     * @param options
     * @returns {Function}
     */
    SGIS.Util.throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function() {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            context = args = null;
        };
        return function() {
            var now = _now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    /**
     * 多用于输入框自动提示
     * 用户会暂时停止输入，于是我们决定在用户暂停输入200毫秒后再进行查询（如果用户在不断地输入内容，那么我们认为他可能很明确自己想要的关键字，所以等一等再提示他）
     * @param func
     * @param wait
     * @param immediate
     * @returns {Function}
     */
    SGIS.Util.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function() {
            var last = _now() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        };

        return function() {
            context = this;
            args = arguments;
            timestamp = _now();
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    };
})();

(function(){
	// By default, Underscore uses ERB-style template delimiters, change the
	// following template settings to use alternative delimiters.
	var templateSettings = {
		evaluate: /\{%([\s\S]+?)%\}/g,
		interpolate: /\{\{(.+?)\}\}/g,
		escape: /\{\{-([\s\S]+?)\}\}/g
	};

	// When customizing `templateSettings`, if you don't want to define an
	// interpolation, evaluation or escaping regex, we need one that is
	// guaranteed not to match.
	var noMatch = /(.)^/;

	// Certain characters need to be escaped so that they can be put into a
	// string literal.
	var escapes = {
		"'": "'",
		'\\': '\\',
		'\r': 'r',
		'\n': 'n',
		'\t': 't',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

	// JavaScript micro-templating, similar to John Resig's implementation.
	// Underscore templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.
	SGIS.Util.template = function(text, data, settings) {
		var render;
		settings = $.extend({}, settings, templateSettings);

		// Combine delimiters into one regular expression via alternation.
		var matcher = new RegExp([
		(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

		// Compile the template source, escaping string literals appropriately.
		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset)
				.replace(escaper, function(match) {
				return '\\' + escapes[match];
			});

			if (escape) {
				source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
			}
			if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			}
			if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='";
			}
			index = offset + match.length;
			return match;
		});
		source += "';\n";

		// If a variable is not specified, place data values in local scope.
		if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

		source = "var __t,__p='',__j=Array.prototype.join," +
			"print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";

		try {
			render = new Function(settings.variable || 'obj', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		if (data) return render(data);
		var template = function(data) {
			return render.call(this, data);
		};

		// Provide the compiled function source as a convenience for precompilation.
		template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

		return template;
	};
})();

/**
 * 公用API请求方法
 * WEB地址
 */
;(function(){
	/**
	 * 基本url:如http://localhost
	 */
	var BASE = SGIS.Config.BASE;
	/**
	 * 后台数据服务名:如/gallery/
	 */
    var SERVICE_NAME = SGIS.Config.SERVICE_NAME;
    var GALLERY_NAME = SGIS.Config.GALLERY_NAME;
    var TOOL_NAME = SGIS.Config.TOOL_NAME;
    var WEB_NAME = SGIS.Config.WEB_NAME;
    /**
     * 请求类
     * @param api
     * @constructor
     */
    var Req = function(api){
    	this.api = api;
        this.method = "GET";
        this.dataType = "json";
        this._data = null;
        this._stringify = null;
        this.contentType = null;
        this._debug = false;
    };
    Req.prototype = {
        _method : function(method){
            this.method = method;
        	return this;
        },
        data : function(data){
            if ($.type(data) == "string"){
                //接受JSON.stringify后的数据
                this.contentType = "application/json";
                this._stringify = data;
            }else{
        	    this._data = data;
            }

            return this;
        },
        json : function(callback,errorCallback){
            _go(this, callback,errorCallback);
        },
        xml : function(callback,errorCallback){
        	this.dataType = "xml";
            _go(this, callback,errorCallback);
        },
        text : function(callback,errorCallback){
        	this.dataType = "text";
            _go(this, callback,errorCallback);
        },
        debug : function(){
            this._debug = true;
        	return this;
        }
    };

    /**
     * ajax 请求
     * @param req
     * @param callback
     * @param errorCallback
     * @private
     */
    var _go = function(req,callback,errorCallback){
        var ajax = {
            url :BASE + SERVICE_NAME + req.api + "?_method=" + req.method,
            type : "POST",
            data : req._data,
            dataType : req.dataType,
            success: function (re) {
                callback && callback(re);
            },
            error : function(re){
                SGIS.Debug("API请求出错");
                errorCallback && errorCallback(re);
            }
        };
        if (req.contentType){
            ajax.contentType = req.contentType;
            ajax.url += req._data ? ("&" + $.param(req._data)) : "";//兼容JSON参数
            ajax.data = req._stringify;                             //string参数
        }
        if (req._debug){
            alert(ajax.url+" "+ajax.type);
        }
        $.ajax(ajax);
    };

    /**
     * 创建请求对象
     *
     * @param args
     * @returns {Req}
     */
    var createReq = function(args){
        var url = args[0].replace(/\./g, "/");
        var data = Array.prototype.slice.call(args,1);
        if (data.length){
            var i = 0;
            url = url.replace(/\?/g, function(){
                return data[i++];
            });
        }
        return new Req(url);
    };

    /**
     * 将Rest请求包装了下，不用关心路径、字符串拼装、调试参数等
     * @type {{get: get, post: post, del: del, put: put}}
     */
    SGIS.API = {
        get : function(url){
        	return createReq(arguments)._method("GET");
        },
        post : function(url){
            return createReq(arguments)._method("POST");
        },
        del : function(url){
            return createReq(arguments)._method("DELETE");
        },
        put : function(url){
            return createReq(arguments)._method("PUT");
        },
        getURL : function(url){
        	return BASE + SERVICE_NAME +createReq(arguments).api;  //后台数据服务完整URL
        },
        getGalleryURL : function(url){
            return BASE + GALLERY_NAME +createReq(arguments).api;  //后台数据服务完整URL
        },
        getToolURL : function(url){
            return BASE + TOOL_NAME +createReq(arguments).api;  //后台数据服务完整URL
        },
        getWebURL : function(url){
            return BASE + WEB_NAME +createReq(arguments).api;  //后台数据服务完整URL
        }
    };
})();

;(function(){
	//默认的临时树节点标记
	var DEFAULT_TEMP = "load";
    /**
     * 构建树
     * @param container
     * @param actions
     * @param lazyCall
     * @returns {dhtmlXTreeObject}
     */
	var create = function(container, actions, lazyCall){
		actions = actions || {};
		var tree = new dhtmlXTreeObject(container, "100%", "100%", "tree0");
		tree.enableDragAndDrop("temporary_disabled");
		tree.setImagePath(SGIS.Config.DhtmlxImagePath+"imgs/csh_vista/");
		tree.setOnDblClickHandler(actions.onDbClick || $.noop);
		tree.setOnCheckHandler(actions.onCheck || $.noop);
		tree.attachEvent("onClick", typeof(actions) == "function" ? actions : (actions.onClick || $.noop));
		if (lazyCall){
			tree.__lazyCall = lazyCall;
			tree.setOnOpenEndHandler(function(id){
				var _req = tree.__lazyCall.call(tree, tree, id);
				_openEnd.apply(tree, [_req, id, tree]);
			});
		}
		return tree;
	};
	var loadXml = function(dhxO, xml){
		try{
			dhxO.loadXMLString(xml);
		}catch(e){
			SGIS.Log(e);
		}
	};
	//打开Node时调用方法，如果该节点未被加载，则去请求子节点，请求子节点结束后会触发onLoadEnd事件
	var _openEnd = function(req, id, _tree){
		var isLoaded = _tree.getSubItems(id).indexOf(DEFAULT_TEMP) < 0;
		var hasMoreChild = _tree.hasChildren(id) > 1;
		// 如当前节点已展开过，则终止
		if (hasMoreChild || isLoaded) {
			return;
		} else {
			_tree.loadXML(req);
			// 保证当前节点前+号（可展开），展开时删除默认的Loading子节点。
			_tree.deleteChildItems(id);
		}
	};

	/**
	 * 快速构建树
	 * @type 
	 */
	SGIS.Tree = {
		/**
		 * 构建树
		 * @param {String} container
		 * @param {String} xml
		 * @param {Object|Function} actions	事件map，或者可以直接给定onClick事件
		 * @param {Function} lazyCall 动态加载树所需的请求构造函数(tree, id)
		 * @return {dhtmlXTreeObject}
		 * 
		 */
		create : function(container, xml, actions, lazyCall){
			var tree = create(container, actions, lazyCall);
			loadXml(tree, xml);
			return tree;
		},
		/**
		 * 构建一个checkbox树
		 * @param {String} container 所属元素
		 * @param {String} xml 树节点数据
		 * @param {Object} actions 动作事件
		 * @param {Function} lazyCall 动态加载树所需的请求构造函数(tree, id)
		 * @return {dhtmlXTreeObject}
		 */
		createCheckableTree : function(container, xml, actions, lazyCall){
			var tree = create(container, actions, lazyCall);
			tree.enableCheckBoxes(1);
			tree.enableThreeStateCheckboxes(true);
			loadXml(tree, xml);
			return tree;
		}
	};
	
})();

;(function(){
	SGIS.Grid = {
		/**
		 * 构建表格，返回一个未初始化的表格
		 * @param {String} container
		 * @return {dhtmlXGridObject}
		 */
		create : function(container){
			var grid = new dhtmlXGridObject(container);
			grid.setImagePath(SGIS.Config.DhtmlxImagePath+"imgs/");//图片路径
			grid.setSkin("dhx_skyblue");//皮肤样式
			grid.setEditable(false);
			return grid;
		}
	};
})();

SGIS.registerNamespace("SGIS.UI");

/**
 * semantic 警告or提示框
 */
(function () {
    var timeObj;
    var _getNode = function () {
        var obj = "<div class='ui small modal alert' style='top:40%;left:38%; width: 260px;background-color: #F4F4F4'>" +
                  "</div>";
        return obj;
    };

    var _getContent = function (info,type,withclose) {
        var iscp = "none";
        var color = " blue";
        if(type){
            //不同类型，提示信息颜色不同
            switch (type){
                case "success":
                    color = " blue";
                    break;
                case "dange":
                    color = " red";
                    break;
                case "warn":
                    color = " orange";
                    break;
                default:
                    color = " blue";
            }
        }
        if(typeof withclose =="boolean" && withclose){
            iscp = "block";//显示关闭按钮
        }
        var obj =  " " +
            "        <div class='header' style='border-bottom:0;padding: 1px;display: "+ iscp+"'>       " +
            "          <small class='ui label'></small>  "+
            "          <i style='float: right;cursor:pointer;' class='remove sign icon'></i>                  " +
            "        </div>                     " +
            "        <div class='content' style='padding: 10px 5px 20px 5px;border:0;box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0)'>      " +
            "          <div style='width: 100%;border:0;' class='ui label "+ color+" '>" +
                         info +
            "          </div>                  " +
            "        </div>                  ";
        return obj;
    };
    //绑定关闭
    var bindClose = function () {
       top.$("body .ui.small.modal.alert i").bind("click", function () {
           closeBtn();
       });
    };
    /**
     * 关闭
     */
    var closeBtn = function(){
        top.$("body .ui.small.modal.alert").hide();
        top.$("body .ui.small.modal.alert").empty();
        top.$("body .ui.small.modal.alert").remove();
    };


    /**
     * 自动弹出&关闭信息提示框
     * @param info 提示信息
     * @param type （‘success’:成功、‘dange’:提示、‘warn’:错误）控制提示信息颜色
     * @param withclose (false:自动、true:手动)是否手动关闭
     * @param callback 回调方法
     * */
    SGIS.UI.alert = function (info, type, withclose,callback) {
        if(top.$("body .ui.small.modal.alert").length<1){
            top.$("body").append(_getNode());
        }else{
            top.$("body .ui.small.modal.alert").attr("style",
                "top:40%;left:38%; width: 260px;background-color: #F4F4F4;");
        }
        var modal = top.$("body .ui.small.modal.alert");
        modal.empty();
        modal.append(_getContent(info,type,withclose));
        modal.css("margin-left","0");//居中有效
        modal.show();
        bindClose();

        callback && callback(modal,closeBtn);

        if(timeObj){
            window.clearTimeout(timeObj);
        }
        if(typeof  withclose =="boolean" && withclose){

        }else {
            timeObj = setTimeout(function () {
                window.clearTimeout(timeObj);
                //3秒自动关闭
                top.$("body .ui.small.modal.alert").hide();
            },3000);
        }
    };

})();

(function(){
    /**
     * 注册一个屏幕
     *
     * @type {{}}
     */
    SGIS.SCREEN = SGIS.SCREEN || {};

    /**
     * 获取屏幕宽度 这里不用window.screen.availWidth,避免iphone下的错误而且安卓下,screen的width为分辨率宽度
     * @returns {*}
     */
    SGIS.SCREEN.getWindowScreenWidth = function(){
        var xWidth = null;
        if (window.innerWidth != null) {
            xWidth = window.innerWidth;
        } else {
            xWidth = document.body.clientWidth;
        }
        return xWidth;
    };

    /**
     * 获取屏幕高度 这里不用window.screen.availWidth,避免iphone下的错误而且安卓下,screen的width为分辨率宽度
     * @returns {*}
     */
    SGIS.SCREEN.getWindowScreenHeight = function(){
        var yHeight = null;
        if (window.innerHeight != null) {
            yHeight = window.innerHeight;
        } else {
            yHeight = document.body.clientHeight;
        }
        return yHeight;
    };

})();


/*
 * http://www.JSON.org/json2.js
 2011-02-23
 Public Domain.
 See http://www.JSON.org/js.html
 */
(function(){
    if (window.JSON)
        return;
    window.JSON={};
    function f(n){return n<10?"0"+n:n;}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){SGIS.Debug("JSON.stringify Exception")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}SGIS.Debug("JSON.parse Exception")}}
}());


(function() {
    // 禁用键盘某些按键
    var disableKeys = function(eve) {
        var ev = (document.all) ? window.event : eve;
        var evCode = (document.all) ? ev.keyCode : ev.which;
        var srcElement = (document.all) ? ev.srcElement : ev.target;
        // Backspace
        if (srcElement.type != "textarea" && srcElement.type != "text") {
            if (evCode == 8) {
                return false;
            }
        }
    };
    (document.all) ? (document.onkeydown = disableKeys) : (document.onkeypress = disableKeys);

    //禁用选中拖拽
    window.document.onselectstart = function() {
        return false;
    };

    //原生方法扩展
    Array.prototype.remove = function(dx){
        if(isNaN(dx)||dx<0||dx>this.length-1){return;};
        this.splice(dx,1);
    };
})();