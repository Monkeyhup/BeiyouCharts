/**
 * 第三方集成图的配置操作
 *
 * Created by Linhao on 2015/12/31.
 */
define(function(require, exports, module) {

    /**
     * 第三方图的配置
     */
    var ThirdChartsConfig = (function(){
        var _config = null;			//保存第三方配置文件中的所有数据
        var _currentUsedLength = 0;	//保存当前条件过滤后的长度

        /**
         * 初始化
         */
        var init = function(){
            _config = null;
            _currentUsedLength = 0;
        };

        /**
         * 设置当前的长度
         * @param currentUsedLength
         */
        var setCurrentUsedLength = function(currentUsedLength){
            _currentUsedLength = currentUsedLength;
        };

        /**
         * 取得当前的长度
         * @returns {number}
         */
        var getCurrentUsedLength = function(){
            return _currentUsedLength;
        };

        /**
         *
         * @param callback
         */
        var getConfig = function(callback){
            if(_config != null){
                callback && callback(_config);
                return ;
            }

            var url = SGIS.Config.GALLERY_MODULE_URL+"third-charts/config/third.charts.config.json";
            $.getJSON(url,function(result){
                _config = result;					//保存结果
                _currentUsedLength = result.length;	//保存当前长度
                callback && callback(_config);
            });
        };

        /**
         * 过滤不符合条件的
         * @param config
         * @param catalogId
         * @param keyword
         */
        var filterConfigBycatalogIdAndkeyword = function(config,catalogId,keyword){
            var result = [];

            if(typeof catalogId == "undefined" && typeof keyword == "undefined"){
                return $.extend(true,result,config)
            }else{
                //如果是根节点
                if(catalogId === "0" || catalogId === 0){
                    for (var i= 0,len=config.length;i<len;i++){
                        //过滤关键字
                        if(config[i].title.indexOf(keyword) > -1){
                            result.push(config[i]);
                        }
                    }
                }else{
                    for (var j= 0,len2=config.length;j<len2;j++){
                        //过滤分类
                        var id = config[j].chartCatalog;
                        if(typeof id != "undefined" && id == catalogId){
                            //过滤关键字
                            if(config[j].title.indexOf(keyword) > -1){
                                result.push(config[j]);
                            }
                        }
                    }
                }
            }

            return result;
        };

        return {
            init:init,
            getConfig:getConfig,
            setCurrentUsedLength:setCurrentUsedLength,
            getCurrentUsedLength:getCurrentUsedLength,
            filterConfigBycatalogIdAndkeyword:filterConfigBycatalogIdAndkeyword
        };
    })();

    return ThirdChartsConfig;
});
