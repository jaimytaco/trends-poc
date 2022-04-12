import * as am5 from '@amcharts/amcharts5'
import * as am5map from '@amcharts/amcharts5/map'
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow'
import am5geodata_usaLow from '@amcharts/amcharts5-geodata/usaLow'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

export function getCountryChart(id: string){
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
        include: ['FR', 'US', 'PE'],
        fill: am5.color('#00C26C'),
        stroke: am5.color('#2C2C2E')
    }))

    polygonHighlightedSeries.mapPolygons.template.setAll({
        tooltipText: '{name}',
        toggleKey: 'active',
        interactive: true,
    })
            
    chart.chartContainer.get('background').events.on('click', function () {
        chart.goHome()
    })
    
    chart.appear(1000, 100)
}
