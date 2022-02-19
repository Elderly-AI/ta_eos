import React, {useMemo, useRef} from 'react';
import {NormalizedMetricsType} from '../Admin';
import Histogram, {HistogramDataType, HistogramProps} from './Histogram/Histogram';
import {makeStyles, Theme} from '@material-ui/core/styles';
// eslint-disable-next-line camelcase

export type MetricType = 'Histogram' | 'Donut';

export interface MetricProps {
  metric: MetricType,
  chartsData: NormalizedMetricsType
}

const useStyles = makeStyles((theme: Theme) => ({
    histograms: {
        display: 'grid',
        gridAutoFlow: 'row',
        gap: '32px',
        padding: '64px'
    }
}));

const Metric: React.FC<MetricProps> = ({
    metric,
    chartsData,
}) => {
    const metricId = useRef(`metric_${Date.now()}`);
    const styles = useStyles();
    const histogramData: HistogramProps[] = useMemo(() => {
        const data: HistogramProps[] = [];

        chartsData.forEach((item, key) => {
            const temp: Record<string, any> = {};

            item.forEach((curMetric) => {
                const key = curMetric.date;

                if (!temp[key]) {
                    temp[key] = 1;
                } else {
                    temp[key] = temp[key] + 1;
                }
            });

            const chart: HistogramDataType[] = [];
            Object.keys(temp).forEach((preparedData) => {
                chart.push({
                    date: preparedData,
                    value1: temp[preparedData]
                });
            });

            data.push({
                histogramId: `histo_key_${key}`,
                data: chart,
                name: key
            });
        });

        return data;
    }, [chartsData]);

    if (metric === 'Histogram' && histogramData) {
        return <div className={styles.histograms}>
            {
                histogramData.map((histogram, index) => <Histogram key={`${metricId}_${index}`} {...histogram}/>)
            }
        </div>;
    }

    if (metric === 'Donut') {
        return <div>
      donut
        </div>;
    }

    return <div>
    none
    </div>;
};

export default Metric;
