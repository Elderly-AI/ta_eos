import Header from '@Header';
import React from 'react';
import {Button, makeStyles, Step, StepContent, StepLabel, Stepper, Typography} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import CustomBadge from '../CustomBadge';

class Work {
  name: string;
  estimation?: string;
  possibility: boolean;

  constructor(name: string, possibility: boolean, estimation?: string,) {
      this.name = name;
      this.estimation = estimation;
      this.possibility = possibility;
  }
}

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
    labelWrapper: {
        display: 'flex',
        gap: '8px',
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

    const works: Work[] = [
        new Work('Если не справился, ты идиот', false, 'отл',),
        new Work('Если не справился, ты лестеховец', true),
        new Work('Если не справился, ты норм пацан', false),
    ];

    const activeStep = 1;

    const startWork = () => {
        history.push('work/1');
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
                <Stepper activeStep={activeStep} orientation="vertical">
                    {works.map((work, index) => (
                        <Step key={index}>
                            <div className={classes.labelWrapper}>
                                <StepLabel>
                                    {'КР №' + (index + 1) + ' ' + work.name}
                                </StepLabel>
                                {
                                    work.estimation && (
                                        <CustomBadge>
                                            <Typography className={classes.text}>
                                                {work.estimation}
                                            </Typography>
                                        </CustomBadge>
                                    )
                                }
                            </div>
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
            </div>
        </div>
    );
}
