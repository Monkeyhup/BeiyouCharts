
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
 * （指标等）数据类型
 */
SGIS.Type = {
	STRING : 1,
	NUMBER : 2,
	DATE : 3,
	ENUM : 4,
	/**
	 * propertie number 属性数值，比如人口的年龄，身高等，不可用于累加计算的类型
	 * @type Number
	 */
	PNUMBER : 5
};

/**
 * 行政区划对象
 * @class SGIS.Region
 * @constructor SGIS.Region
 * @param {String} regionCode	行政区划编码(这里可以填写适用于SQL的代码形式，比如510101001___)
 * @param {String} regionName	行政区划名称(optional)
 * @param {String/Number} regionLevel	行政区划级别(optional)
 */
SGIS.Region = function(regionCode, regionName, regionLevel){
    this.regionCode = regionCode || "";
    this.regionName = regionName ? regionName : "未命名";
    this.regionLevel = regionLevel ? regionLevel : SGIS.Region.recognitionLevel(this.regionCode);
};
SGIS.Region.prototype = {
    /**
     * 获取行政区划名称
     * @return {String}
     */
    getName : function(){
        return this.regionName;
    },
    /**
     * 获取行政区划代码
     * @return {String}
     */
    getCode : function(){
        return this.regionCode;
    },
    /**
     * 获取行政区划级别, 如果在初始化的时候未填写, 会被构造函数默认根据规则赋值
     * @return {String/Number}
     */
    getLevel : function(){
        if (this.regionLevel < 0){
            //根据行政区划规则判断行政区划级别
        }
        return this.regionLevel;
    },
    toString : function(){
        return this.getName()+"（"+this.getCode()+"#"+this.getLevel()+"）";
    }
};

/**
 * 判断是否为同一个级别的行政区划对象
 * @static
 * @param {SGIS.Region} region0
 * @param {SGIS.Region} region1
 * @return {Boolean}	是否是同一个级别的行政区划对象
 */
SGIS.Region.isSameLevel = function(region0, region1){
    return region0.getLevel() == region1.getLevel();
};

/**
 * 根据行政区划编码，识别级别
 * @static
 * @param {string|number} regionCode
 * @return {Number}
 */
SGIS.Region.recognitionLevel = function(regionCode) {
    if(!regionCode) return 0;
    var leng = regionCode.length;
    var regionlevel = 1;
    if(leng==12){
        if (regionCode.indexOf("00000000") == 0){
            regionlevel = 1;
        }else if (regionCode.toString().substring(2, 12) == "0000000000") {
            regionlevel = 2;
            // 市
        } else if (regionCode.toString().substring(4, 12) == "00000000") {
            regionlevel = 3;
            // 区县
        } else if (regionCode.toString().substring(6, 12) == "000000") {
            regionlevel = 4;
            // 乡镇
        } else if (regionCode.toString().substring(9, 12) == "000") {
            regionlevel = 5;
        } else {
            //村（社区）
            regionlevel = 6;
        }
    }else if(leng<=10){
        //特色区
        regionlevel = 9;
    }else if (leng > 12 && leng<=14) {
        //小区（园区）
        regionlevel = 7;
    } else if (leng > 14 && leng<=29) {
        //建筑物
        regionlevel = 8;
    }
    //如果行政区划需要特殊判断的，后续在这里加入
    return regionlevel;
};

/** 根据区划CODE，获取下一级区划级别 */
SGIS.Region.getNextLevel = function(code){
    var level = SGIS.Region.recognitionLevel(code);
    var isMu = SGIS.Region.isMunicipality(code);//是否直辖市
    return level<6 ? (isMu&&level==2?level+2:level+1) : level;
};

/**
 * 获取行政区划编码的前缀编码，即去0之后的，此方法可能对于特殊区域并不适用，比如北京的亦庄开发区，陕西的杨凌开发区等
 * @static
 * @param {String} regionCode	行政区划编码
 * @return {String}
 */
SGIS.Region.getPrefixCode = function(regionCode) {
    var re = "";
    var code = regionCode.toString();
    if (code.indexOf("#") != -1) {
        return code.substring(0, code.indexOf("#"));
    } else {
        if (code.length == 12) {
            if (code.lastIndexOf("000000000000") == 0) {
                re = code.substring(0, 0);
            } else if (code.lastIndexOf("0000000000") >= 2) {
                re = code.substring(0, 2);
            } else if (code.lastIndexOf("00000000") >= 4) {
                re = code.substring(0, 4);
            } else if (code.lastIndexOf("000000") >= 6) {
                re = code.substring(0, 6);
            } else if (code.lastIndexOf("000") >= 9) {
                re = code.substring(0, 9);
            } else {
                re = regionCode;
            }
        } else {
            re = code;
        }
    }
    return re;
};

