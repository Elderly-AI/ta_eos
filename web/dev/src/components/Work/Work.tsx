import React, {useEffect, useMemo, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Header from '@Header';
import {Button, Typography} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
// import Alert from '@material-ui/core/Alert';
import classNames from 'classnames';
import CustomTable from './CustomTable';
import DataService from '@data/DataService';
import {TemplateTemplateRequest} from '@data/Models';
import {CountdownCircleTimer} from 'react-countdown-circle-timer';

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
        alignItems: 'center',
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
        width: '150px',
        height: '150px',
        borderRadius: '1000px',
        backgroundColor: 'slategray',
        color: 'white',
        textAlign: 'center',
        lineHeight: '150px',
    },

    time: {
        fontSize: '40px',
    },

    table: {
        height: '400px',
        width: '100%',
        backgroundColor: 'darkgray',
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
    }
}));

const OkResult = 'Отличная работа! Все верно';
const BadResult = 'В одном или более ответе ошибка(';

export interface TableState {
  data: {
    name: string,
    value: string | null,
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
    const [isPlaying, setPlaying] = useState(true);

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
        console.log(taskArray);
        if (!template) {
            return alert('Упс! У нас тут ошибка, повторите попытку позже');
        }
        // console.log('debug template', template);
        const preparedData = template;
        preparedData.data.UI[0].data = [template.data.UI[0].data[0], ...taskArray];
        // console.log('debug prep', preparedData);
        DataService.approveKR('first', preparedData)
            .then((res) => {
                // console.log('debug res', res)
                if (JSON.stringify(preparedData) !== JSON.stringify(res)) {
                    setMessage(BadResult);
                    // alert('Ошибка! Один из ваших ответов неправильный');
                } else {
                    setMessage(OkResult);
                    // alert('Ок');
                }
            });
    };

    useEffect(() => {
        console.log('debug task', taskArray);
    }, [taskArray]);

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
                <div className={styles.contentContainer}>
                    <Task
                        number={1}
                        description={'Сделать то-то и то-то.'}
                        themeName={'Сложение'}
                        values={taskTitle}
                    />
                    <CustomTable array={taskArray} setArray={setTaskArray}/>
                    <Button
                        variant="contained"
                        color="primary"
                        className={styles.button}
                        onClick={clickHandle}
                        disabled={disableButton}
                    >
            Отправить
                    </Button>
                    {resultMessage === '' ? '' :
                        <Alert
                            variant="filled"
                            severity={resultMessage === BadResult ? 'error' : 'success'}
                            className={resultMessage === BadResult ? styles.redAlert : ''}
                        >
                            {resultMessage}
                        </Alert>
                    }
                </div>
            </div>
        </>
    );
};

export default Work;
