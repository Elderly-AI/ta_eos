import Header from '../../../src/components/Header';
import React, {useEffect, useState} from 'react';
import {Button, makeStyles, Step, StepContent, StepLabel, Stepper, Typography} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import CustomBadge from '../CustomBadge';
import DataService from '../../../src/data/DataService';
import {WorkItem} from '../../../src/data/Models';
import {useTypedSelector} from '../../../src/hooks/useTypedSelector';
import {useActions} from '../../hooks/useActions';

const useStyles = makeStyles(() => ({
    worksComponent: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '10vw',
        marginRight: '10vw',
        marginTop: '15vh',
        width: '80vw',
    },
    labelComponent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left',
        marginLeft: '5vw',
        marginRight: '5vw',
    },
    tableComponent: {
        marginTop: '5vh',
        marginBottom: '10vh',
        maxWidth: '70vw',
        marginLeft: '5vw',
        marginRight: '5vw',
    },
    text: {
        color: '#FFFFFF'
    }
}));

export default function Works() {
    const history = useHistory();
    const classes = useStyles();
    const auth = useTypedSelector((store) => store.auth);
    const [works, setWorks] = useState<WorkItem[]>([]);
    const [activeStep, setActiveStep] = useState<number>(0);
    const {getCurrentUser} = useActions();

    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        if (!auth || (auth && !auth.grades)) {
            return;
        }

        DataService.getWork(auth?.userId ?? '', auth?.grades ?? {}).then((res) => {
            const firstActive = res.findIndex((item) => item.possibility) ?? 0;
            setActiveStep(firstActive);
            setWorks(res);
        });
    }, [auth]);

    const startWork = () => {
        history.push(`work/${auth?.userId}`);
    // TODO: Дима Овденко, тут делай
    };

    return (
        <div className={classes.worksComponent}>
            <Header/>
            <div className={classes.labelComponent}>
                <Typography variant="h5">
          Список контрольных работ по дисциплине “Теория автоматов”
                </Typography>
            </div>
            <div className={classes.tableComponent}>
                {
                    works.length && (
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {works.map((work: WorkItem, index: number) => (
                                <Step key={index}>
                                    <StepLabel>

                                        <CustomBadge
                                            isSuccessBadge={work?.estimation as number > 3}
                                            text={'КР №' + (index + 1) + ' ' + work.name}
                                        >
                                            {!isNaN(work.estimation as number) && (
                                                <Typography className={classes.text}>
                                                    {work.estimation}
                                                </Typography>
                                            )}
                                        </CustomBadge>

                                    </StepLabel>
                                    <StepContent>
                                        <div>
                                            <Button variant='contained' onClick={startWork}>
                        Начать
                                            </Button>
                                        </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    )
                }
            </div>
        </div>
    );
}