/**
 * 判断是否reg2是否在reg1行政区划下
 * @param reg1 区划编码1
 * @param reg2 区划编码2
 * */
SGIS.Region.isSubRegion = function(reg1,reg2){
    if(!reg1 || !reg2)
        return false;
    var prefix1 = SGIS.Region.getPrefixCode(reg1);
    var prefix2 = SGIS.Region.getPrefixCode(reg2);
    if(prefix2.indexOf(prefix1)!=-1){
        return true;//prefix1包含prefix2
    }else{
        return false;
    }
};

SGIS.Region.getLevelName = function(level){
    switch (level) {
        case 2:
            return "省";
        case 3:
            return "地市";
        case 4:
            return "区县";
        case 5:
            return "乡镇街道";
        case 6:
            return "村居委会";
        case 7:
            return "小区（园区）";
        case 8:
            return "建筑物";
        case 9:
            return "特色区域";
        default:
            return "无";
    }
};

/**
 * 获取行政区划代码对应的行政区划级别名称
 * @param {String} regionCode	行政区划代码
 * @return {String} 全国、省、市、区县、街道乡镇、村居委会
 */
SGIS.Region.getRegionLevelName = function(regionCode){
    regionCode = regionCode.replace(/_/g, "0");
    if (regionCode == "000000000000") {
        return "全国";
    }
    else {
        return SGIS.Region.getLevelName(SGIS.Region.recognitionLevel(regionCode));
    }
};

/**
 * 根据级别，截取有效行政区划代码
 * @param regioncode
 * @param regionlevel
 * @returns {*}
 */
SGIS.Region.getSubCode = function(regioncode,regionlevel){
    switch (regionlevel) {
        case 1:
            return "";
        case 2:
            return regioncode.substring(0, 2);
        case 3:
            return regioncode.substring(0, 4);
        case 4:
            return regioncode.substring(0, 6);
        case 5:
            return regioncode.substring(0, 9);
        case 6:
            return regioncode.substring(0, 12);
        case 7:
            return regioncode.substring(0, 14);
        case 8:
            return regioncode.substring(0, 29);
        case 9:
            return regioncode.substring(0, 10);
        default:
            return regioncode;
    }
};

//截取有效区划代码
SGIS.Region.getSub = function(regioncode){
    var level = SGIS.Region.recognitionLevel(regioncode);
    return SGIS.Region.getSubCode(regioncode,level);
};

/**获取区划以下行政区划级别*/
SGIS.Region.getNextLevels = function(regioncode){
    var level = SGIS.Region.recognitionLevel(regioncode);
    if(level==1){
        return [2,3,4,5,6];
    }else if(level==2) {
        if (SGIS.Region.isMunicipality(regioncode)) {//直辖市
            return [4,5,6];
        }else{
            return [3,4,5,6];
        }
    }else if(level==3) {
        return [4,5,6];
    }else if(level==4) {
        return [5,6];
    }else if(level==5) {
        return [6];
    }else if(level==6) {
        return [];
    }
    return [];
};

/**
 * 通过行政区划级别获取级别名称
 * @param level
 * @returns {string}
 */
SGIS.Region.getNameByLevel = function(level){
    switch (level) {
        case 1:
            return "全国";
        case 2:
            return "省";
        case 3:
            return "市";
        case 4:
            return "区县";
        case 5:
            return "街道";
        case 6:
            return "村";
        case 7:
            return "小区";
        case 8:
            return "建筑物";
        case 9:
            return "特色区";
        default:
            return "无";
    }
};
/**
 * 获取级别对应的截取长度
 * @param level
 */
SGIS.Region.getLenByLevel = function(level){
    var len = 0 ;
    switch (level){
        case 1:len = 0;  //国家
            break;
        case 2:len = 2;  //省级
            break;
        case 3:len = 4;  //地市
            break;
        case 4:len = 6;  //区县
            break;
        case 5:len = 9;  //乡镇
            break;
        case 6:len = 12;  //村
            break;
        case 7:len = 14;  //小区
            break;
        case 8:len = 29;  //建筑物
            break;
        case 9:len = 10;  //特色区
            break;
    }
    return len ;
}

