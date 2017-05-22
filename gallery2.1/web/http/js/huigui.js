/**
 * Created by wth on 2017/4/8.
 */

$(document).ready(function () {
    jsonData = [
        [10.0, 8.04],
        [8.0, 6.95],
        [13.0, 7.58],
        [9.0, 8.81],
        [11.0, 8.33],
        [14.0, 9.96],
        [6.0, 7.24],
        [4.0, 4.26],
        [12.0, 10.84],
        [7.0, 4.82],
        [5.0, 5.68]
    ];

    draw();

    var X = XLSX;
    var XW = {
        /* worker message */
        msg: 'xlsx',
        /* worker scripts */
        rABS: './xlsxworker2.js',
        norABS: './xlsxworker1.js',
        noxfer: './xlsxworker.js'
    };

    var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
    if (!rABS) {
        document.getElementsByName("userabs")[0].disabled = true;
        document.getElementsByName("userabs")[0].checked = false;
    }

    var use_worker = typeof Worker !== 'undefined';
    if (!use_worker) {
        document.getElementsByName("useworker")[0].disabled = true;
        document.getElementsByName("useworker")[0].checked = false;
    }

    var transferable = use_worker;
    if (!transferable) {
        document.getElementsByName("xferable")[0].disabled = true;
        document.getElementsByName("xferable")[0].checked = false;
    }

    var wtf_mode = false;

    function fixdata(data) {
        var o = "", l = 0, w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }

    function ab2str(data) {
        var o = "", l = 0, w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
        return o;
    }

    function s2ab(s) {
        var b = new ArrayBuffer(s.length * 2), v = new Uint16Array(b);
        for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
        return [v, b];
    }

    function xw_noxfer(data, cb) {
        var worker = new Worker(XW.noxfer);
        worker.onmessage = function (e) {
            switch (e.data.t) {
                case 'ready':
                    break;
                case 'e':
                    console.error(e.data.d);
                    break;
                case XW.msg:
                    cb(JSON.parse(e.data.d));
                    break;
            }
        };
        var arr = rABS ? data : btoa(fixdata(data));
        worker.postMessage({d: arr, b: rABS});
    }

    function xw_xfer(data, cb) {
        var worker = new Worker(rABS ? XW.rABS : XW.norABS);
        worker.onmessage = function (e) {
            switch (e.data.t) {
                case 'ready':
                    break;
                case 'e':
                    console.error(e.data.d);
                    break;
                default:
                    xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                    console.log("done");
                    cb(JSON.parse(xx));
                    break;
            }
        };
        if (rABS) {
            var val = s2ab(data);
            worker.postMessage(val[1], [val[1]]);
        } else {
            worker.postMessage(data, [data]);
        }
    }

    function xw(data, cb) {
        transferable = false;
        if (transferable) xw_xfer(data, cb);
        else xw_noxfer(data, cb);
    }

    function get_radio_value(radioName) {
        var radios = document.getElementsByName(radioName);
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked || radios.length === 1) {
                return radios[i].value;
            }
        }
    }

    function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
            var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result[sheetName] = roa;
            }
        });
        return result;
    }

    function to_csv(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function (sheetName) {
            var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
            if (csv.length > 0) {
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(csv);
            }
        });
        return result.join("\n");
    }

    function to_formulae(workbook) {
        var result = [];
        workbook.SheetNames.forEach(function (sheetName) {
            var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
            if (formulae.length > 0) {
                result.push("SHEET: " + sheetName);
                result.push("");
                result.push(formulae.join("\n"));
            }
        });
        return result.join("\n");
    }

    function to_html(workbook) {
        document.getElementById('htmlout').innerHTML = "";
        var result = [];
        workbook.SheetNames.forEach(function (sheetName) {
            var htmlstr = X.write(workbook, {sheet: sheetName, type: 'binary', bookType: 'html'});
            document.getElementById('htmlout').innerHTML += htmlstr;
        });
    }

    var tarea = document.getElementById('b64data');

    function b64it() {
        if (typeof console !== 'undefined') console.log("onload", new Date());
        var wb = X.read(tarea.value, {type: 'base64', WTF: wtf_mode});
        process_wb(wb);
    }

    var global_wb;

    function process_wb(wb) {
        global_wb = wb;
        var output = "";
        switch (get_radio_value("format")) {
            case "json":
                output = JSON.stringify(to_json(wb), 2, 2);
                break;
            case "form":
                output = to_formulae(wb);
                break;
            case "html":
                return to_html(wb);
            default:
                output = to_csv(wb);
        }

        var outArray = output.split('\n').slice(3, output.split('\n').length - 1);
        jsonData = [];
        $("#dynatable").empty();
        for (var i = 0; i < outArray.length; i++) {
            var row = document.createElement("tr");
            row.id = i;
            jsonData = outArray[i].split(',');
            for (var j = 0; j < outArray[i].split(',').length; j++) {
                var cell = document.createElement("td");
                cell.id = i + "/" + j;
                cell.appendChild(document.createTextNode(outArray[i].split(',')[j]));
                row.appendChild(cell);
            }
            document.getElementById("dynatable").appendChild(row);
        }
        draw()
    }


    var xlf = document.getElementById('xlf');

    function handleFile(e) {
        rABS = false;
        use_worker = false;
        var files = e.target.files;
        var f = files[0];
        {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function (e) {
                if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
                var data = e.target.result;
                if (use_worker) {
                    xw(data, process_wb);
                } else {
                    var wb;
                    if (rABS) {
                        wb = X.read(data, {type: 'binary'});
                    } else {
                        var arr = fixdata(data);
                        wb = X.read(btoa(arr), {type: 'base64'});
                    }
                    process_wb(wb);
                }
            };
            if (rABS) reader.readAsBinaryString(f);
            else reader.readAsArrayBuffer(f);
        }
    }

    if (xlf.addEventListener) xlf.addEventListener('change', handleFile, false);
});

