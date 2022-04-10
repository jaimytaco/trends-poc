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
        panX: 'translateX',
        panY: 'translateY',
        projection: am5map.geoMercator()
    }))

    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ']
    }))

    polygonSeries.mapPolygons.template.setAll({
        tooltipText: '{name}',
        toggleKey: 'active',
        interactive: true
    })
    
    polygonSeries.mapPolygons.template.states.create('hover', {
        fill: root.interfaceColors.get('primaryButtonHover')
    })
    
    polygonSeries.mapPolygons.template.states.create('active', {
        fill: root.interfaceColors.get('primaryButtonHover')
    })
        
    const polygonSeriesUS = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_usaLow
    }))
    
    polygonSeriesUS.mapPolygons.template.setAll({
        tooltipText: '{name}',
        toggleKey: 'active',
        interactive: true
    })
    
    const colors = am5.ColorSet.new(root, {})
    
    polygonSeriesUS.mapPolygons.template.set('fill', colors.getIndex(3))
    
    polygonSeriesUS.mapPolygons.template.states.create('hover', {
        fill: root.interfaceColors.get('primaryButtonHover')
    })
    
    polygonSeriesUS.mapPolygons.template.states.create('active', {
        fill: root.interfaceColors.get('primaryButtonHover')
    })
            
    chart.chartContainer.get('background').events.on('click', function () {
        chart.goHome()
    })
    
    chart.appear(1000, 100)
}