/**
 * 直辖市区划代码前两位
 * @type Array<String>
 */
SGIS.Region.MunicipalRegions = ["11","12","31","50"];
/**
 * 判断该行政区划代码是否属于直辖市
 * @param {String} regioncode
 */
SGIS.Region.isMunicipality = function(regioncode){
    var m = SGIS.Region.MunicipalRegions;
    var prefix = regioncode.substring(0, 2);
    var re = false;
    for (var i = 0, _size = m.length; i < _size; i++) {
        if (prefix == m[i]){
            re = true;
            break;
        }
    }
    return re;
};

/**
 * 根据用户可查询区域过滤选择的区域
 * @param {Array<SGIS.Region>} regions	选择的区域
 * @param {Array} area	可查询的区域（权限）
 */
SGIS.Region.filterRegions = function(regions, area){
    if(SGIS.Config.Macro.escapeRegionControl){
        return regions;
    }
    var re = [];
    if(regions.length == 0){
        alert("请选择查询区域！");
        return re;
    }
    var _area = area || uPower.getUserarea();
    var areaCodess = _area.codes;
    var codenum = areaCodess.length;
    //比如普查小区或者未满12位的建筑物 就直接通过过滤
    if(codenum == 0 || regions[0].length < 12){
        return regions;
    }
    var leng = regions.length;
    for(var i = 0; i < codenum; i++){
        var codeLength = areaCodess[i].length;
        for(var j = 0; j < leng; j++){
            if(regions[j].getCode().substr(0, codeLength) == areaCodess[i]){
                re.push(regions[j]);
            }
        }
    }
    if(re.length == 0){
        alert("您没有查询该区域数据的权限！\n您只能查询" + _area.names.join("、") + "的数据！");
    }
    return re;
};

/**
 * 构建标准12位的行政区划代码，对prefix补零
 * @param {String|Number} prefix
 */
SGIS.Region.toStandardCode = function(prefix){
    while(prefix.length < 12){
        prefix = prefix+"0";
    }
    return prefix;
};
/**
 *右侧补位
 */
SGIS.Region.padRight = function(prexCode,len,c){
    if (len < prexCode.length) {
        return prexCode;
    }
    var a = [] ;
    for(var i= 0,size = len-prexCode.length;i<size;i++){
        a.push(c) ;
    }
    return prexCode+ a.join("");
};
/**
 * 根据父节点构造 所有xx区划代码（所有省、所有地市）
 * @param parcode
 * @param itsLevel
 * @param targetLevel
 * @returns {*}
 */
