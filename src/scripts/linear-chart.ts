import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

export function getLinearChart(id: string) {
    const root = am5.Root.new(id)

    const myTheme = am5.Theme.new(root);

    myTheme.rule("Label").setAll({
        fill: am5.color('#fff'),
        fontFamily: 'Poppins'
    });

    root.setThemes([
        am5themes_Animated.new(root),
        myTheme
    ])

    const chart = root.container.children.push(am5xy.XYChart.new(root, {}))

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
        behavior: 'none',
    }))
    cursor.lineX.set('visible', false)
    cursor.lineY.set('visible', false)

    const date = new Date()
    date.setHours(0, 0, 0, 0)
    let value = 100

    function generateData() {
        value = Math.round((Math.random() * 10 - 5) + value)
        am5.time.add(date, 'day', 1)
        return {
            date: date.getTime(),
            value: value,
            dateStr: date.toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })
        }
    }

    function generateDatas(count) {
        const data = []
        for (var i = 0; i < count; ++i) {
            data.push(generateData())
        }
        return data
    }

    const xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.5,
        baseInterval: {
            timeUnit: 'day',
            count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
            pan: 'none',
        }),
        tooltip: am5.Tooltip.new(root, {}),
    }))

    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {
            pan: 'none'
        }),
        extraMax: 1,
        cursorTooltipEnabled: false
    }))

    const series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
            labelText: "Popularity\n[bold]{valueY}[/]\n{dateStr}",
            dy: -12
        }),
        fill: am5.color('#3A3A3C'),
        stroke: am5.color('#00C26C'),
        tension: 0
    }))

    series.bullets.push(function () {
        const sprite = am5.Circle.new(root, {
            radius: 2,
            stroke: root.interfaceColors.get('background'),
            strokeWidth: 4,
            fill: am5.color('#5E5CE6'),
            interactive: true,
            opacity: .2
        })

        sprite.states.create('hover', {
            radius: 8,
            opacity: 2
        });

        sprite.states.create('default', {
            radius: 2,
            opacity: .2
        });

        const bullet = am5.Bullet.new(root, {
            locationY: 0,
            sprite
        })

        return bullet
    })

    const data = generateDatas(50)
    console.log('data =', data)
    series.data.setAll(data)

    series.appear(1000)
    chart.appear(1000, 100)
}

