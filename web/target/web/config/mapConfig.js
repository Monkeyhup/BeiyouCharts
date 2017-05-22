/**
 * Created by prentice on 2016/10/19.
 */
option1 = {
    title: {
        text: '中国地图',
        x: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data: ['随机数据']
    },
    dataRange: {
        min: 0,
        max: 1000,
        x: 'left',
        y: 'bottom',
        text: ['高', '低'],           // 文本，默认为数值文本
        calculable: true
    },
    series: [
        {
            name: '随机数据',
            type: 'map',
            mapType: 'china',
            roam: true,
            itemStyle: {
                normal: {label: {show: true}},
                emphasis: {label: {show: true}}
            },
            data: []
        }
    ]
};
