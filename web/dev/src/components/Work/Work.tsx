import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Header from '../../../src/components/Header';
import {Button, Typography} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import classNames from 'classnames';
import CustomTable from './CustomTable';
import DataService from '../../../src/data/DataService';
import {TemplateTemplateRequest} from '../../../src/data/Models';
import {CountdownCircleTimer} from 'react-countdown-circle-timer';
import {ArrowBack} from '@mui/icons-material';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles(() => ({
    mainContainer: {
        display: 'grid',
        gridTemplateAreas: '"timer content"',
        gridTemplateColumns: 'minmax(200px, 1fr) 4fr',
        marginTop: '64px',
        height: '100%',
    },

    timerContainer: {
        gridArea: 'timer',
        backgroundColor: 'white',
        boxShadow: 'inset -2px 0px 0px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        justifyContent: 'center',
    },

    contentContainer: {
        gridArea: 'content',
        backgroundColor: '#fafafa',
        padding: '30px 50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        gridGap: '30px',
    },

    timer: {
        position: 'fixed',
        top: '50%',
        transform: 'translate(0, -25%)',
    },

    time: {
        fontSize: '40px',
    },

    button: {
        width: 'min-content',
        alignSelf: 'end',
    },

    selection: {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },

    span: {
        display: 'inline',
        whiteSpace: 'pre-wrap',
    },

    alert: {
        '& .MuiAlert-icon': {
            paddingTop: '11px',
            paddingBottom: '8px',
        },
        '& .MuiAlert-message': {
            width: '100%',
        }
    },

    redAlert: {
        backgroundColor: '#A30000',
    },

    alertText: {
        '& .MuiTypography-subtitle1': {
            backgroundColor: 'blue',
            fontWeight: 500,
        },
    },

    backWrapper: {
        display: 'grid',
        gridAutoFlow: 'column',
        gap: '8px',
        cursor: 'pointer'
    },

    backBtn: {
        alignSelf: 'flex-end'
    },

    resultMessageWrapper: {
        display: 'grid',
        gridAutoFlow: 'row',
        width: '100%'
    },

    resultPointsWrapper: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));
const MAX_POINTS = 30;
const OkResult = 'Отличная работа! Все верно.';

const getPointMessage = (point: number): string => {
    return `Ваша оценка: ${point}/${MAX_POINTS}`;
};

const getBadMessage = (mistakesCount: number): string => (
    `Вы сделали ${mistakesCount} ошибок`
);

export interface TableState {
  data: {
    name: string,
    value: string | null,
    overflow?: boolean | null,
  }[],
  name: string,
}


interface TaskProps {
  number: number,
  themeName: string,
  description: string,
  values: {
    name: string,
    value: string | null,
  }[] | undefined,
}

const Task = ({number, themeName, description, values}: TaskProps) => {
    const styles = useStyles();

    const getTaskTitle = (): JSX.Element => {
        if (!values) {
            return (
                <Typography variant="h6" className={classNames(styles.selection, styles.span)}>
          ---
                </Typography>
            );
        }
        return <Typography variant="h6" className={classNames(styles.selection, styles.span)}>
            {values?.reduce((res, cur) => {
                return res + `${cur.name} = ${cur.value} `;
            }, ' ')}
        </Typography>;
    };

    return (
        <>
            <Typography variant="h5">
                {`Контрольная работа №${number} по теме “${themeName}”.`}
            </Typography>
            <span>
                <Typography variant="h6" className={styles.span}>
                    {description + ' '}
                </Typography>
                {
                    getTaskTitle()
                }
                <Typography variant="h6" className={styles.span}>
                    {' Удачи;)'}
                </Typography>
            </span>
        </>
    );
};

const Work = () => {
    const history = useHistory();
    const styles = useStyles();
    const [mistakesCount, setMistakesCount] = useState<number>(0);
    const [taskArray, setTaskArray] = useState<TableState[]>([]);
    const [template, setTemplate] = useState<TemplateTemplateRequest | null>(null);
    const [disableButton, setDisable] = useState(false);
    const [resultMessage, setResultMessage] = useState<string>('');
    const [compareArray, setCompareArray] = useState<TableState[]>([]);
    const [currentPoint, setCurrentPoint] = useState<number | undefined>();
    const [isPlaying, setPlaying] = useState(true);

    const changeMistakesCount = useCallback((count: number) => {
        setMistakesCount(count);
    }, [setMistakesCount]);

    useEffect(() => {
        if (mistakesCount > 0) {
            setResultMessage(getBadMessage(mistakesCount));
        }
    }, [mistakesCount]);

    useEffect(() => {
        DataService.getKR('first')
            .then((res) => {
                setTemplate(res);
                const newState = res.data.UI[0].data.filter((item) => item.name !== 'Переменные');
                setTaskArray(newState);
            });
    }, []);

    useEffect(() => {
        setMistakesCount(0);
    }, [taskArray]);

    const taskTitle = useMemo(() => {
        if (!taskArray.length) {
            return;
        }

        const taskItem = taskArray.find((item) => item.name === 'Значения');

        if (!taskItem) {
            return undefined;
        }

        return [{
            name: taskItem.data[0].name,
            value: taskItem.data[0].value
        },
        {
            name: taskItem.data[1].name,
            value: taskItem.data[1].value
        }

        ];
    }, [taskArray]);

    const clickHandle = () => {
        setDisable(true);
        setPlaying(false);
        if (!template) {
            return alert('Упс! У нас тут ошибка, повторите попытку позже');
        }
        const preparedData = template;
        preparedData.data.UI[0].data = [template.data.UI[0].data[0], ...taskArray];
        // todo убрать логи на проде!
        preparedData.data.UI[0].data.forEach((cur, index) => {
            if (index > 1) {
                console.log(cur.name);
                console.table(cur.data);
            }
        });
        DataService.approveKR('first', preparedData)
            .then((res) => {
                setCurrentPoint(res.point ?? 0);
                setCompareArray(res.data.UI[0].data.slice(1));

                if (JSON.stringify(preparedData) === JSON.stringify(res)) {
                    setResultMessage(OkResult);
                }
            });
    };

    const time = 3000;
    const renderTime = (remainingTime: number) => {
        if (remainingTime === time) {
            return <div className="timer">Время истекло</div>;
        }
        const seconds = Math.round(time - remainingTime);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const stringSeconds = (remainingSeconds < 10 && minutes > 0 ? '0' : '') + remainingSeconds;
        const text = minutes > 0 ? `${minutes}:${stringSeconds}` : `${stringSeconds}`;
        return (
            <div className="time-wrapper">
                <div className={styles.time}>{text}</div>
            </div>
        );
    };

    return (
        <>
            <Header/>
            <div className={styles.mainContainer}>
                <div className={styles.timerContainer}>
                    <div className={styles.timer}>
                        <CountdownCircleTimer
                            isPlaying={isPlaying}
                            duration={time}
                            colors={['#00A318', '#F7B801', '#A30000']}
                            size={160}
                            colorsTime={[time, Math.floor(time / 2), 0]}
                            onComplete={() => {
                                clickHandle();
                                return {shouldRepeat: false};
                            }}
                        >
                            {({elapsedTime, color}) => (
                                <span style={{color}}>
                                    {renderTime(elapsedTime)}
                                </span>
                            )}
                        </CountdownCircleTimer>
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    <Task
                        number={1}
                        description={'Сделать то-то и то-то.'}
                        themeName={'Сложение'}
                        values={taskTitle}
                    />
                    <CustomTable
                        mistakeCountHandler={changeMistakesCount}
                        array={taskArray}
                        compareArray={compareArray}
                        setArray={setTaskArray}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className={styles.button}
                        onClick={clickHandle}
                        disabled={disableButton}
                    >
            Отправить
                    </Button>
                    {!!resultMessage.length && (
                        <Alert
                            variant="filled"
                            severity={!resultMessage.includes(OkResult) ? 'error' : 'success'}
                            className={`
                              ${styles.alert}
                              ${!resultMessage.includes(OkResult) ? styles.redAlert : ''}
                            `}
                        >
                            <div className={styles.resultMessageWrapper}>
                                <div className={styles.resultPointsWrapper}>
                                    <Typography
                                        style={{
                                            fontWeight: 500
                                        }}
                                        variant='subtitle1'>
                                        {getPointMessage(currentPoint ?? 0)}
                                    </Typography>

                                    <div
                                        onClick={() => {
                                            history.push('/home');
                                        }}
                                        className={styles.backWrapper}
                                    >
                                        <Typography
                                            style={{
                                                fontWeight: 500
                                            }}
                                            variant='subtitle1'>
                      На главную
                                        </Typography>
                                        <ArrowBack
                                            className={styles.backBtn}
                                        />
                                    </div>

                                </div>
                                {resultMessage}
                            </div>
                        </Alert>
                    )}
                </div>
            </div>
        </>
    );
};

export default Work;
