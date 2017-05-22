
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
		d = a
	}
};

SGIS.Log = function(msg){
	if (true){
		console.log(msg);
	}
};
SGIS.Debug = function(msg, error){
	
};

/**
 * 工具包
 * @type 
 */
SGIS.Util = {
	/**
	 * 获取ContextPath，工程的起始URL
	 * @example
	 * http://172.13.12.204:7080/bsm/page/index.jsp
	 * 获取到
	 * http://172.13.12.204:7080/bsm/
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
	 * http://172.13.12.204:7080/bsm/page/index.jsp
	 * 获取到
	 * http://172.13.12.204:7080/bsm/page/
	 * @return {String}
	 */
	getLocalhref : function(){
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
	 * 移除key对应的对象
	 * @param {String} key
	 */
	remove : function(key) {
		delete this._hash[key];
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
	re._hash = obj
	return re;
};

/**
 * 函数节流，参考如下：
 * 	http://www.cnblogs.com/gumutianqi/archive/2011/09/28/2194513.html
 * @param {Function} fn
 * @param {Number} delay
 * @return {Function}
 */
SGIS.Util.throttle = function(fn, delay) {
	var timer = null;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function() {
					fn.apply(context, args);
				}, delay ? delay : 200);
	};
};

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
 * 命令提交，数据交互<br/>
 * 基于jQuery的Ajax请求
 * 加入RSA等双向密钥机制, 发送的请求都需要加密请求, 防止客户端人为修改请求(暂时无)
 * @static
 * @namespace
 */
SGIS.Ajax = {
	/**基础URL*/
	BASE : SGIS.Util.getLocalPath()+"CommonHandler.do?",
	/**
	 * 获取URL字符串
	 * @param {String} action 请求
	 * @param {Object} args 参数
	 * @return {String}
	 */
	getUrl : function(action, args){
		var re = [];
		re.push(this.BASE + "command=" + action);
		if (args && jQuery.isPlainObject(args)){
			for(var key in args){
				if (jQuery.isFunction(args[key])){
					re.push(key + "=" + args[key].call());
				}else{
					re.push(key + "=" + args[key].toString());
				}
			}
		}
		re.push("sgis.t="+new Date().getTime());
		re.push("sgis.m="+top.currentModel);
		return re.join("&");
	}
};

/**
 * 界面操作
 * @type 
 */
SGIS.UI = {
	windowResize : function(){
		
	},
	/**
	 * 打开模态窗口
	 * @param {String} pageUrl
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Object} args（optional）
	 */
	openWindow : function(pageUrl, width, height, args){
		var url = pageUrl, sFeatures = 'dialogWidth={{width}}px;dialogHeight={{height}}px;scroll=no;status=no;resizable=no;';
		url += args ? "?"+$.param(args) : "";
		window.showModalDialog(url, self, SGIS.Util.formatString(sFeatures, {height : height, width : width}));
	}
};

SGIS.registerNamespace("SGIS.AutoResize");
/**
 * 自适应高度
 * @type 
 */
SGIS.AutoResize = {
	HookName : "hook",
	Hook : {
		HEADER : "",
		ADAPTIVE : ""
	}
};

//扩展 根据数组元素值 删除
 Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
/*
 * http://www.JSON.org/json2.js
    2011-02-23
    Public Domain.
    See http://www.JSON.org/js.html
 */
(function(){
	var JSON={};
	function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){SGIS.Debug("JSON.stringify Exception")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}SGIS.Debug("JSON.parse Exception")}}
	/**
	 * @namespace
	 * 提供JSON方法的引用
	 * @type SGIS.JSON
	 */
	SGIS.JSON = {};
	/**
	 * 提供JSON方法的引用
	 * @static SGIS.JSON.parse
	 */
	SGIS.JSON.parse = JSON.parse;
	/**
	 * 提供JSON方法的引用
	 * @static SGIS.JSON.stringify
	 */
	SGIS.JSON.stringify = JSON.stringify;
}());