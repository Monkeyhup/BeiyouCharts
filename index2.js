var sb= {
    a: function(){
        var seriesData = [];
        $.getJSON("data/echarts.line.single.text.json", function (data) {
            for (var i = 0; i < data.length; i++) {
                //seriesData.push(data[i].name)
                seriesData.push({
                    0:data[i].name,
                    1:data[i].value
                });
            }
            sb.b(seriesData);
        });
    },

    b:function(data) {
        //$.get("data/liang/liang5_1.json", function (data, status) {
        //    console.log("%o", data);
        //});
        //console.log(data);
        var container = document.getElementById("example");
        var hot = new Handsontable(container, {
            data: data
        });
    }
};
sb.a();