SGIS.Region.createXXRegion = function(parcode,itsLevel,targetLevel){
    var strIts = SGIS.Region.padRight(
        SGIS.Region.getSubCode(parcode, itsLevel),
        SGIS.Region.getLenByLevel(itsLevel+1), '#');
    var targetStr = SGIS.Region.padRight(strIts,
        SGIS.Region.getLenByLevel(targetLevel), '*');
    var newcode = SGIS.Region.padRight(targetStr, 12, '0');
    return new SGIS.Region(newcode,"所有"+SGIS.Region.getNameByLevel(targetLevel),targetLevel) ;
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

    //麻点服务URL
    pockUrl:function(){
        return SGIS.Util.getBaseUrl()+"/data/pock/tiles/" ;
    },

    /**
     * 图层切片请求代理
     * @returns {string}
     */
    proxyTile: function () {
        return SGIS.Util.getBaseUrl() + "/web/proxy/tile?url=";
    },

    //图片下载路径
    imgDownUrl: function () {
        return SGIS.Util.getBaseUrl() + "/web/save/img";
    },

    /**
     * （基层or综合）成果保存到图库gallery服务地址
     *  URL:"/图库服务工程名/gallery/achieve"
     */
    galleryUrl:function(){
        return SGIS.Util.getBaseUrl() + "/gallery/data/achieve";
    },

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
	},

    /**
     * 数据下载
     * @param id  $selectorID标识，iframe（需要在主页面中有iframe元素）
     * @param src 完整后台下载服务url
     */
    downloadData: function (id, src) {
        var ifrdownload = top.$("#"+id);
        ifrdownload.css("display","block");
        ifrdownload.attr("src",src);
        ifrdownload.css("display","none");//加载完关闭
    },

    /**
     * 回到登录页面
     */
    goToLogin : function () {
       top.location.href = "/base/index.html";
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
    var SERVICE_NAME = "/gallery2.1/"; //后台数据服务名
    var WEB_NAME = "/gallery2.1/";
    
    var BASE = (function(){
        var loc = window.location;
        if (loc.origin){
            return loc.origin;
        }
        return loc.protocol+"//"+loc.host;
    })();
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
        json : function(callback){
            _go(this, callback);
        },
        xml : function(callback){
        	this.dataType = "xml";
            _go(this, callback);
        },
        text : function(callback){
        	this.dataType = "text";
            _go(this, callback);
        },
        debug : function(){
            this._debug = true;
        	return this;
        }
    };

    var _go = function(req, callback){
        var ajax = {
            url :BASE + SERVICE_NAME + req.api + "?_method=" + req.method,
            type : "POST",
            data : req._data,
            dataType : req.dataType,
            success: function (re) {
                if (req.api.indexOf("oAuth") < 0) {
                    if (re && re.power && re.power == "overdue") {
                        if(confirm(re.info + " 请重新登陆！")){
//                            SGIS.Util.goToLogin();
                            LoginMod.init();
                            LoginMod.show();
                        }else{
                            SGIS.Util.goToLogin();
                            return;
                        }
                    }
                }
                callback&&callback(re);
            },
            error : function(re){
                SGIS.Debug("API请求出错");
            }
        };
        if (req.contentType){
            ajax.contentType = req.contentType;
            ajax.url += req._data ? ("&" + $.param(req._data)) : "";//兼容JSON参数
            ajax.data = req._stringify;//string参数
        }
        if (req._debug){
            alert(ajax.url+" "+ajax.type);
        }
        $.ajax(ajax);
    };

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
        }
    };

    SGIS.URL = {
        /**
         * 获取基于当前页面的URL地址
         * @example
         * 以lib/module开头
         * @param url
         * @returns {string}
         */
        get : function(url){
            return BASE + WEB_NAME + url;
        },
        //seajs所用的基础路径
        SEAJS_BASE : BASE + WEB_NAME + "js/module"
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
 * 打开模态窗口
 * @param {String} pageUrl
 * @param {Number} width
 * @param {Number} height
 * @param {Object} args（optional）
 */
SGIS.UI.openWindow = function(pageUrl, width, height, args){
    var url = pageUrl, sFeatures = 'dialogWidth={{width}}px;dialogHeight={{height}}px;scroll=no;status=no;resizable=no;';
    url += args ? "?"+$.param(args) : "";
    window.showModalDialog(url, self, SGIS.Util.formatString(sFeatures, {height : height, width : width}));
};

/**
 * jQuery hover的改进版，允许用户在鼠标离开目标后的delay毫秒内不触发leave方法，以此达到良好的体验效果
 * @param {jQuery|String} el	目标
 * @param {Function} enter	鼠标enter触发事件
 * @param {Function} leave	鼠标leave触发事件
 * @param {Number} delay	（optional）默认500
 * @return {jQuery}
 */
SGIS.UI.delayHover = function (el, enter, leave, delay){
    var o = typeof el === "string" ? $("#"+o) : el;
    var isOver,isShow,timeid;
    return o.hover(function (){
        isOver = true;
        clearTimeout(timeid);
        if (isShow){
            return;
        }else{
            isShow = true;
            enter.call(this);
        }
    }, function (){
        timeid = setTimeout(function(){
            isOver = isShow = false;
            leave.call(this);
        }, delay || 500);
    });
};

//构建界面里的Option（或者Semantic里的Dropdown）
;(function(){
    var Op = function(value, text){
    	this.value = value;
        this.text = text;
    };
	var create = function(values, texts){
		var re = [];
		for (var i = 0, _sizei = values.length; i < _sizei; i++) {
			re.push("<option value='"+values[i]+"'>"+texts[i]+"</option>");
		}
		return re.join("");
	};
	/**
	 * 提供界面中常用的option初始化
	 * @type 
	 */
	SGIS.UI.Option = {
		/**
		 * 构建月份选择
		 * @return {String}
		 */
		createMonth : function(){
			var v = [], t = [];
			//empty for
			for(var i = 0;i < 12; i++,v.push(i),t.push(i+"月"));
			return create(v, t);
		},
		/**
		 * 构建季度选择
		 * @return {String}
		 */
		createSeason : function(){
			return create("1,2,3,4".split(","), "一季度,二季度,三季度,四季度".split(","));
		},
		/**
		 * 构建年份选择
		 * @param {Number} start（optional）
		 * @param {Number} end（optional）
		 * @return {String}
		 */
		createYear : function(start, end){
			var currentYear = new Date().getFullYear(), v = [], t = [];
			for (var i = 0; i < 10; i++) {
				v.push(currentYear - i);
				t.push((currentYear - i)+"年");
			}
			return create(v, t);
		},
        /**
         * 可以是数组也可以是以逗号分割的字符串
         * @param values
         * @param names
         */
		create : function(values, names){

		}
	};
})();

/**
 * semantic 警告or提示框
 */
(function () {
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
            "        <div class='header' style='padding: 1px;display: "+ iscp+"'>       " +
            "          <i style='float: right;cursor:pointer;' class='remove sign icon'></i>                  " +
            "        </div>                     " +
            "        <div class='content' style='padding-top: 10px;padding-right:5px;padding-left:5px;padding-bottom: 20px'>      " +
            "          <div style='width: 100%' class='ui label "+ color+" '>" +
                         info +
            "          </div>                  " +
            "        </div>                  ";
        return obj;
    };
    //绑定关闭
    var bindClose = function () {
       top.$("body .ui.small.modal.alert i").bind("click", function () {
           top.$("body .ui.small.modal.alert").hide();
           top.$("body .ui.small.modal.alert").empty();
           top.$("body .ui.small.modal.alert").remove();
       });
    };


    /**
     * 自动弹出&关闭信息提示框
     * @param info 提示信息
     * @param type （‘success’:成功、‘dange’:提示、‘warn’:错误）控制提示信息颜色
     * @param withclose (false:自动、true:手动)是否手动关闭
     * */
    SGIS.UI.alert = function (info, type, withclose) {
        if(top.$("body .ui.small.modal.alert").length<1){
            top.$("body").append(_getNode());
        }
        var modal = top.$("body .ui.small.modal.alert");
        modal.empty();
        modal.append(_getContent(info,type,withclose));
        modal.css("margin-left","0");//居中有效
        modal.show();
        bindClose();
        if(typeof  withclose =="boolean" && withclose){

        }else {
            setTimeout(function () {
                top.$("body .ui.small.modal.alert").hide();//3秒自动关闭
            },3000);
        }
    };

})();


