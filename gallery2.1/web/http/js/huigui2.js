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
    var newx = [];
    var len = 9;
    for (var i = 0; i <= len; i++) {
        newx[i] = min + (max - min) * i / len;
    }
    var data2 = [];
    var n = x.length;
    var a = [];
    var m = 3;

    function polyFit(x, y, n, a, m) {
        var i, j, k;
        var z, p, c, g, q = 0, d1, d2;
        var s = new Array(20);
        var t = new Array(20);
        var b = new Array(20);
        var dt = new Array(3);
        for (i = 0; i <= m - 1; i++) {
            a[i] = 0.0;
        }
        if (m > n) {
            m = n;
        }
        if (m > 20) {
            m = 20;
        }
        z = 0.0;
        for (i = 0; i <= n - 1; i++) {
            z = z + x[i] / (1.0 * n);
        }
        b[0] = 1.0;
        d1 = 1.0 * n;
        p = 0.0;
        c = 0.0;
        for (i = 0; i <= n - 1; i++) {
            p = p + (x[i] - z);
            c = c + y[i];
        }
        c = c / d1;
        p = p / d1;
        a[0] = c * b[0];
        if (m > 1) {
            t[1] = 1.0;
            t[0] = -p;
            d2 = 0.0;
            c = 0.0;
            g = 0.0;
            for (i = 0; i <= n - 1; i++) {
                q = x[i] - z - p;
                d2 = d2 + q * q;
                c = c + y[i] * q;
                g = g + (x[i] - z) * q * q;
            }
            c = c / d2;
            p = g / d2;
            q = d2 / d1;
            d1 = d2;
            a[1] = c * t[1];
            a[0] = c * t[0] + a[0];
        }
        for (j = 2; j <= m - 1; j++) {
            s[j] = t[j - 1];
            s[j - 1] = -p * t[j - 1] + t[j - 2];
            if (j >= 3)
                for (k = j - 2; k >= 1; k--) {
                    s[k] = -p * t[k] + t[k - 1] - q * b[k];
                }
            s[0] = -p * t[0] - q * b[0];
            d2 = 0.0;
            c = 0.0;
            g = 0.0;
            for (i = 0; i <= n - 1; i++) {
                q = s[j];
                for (k = j - 1; k >= 0; k--) {
                    q = q * (x[i] - z) + s[k];
                }
                d2 = d2 + q * q;
                c = c + y[i] * q;
                g = g + (x[i] - z) * q * q;
            }
            c = c / d2;
            p = g / d2;
            q = d2 / d1;
            d1 = d2;
            a[j] = c * s[j];
            t[j] = s[j];
            for (k = j - 1; k >= 0; k--) {
                a[k] = c * s[k] + a[k];
                b[k] = t[k];
                t[k] = s[k];
            }
        }
        dt[0] = 0.0;
        dt[1] = 0.0;
        dt[2] = 0.0;
        for (i = 0; i <= n - 1; i++) {
            q = a[m - 1];
            for (k = m - 2; k >= 0; k--) {
                q = a[k] + q * (x[i] - z);
            }
            p = q - y[i];
            if (Math.abs(p) > dt[2]) {
                dt[2] = Math.abs(p);
            }
            dt[0] = dt[0] + p * p;
            dt[1] = dt[1] + Math.abs(p);
        }
        return a;
    }

    a = polyFit(x, y, n, a, m);   //a�Ƕ���ʽ����

    function average(x) {
        var ave = 0;
        var sum = 0;
        if (x !== null) {
            for (var i = 0; i < x.length; i++) {
                sum += x[i];
            }
            ave = sum / x.length;
        }
        return ave;
    }

    var avgx = average(x);    //x��ƽ��ֵ
    function getY(x, avgx, a, m) {
        var y = 0;
        var l = 0;
        for (var i = 0; i < m; i++) {
            l = a[0];
            if (i > 0) {
                y += a[i] * Math.pow((x - avgx), i);
            }
        }
        return (y + l);
    }

    function newdata(newx) {
        for (var i = 0; i <= len; i++) {
            var newy = [];
            newy[i] = getY(newx[i], avgx, a, m);
            data2.push([newx[i], newy[i]]);

            //data.push({x:newx[i],y:getY(newx[i],avgx,a,m)});
        }
        return data2;
    }

    data2 = newdata(newx);

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
            },
            {
                smooth: true,
                name: 'II',
                type: 'line',
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: data2,

            }
        ]
    };

    var mapChart = echarts.init(document.getElementById('huiguichart'));
    mapChart.setOption(option);
}