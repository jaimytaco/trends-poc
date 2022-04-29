import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import * as am5map from '@amcharts/amcharts5/map'
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow'
import am5geodata_usaLow from '@amcharts/amcharts5-geodata/usaLow'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'


export const destroyCharts = () => am5.disposeAllRootElements()

export const renderCountryChart = (id, countries) => {    
    const root = am5.Root.new(id)

    root.setThemes([
        am5themes_Animated.new(root)
    ])

    const chart = root.container.children.push(am5map.MapChart.new(root, {
        draggable: false,
        maxZoomLevel: 1,
        panX: 'none',
        panY: 'none',
        pinchZoom: false,
        projection: am5map.geoMercator()
    }))

    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
        fill: am5.color('#D9D9D9'),
        stroke: am5.color('#2C2C2E')
    }))

    const polygonHighlightedSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
        include: countries,
        fill: am5.color('#00C26C'),
        stroke: am5.color('#2C2C2E')
    }))

    polygonHighlightedSeries.mapPolygons.template.setAll({
        tooltipText: '{name}',
        toggleKey: 'active',
        interactive: true,
    })
            
    chart.chartContainer.get('background').events.on('click', () => {
        chart.goHome()
    })
    
    chart.appear(1000, 100)
}

export const renderLinearChart = (id, data) => {
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

    series.bullets.push(() => {
        const sprite = am5.Circle.new(root, {
            radius: 2,
            stroke: root.interfaceColors.get('background'),
            strokeWidth: 4,
            fill: am5.color('#5E5CE6'),
            interactive: true,
            opacity: 0,
        })

        sprite.states.create('hover', {
            radius: 8,
            opacity: 1
        });

        sprite.states.create('default', {
            radius: 2,
            opacity: 0
        });

        const bullet = am5.Bullet.new(root, {
            locationY: 0,
            sprite
        })

        return bullet
    })

    series.data.setAll(data)
    series.appear(1000)
    chart.appear(1000, 100)
}
