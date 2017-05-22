/**
 * Created by z on 2015/10/19.
 */
/**
 * 加载数据
 */
function fetchData(callPre,callback){
    d3.csv("./data/data.csv",function(csv){
        var normalized=[];
        for(var i=0;i<csv.length;i++) {
            var row = csv[i];
            var newRow={};
            newRow.Year = row.year;
            newRow.Country=row.CTYNAME;
            newRow.Imports=Number(row.Import);
            newRow.Exports=Number(row.Export);
            normalized.push(newRow);
        }
        //保存城市数
        topCountryCount = normalized.length;

        callPre && callPre();

        countriesGrouped=d3.nest()
            .key(function(d){return d.Year;})
            .entries(normalized);

        run();
        refreshIntervalId = setInterval(run, delay);
        callback && callback();
    });
}