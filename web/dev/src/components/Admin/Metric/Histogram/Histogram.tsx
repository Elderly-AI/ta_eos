import React, {useLayoutEffect} from 'react';
import * as am5 from '@amcharts/amcharts5';
// eslint-disable-next-line camelcase
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import {makeStyles, Theme} from '@material-ui/core/styles';

export type HistogramDataType = {
    date: string,
    value1: number,
}

export interface HistogramProps {
    histogramId: string,
    data: HistogramDataType[],
    name: string,
}

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        display: 'grid',
        placeItems: 'center',
        gridAutoFlow: 'row'
    }
}));

const Histogram: React.FC<HistogramProps> = ({histogramId, data, name}) => {
    const styles = useStyles();

    useLayoutEffect(() => {
        const root = am5.Root.new(histogramId);

        root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: 'panX',
                wheelY: 'zoomX',
                layout: root.verticalLayout
            })
        );


        const yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: 'date',
            renderer: am5xy.AxisRendererY.new(root, {
                inversed: true,
                cellStartLocation: 0,
                cellEndLocation: 100000
            })
        }));

        yAxis.data.setAll(data);
        const xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {}),
            min: 0
        }));


        const series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: 'info',
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: 'value1',
            categoryYField: 'date',
            sequencedInterpolation: true,
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: 'horizontal',
                labelText: '[bold]{name}[/]\n{categoryY}: {valueX}'
            })
        }));

        series.columns.template.setAll({
            height: am5.p100
        });


        series.bullets.push(function() {
            return am5.Bullet.new(root, {
                locationX: 1,
                locationY: 0.5,
                sprite: am5.Label.new(root, {
                    centerY: am5.p50,
                    text: '{valueX}',
                    populateText: true
                })
            });
        });

        series.bullets.push(function() {
            return am5.Bullet.new(root, {
                locationX: 1,
                locationY: 0.5,
                sprite: am5.Label.new(root, {
                    centerX: am5.p100,
                    centerY: am5.p50,
                    text: '{name}',
                    fill: am5.color(0xffffff),
                    populateText: true
                })
            });
        });

        series.data.setAll(data);
        series.appear();

        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        const legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50
        }));

        legend.data.setAll(chart.series.values);


        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
            behavior: 'zoomY'
        }));
        cursor.lineY.set('forceHidden', true);
        cursor.lineX.set('forceHidden', true);


        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
        // Add cursor

        return () => {
            root.dispose();
        };
    }, [data, histogramId]);

    return (
        <div className={styles.wrapper}>
            <h3>{name}</h3>
            <div id={histogramId} style={{width: '100%', height: '500px'}}/>
        </div>
    );
};

export default Histogram;

