import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Header from '@Header';
import {Button, Typography} from '@material-ui/core';
import classNames from 'classnames';
import CustomTable from './CustomTable';
import mockTable from './tableMock';

const useStyles = makeStyles(() => ({
    mainContainer: {
        display: 'grid',
        gridTemplateAreas: '"timer content"',
        gridTemplateColumns: 'minmax(200px, 1fr) 4fr', // TODO тут можно поиграться в зависимости от размеров таймера
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
    }
}));

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
        value: number,
    }[],
}

const Task = ({number, themeName, description, values}: TaskProps) => {
    const styles = useStyles();

    return (
        <>
            <Typography variant="h5">
                {`Контрольная работа №${number} по теме “${themeName}”.`}
            </Typography>
            <span>
                <Typography variant="h6" className={styles.span}>
                    {description + ' '}
                </Typography>
                <Typography variant="h6" className={classNames(styles.selection, styles.span)}>
                    {values.reduce((res, cur) => {
                        return res + `${cur.name} = ${cur.value} `;
                    }, ' ')}
                </Typography>
                <Typography variant="h6" className={styles.span}>
                    {' Удачи;)'}
                </Typography>
            </span>
        </>
    );
};

const Work = () => {
    const styles = useStyles();
    const [taskArray, setTaskArray] = useState<TableState[]>(mockTable);

    const clickHandle = () => {
        console.log(taskArray);
        // TODO тут надо отправить результат работы на бэк
    };

    return (
        <>
            <Header/>
            <div className={styles.mainContainer}>
                <div className={styles.timerContainer}>
                    <circle className={styles.timer}>timer</circle>
                </div>
                <div className={styles.contentContainer}>
                    <Task
                        number={1}
                        description={'Сделать то-то и то-то.'}
                        themeName={'Сложение'}
                        values={[
                            {name: 'A', value: 1001},
                            {name: 'B', value: 1101},
                        ]}
                    />
                    <CustomTable array={taskArray} setArray={setTaskArray}/>
                    <Button
                        variant="contained"
                        color="primary"
                        className={styles.button}
                        onClick={clickHandle}
                    >
                        Отправить
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Work;
