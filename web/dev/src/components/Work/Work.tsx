import React, {useEffect, useMemo, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Header from '@Header';
import {Button, Typography} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import classNames from 'classnames';
import CustomTable from './CustomTable';
import DataService from '@data/DataService';
import {TemplateTemplateRequest} from '@data/Models';
import {CountdownCircleTimer} from 'react-countdown-circle-timer';
import TableInput from './TableInput';

const useStyles = makeStyles(() => ({
    none: {
        display: 'none !important',
    },

    block: {
        display: 'inline !important',
    },

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

    redAlert: {
        backgroundColor: '#A30000',
    },

    resultMessageWrapper: {
        display: 'grid',
        gridAutoFlow: 'row'
    }
}));

const OkResult = 'Отличная работа! Все верно.';
const BadResult = 'В одном или более ответе ошибка.';
const getPointMessage = (point: number): string => {
    return `Ваша оценка = ${point}`;
};

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
    const styles = useStyles();
    const [taskArray, setTaskArray] = useState<TableState[]>([]);
    const [template, setTemplate] = useState<TemplateTemplateRequest | null>(null);
    const [disableButton, setDisable] = useState(false);
    const [resultMessage, setMessage] = useState<string>('');
    const [compareArray, setCompareArray] = useState<TableState[]>([]);
    const [currentPoint, setCurrentPoint] = useState<number | undefined>();
    const [isPlaying, setPlaying] = useState(true);

    const [close, setClose] = useState(false);

    useEffect(() => {
        DataService.getKR('first')
            .then((res) => {
                setTemplate(res);
                const newState = res.data.UI[0].data.filter((item) => item.name !== 'Переменные');
                setTaskArray(newState);
            });
    }, []);

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
        console.log(preparedData);
        DataService.approveKR('first', preparedData)
            .then((res) => {
                setCurrentPoint(res.point ?? 0);
                setCompareArray(res.data.UI[0].data.slice(1));

                if (JSON.stringify(preparedData) !== JSON.stringify(res)) {
                    setMessage(BadResult);
                } else {
                    setMessage(OkResult);
                }
            });
    };

    const time = 300;
    const renderTime = (remainingTime: number) => {
        if (remainingTime === time) {
            return <div className="timer">Время истекло</div>;
        }
        const seconds = Math.round(time - remainingTime);
        const minutes = Math.floor(seconds / 60);
        const text = minutes > 0 ? `${minutes}:${seconds % 60}` : `${seconds % 60}`;
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
                            severity={resultMessage.includes(BadResult) ? 'error' : 'success'}
                            className={resultMessage.includes(BadResult) ? styles.redAlert : ''}
                        >
                            <div className={styles.resultMessageWrapper}>
                                {resultMessage}
                                <Typography variant='h6'>
                                    {getPointMessage(currentPoint ?? 0)}
                                </Typography>
                            </div>
                        </Alert>
                    )}
                    <TableInput id={'1234567'} className={close ? styles.none : styles.block}/>
                    <button onClick={() => {
                        console.log(close);
                        setClose((prev) => !prev);
                    }}>Click</button>
                </div>
            </div>
        </>
    );
};

export default Work;
