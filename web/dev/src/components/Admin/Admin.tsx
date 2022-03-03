import React, {useEffect, useMemo, useState} from 'react';
import Header from '@Header';
import {makeStyles} from '@mui/styles';
import {blue} from '@material-ui/core/colors';
import {Paper} from '@material-ui/core';
import Metric from './Metric/Metric';
import {useParams} from 'react-router-dom';
import DataService from '@data/DataService';
import {metricsMetric} from '@data/Models';
import metricName from './metricName';
import {createTheme} from '@mui/material';

const theme = createTheme();

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: blue[800],
    },
    paper: {
        width: theme.spacing(140),
        height: '100%',
        margin: '124px 0'
    }
}));

export type NormalizedMetricsItem = {
  date: string,
  metricData?: any
};

export type NormalizedMetricsType = Map<string, NormalizedMetricsItem[]>;

const Admin: React.FC = () => {
    const {userId} = useParams<{
    userId: string
  }>();
    const classes = useStyles();
    const [metrics, setMetrics] = useState<metricsMetric[]>();

    useEffect(() => {
        DataService.searchMetric(userId)
            .then((res) => setMetrics(res.metrics))
            .catch((err) => console.log('res err', err));
    }, []);

    const normalizedMetrics: NormalizedMetricsType | undefined = useMemo(() => metrics?.reduce((acc, cur) => {
        const name: string = cur.methodName;
        // @ts-ignore
        const translated: string = metricName[name];
        if (!translated) {
            return acc;
        }

        const val: NormalizedMetricsItem = {
            date: new Date(cur.date).toLocaleDateString('ru-RU'),
            metricData: cur.metricData
        };

        acc.has(translated) ? acc?.get(translated)?.push(val) : acc.set(translated, [val]);
        return acc;
    }, new Map() as NormalizedMetricsType), [metrics]);

    return (
        <div className={classes.container}>
            <Header/>
            <Paper className={classes.paper}>
                <Metric chartsData={normalizedMetrics ?? new Map() as NormalizedMetricsType} metric='Histogram'/>
            </Paper>
        </div>
    );
};

export default Admin;