//正在加载
(function(){
    var loading = '<div class="ui active inverted dimmer"> <div class="ui text loader">正在加载…</div> </div >';

    var _getNode = function(msg, selector){
        var _context = selector ||"body";
        var $loading = $(".ui.inverted.dimmer", _context);
        $loading.length || ($loading = $(loading).appendTo(_context));
        msg && $loading.find('.text').text(msg);
        return $loading;
    };

    /**
     * 向目标窗口添加加载条
     * @param msg （optional）默认为”正在加载…“
     * @param selector （optional）默认为本窗口
     */
	SGIS.UI.addLoadingBar = function(msg, selector){
        _getNode(msg, selector).addClass('active');
	};

    /**
     * 清除目标窗口内的加载条
     * @param selector
     */
	SGIS.UI.clearLoadingBar = function(selector){
        _getNode(null, selector).removeClass('active');
	};
})();

SGIS.registerNamespace("SGIS.AutoForm");

(function(){
	var Validator = {
		notnull : function(v, args){
			return v != "";
		},
		number : function(v, args){
			return !isNaN(v);
		},
		len : function(v, args){
			
		},
		min : function(v, args){
			return v.length > args;
		},
		max : function(v, args){
			return v.length < args && v.length > 0;
		},
		regx : function(v, args){
			return new RegExp(args).test(v);
		}
	};
	var Msg = {
		notnull : "不能为空",
		number : function(v, args){
			return !isNaN(v);
		},
		len : function(v, args){
			
		},
		min : function(v, args){
			return v.length > args;
		},
		max : function(v, args){
			return v.length < args && v.length > 0;
		},
		regx : function(v, args){
			return new RegExp(args).test(v);
		}
	};
	var testV = function(){
		var $this = $(this), vs = $this.attr("data-validation").split(";"), result = true;
		for (var i = 0, _sizei = vs.length; i < _sizei; i++) {
			var keys = vs[i].split(",");
			result = Validator[keys[0]] ? Validator[keys[0]].call(this, $this.val(), keys[1]) : true;
			if (!result) {break;};
		}
		
		$this.parentsUntil(".control-group").parent().toggleClass("error", !result);
		return result;
	};
	/**
	 * 表单
	 * 提供填充数据的方法
	 * 提供提交表单的方法
	 * @param {Element} content
	 * @param {Object} options
	 */
	SGIS.AutoForm = function(content, options) {
		this.options = options;
		this.$element = $(content);
		this.$element.delegate(":input[data-validation]", "blur", testV);
	//		.delegate('[data-dismiss="modal"]', 'click.form.submit', $.proxy(this.submit, this))
	};
	SGIS.AutoForm.prototype = {
		/**
		 * 验证表单
		 * @return Boolean
		 */
		validation : function(){
			var re = true;
			this.$element.find("input[data-validation]").each(function(){
				if (!testV.call(this)){
					re = false;
				}
			});
			return re;
		},
		/**
		 * 提交表单
		 * @param {String} url
		 * @param {Function} callback
		 */
		submit : function(url ,callback){
			if (this.validation()){
				var ps = this.$element.serializeArray(), o = {};
				for (var i = 0, _sizei = ps.length; i < _sizei; i++) {
					o[ps[i].name] = ps[i].value;
				}
				$.post(url, o, function (re){
					callback && callback.call(this, re);
				}, this.options.type || "text");
			}
		},
		reset : function(){
			this.$element[0].reset();
		},
		setInitValue : function(data){
			for (var key in data) {
				this.$element.find("[name='"+key+"']").val(data[key]);
			}
		}
	};
	
	//扩展FileUploadForm
	SGIS.AutoForm.UploadAction = function(formid, iframeid, fileType, onSuccess){
		var reg = /xls/g, form = $("#"+id), iframe = $("#"+iframeid);
		iframe.one("load", function(){
			
		});
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


(function () {
    /**
     * 判断数组中是否包含元素
     * @param e
     */
    Array.prototype.in_array = function (e) {
        for(var i =0;i<this.length;i++){
            if(this[i]===e || this[i]==="##" || this[i]===""){
                return true;
            }
        }
        return false;
    };
})();


SGIS.Config = {
    frameworkName : "framework",
    DhtmlxImagePath :SGIS.URL.get( "http/lib/dhtmlx/"),
    log : true,                                    // 是否控制台输出

    dataApp:"data",
    pockApp:"pocking",
    portalApp:"portal",
    baseApp:"base",
    galleryApp:"gallery",
    retrievalApp:"retrieval",
    sdmsApp:"sdms",
    visualApp:"visual",
    webApp:"web" ,

    proxyimgUrl:""
};

/**
 * 登录框
 */
var LoginMod = (function () {

    var init = function () {
        //关闭
        top.$("#login-container .theme-poptit a").click(function () {
             top.$('.theme-popover-mask').fadeOut(100);
             top.$('#login-container').slideUp(200);
        });
        //提交
        top.$("#login-btn-submit").click(function () {
            var userName = top.$("#login-inp-name").val();
            var password = top.$("#login-inp-pwd").val();
            LoginMod.action(userName,password,null);
        });
    };

    var show = function () {
        top.$('.theme-popover-mask').fadeIn(100);
        top.$('#login-container').slideDown(200);
    };
    var hide = function () {
        top.$('.theme-popover-mask').fadeOut(100);
        top.$('#login-container').slideUp(200);
    };


    /**
     * 登录
     */
    var action = function (userName,password,callback) {
        if(userName==""){
            alert("用户名不能为空");
            return false;
        }
        if(password==""){
            alert("密码不能为空");
            return false;
        }

        if(!hex_md5){
            console.log("页面中缺少md5.js文件");
            return false;
        }


        password = hex_md5(password); //md5加密
        SGIS.API.get("oAuth/login").data({userName:userName,password:password}).json(function (re) {
            if(re && re.status){
                callback&&callback(re.user);
                LoginMod.hide();
            }else{
                alert(re.info ? re.info : "登录失败，用户名或者密码不正确！");
            }
        });
    };


    return {
        init:init,
        show :show,
        hide :hide,
        action:action
    };
})();



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