draw = function () {
    var data = jsonData;
    var x = [];
    var y = [];
    var max = 0;
    var min = data[0][0];
    for (var i = 0; i < data.length; i++) {
        max = Math.max(data[i][0], max);
        min = Math.min(data[i][0], min);
        x.push(data[i][0]);
        y.push(data[i][1]);
    }

    function linearRegression(y, x) {

        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {
            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i] * y[i]);
            sum_xx += (x[i] * x[i]);
            sum_yy += (y[i] * y[i]);
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
        lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

        return lr;

    }

    var lr = linearRegression(y, x);

    var markLineOpt = {
        animation: false,
        label: {
            normal: {
                formatter: 'y = ' + lr.slope + '*x +' + lr.intercept,
                textStyle: {
                    align: 'right'
                }
            }
        },
        lineStyle: {
            normal: {
                type: 'solid'
            }
        },
        tooltip: {
            formatter: 'y = ' + lr.slope + '*x +' + lr.intercept
        },
        data: [[{
            coord: [min, lr.slope * min + lr.intercept],
            symbol: 'none'
        }, {
            coord: [max, lr.slope * max + lr.intercept],
            symbol: 'none'
        }]]
    };

    option = {
        title: {
            text: 'Anscombe\'s quartet',
            x: 'center',
            y: 0
        },
        grid: [
            {x: '7%', y: '7%'},
        ],
        tooltip: {
            formatter: 'Group {a}: ({c})'
        },
        xAxis: [
            {gridIndex: 0, min: 0},
        ],
        yAxis: [
            {gridIndex: 0, min: 0},
        ],
        series: [
            {
                name: 'I',
                type: 'scatter',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: data,
                markLine: markLineOpt
            }
        ]
    };

    var mapChart = echarts.init(document.getElementById('huiguichart'));
    mapChart.setOption(option);
}