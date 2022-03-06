import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {TableState} from './Work';
import classNames from 'classnames';
import useClippy from 'use-clippy';


const useStyles = makeStyles({
    tableRow: {
        height: '70px',
    },

    tableHead: {
        fontWeight: 'bold',
    },

    input: {
        width: '100px',
    },

    pointer: {
        cursor: 'pointer',
    },

    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        gridGap: '15px',

        '&:hover': {
            '& .MuiCustomSvgIcon-root': {
                display: 'block !important',
            }
        },
    },

    iconFontSize: {
        fontSize: '1rem !important',
    },

    icon: {
        width: '1em',
        height: '1em',
        fontSize: '1rem',
        fill: '#0d47a1',
    },
});

const useStyle = makeStyles({
    root: {
        display: 'none !important',
    },
}, {name: 'MuiCustomSvgIcon'});

interface InputCellProps {
    inputValue: string,
    onChange: (evt: any, value?: string) => void,
    copiedText: string,
}

interface CustomTableProps {
    array: TableState[],
    setArray: Dispatch<SetStateAction<TableState[]>>,
}

const TextCell = (props: {cellText: string | null, copyText: (text: string) => void}) => {
    const {cellText, copyText} = props;
    const styles = useStyles();
    const classes = useStyle();

    const clickHandler = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        copyText(cellText || '');

    };

    if (!cellText) {
        return <>...</>;
    } else {
        return (
            <div className={styles.iconContainer}>
                <Typography variant="subtitle1">{cellText}</Typography>
                <svg className={classNames(styles.icon, classes.root)} viewBox="0 0 24 24" onClick={clickHandler}>
                    {/* eslint-disable-next-line */}
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
            </div>
        );
    }
};

const InputCell = ({inputValue, onChange, copiedText}: InputCellProps) => {
    const styles = useStyles();

    const clickHandler = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        onChange(undefined, inputValue + copiedText);
    };

    return (
        <div className={styles.iconContainer}>
            <TextField
                variant="standard"
                className={styles.input}
                value={inputValue}
                onChange={onChange}
                autoFocus
                focused={true}
            />
            <svg className={styles.icon} viewBox="0 0 24 24" onClick={clickHandler}>
                {/* eslint-disable-next-line */}
                <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
            </svg>
        </div>
    );
};

const CustomTable = ({array, setArray}: CustomTableProps) => {
    const styles = useStyles();
    const [inputNumber, setInputNumber] = useState(0);
    const [inputText, setInputText] = useState('');
    const [text, setText] = useClippy();

    const cellClickHandler = (evt: any) => {
        const id = +evt.currentTarget.id.split('_')[1];
        if (id !== inputNumber) {
            setInputText(array[id % 3 + 1].data[~~(id / 3)].value?.toString() || '');
            setInputNumber(id);
        }
    };

    if (array.length === 0) {
        return <></>;
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {array.map((cur) => (
                            <TableCell
                                className={styles.tableHead}
                                align="left"
                                width={'25%'}
                                key={'headCell_' + cur.name}
                            >
                                {cur.name}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {array[0].data.map((current, idx) => (
                        // тут ебнутая логика с массивом: данные лежат в нем по столбцам, а таблица строится по строкам
                        // первый map идет по 1(не важно какому) столбцу и задает только номер текущей строки(idx)
                        <TableRow key={'row_' + idx} className={styles.tableRow} hover>
                            {array.map((cur, index) => {
                                // второй map идет по самим столбцам(массиву) и забирает по одному значению из них
                                // согласно номеру строки. Искренне надеюсь, что это не придется переписывать)
                                const tmpCellNumber = idx * 3 + index - 1;

                                if (index === 0) {
                                    return (
                                        <TableCell key={'leftCell_' + tmpCellNumber + 1} width="25%">
                                            {cur.data[idx].name}
                                        </TableCell>
                                    );
                                }

                                const changeHandler = (evt: any, value?: string) => {
                                    setArray((arr) => {
                                        arr[index].data[idx].value = evt?.target.value || value || '';
                                        return arr;
                                    });
                                    setInputText(evt?.target.value || value || '');
                                };

                                return (
                                    <TableCell
                                        id={'cell_' + tmpCellNumber}
                                        key={'cell_' + tmpCellNumber}
                                        width={'25%'}
                                        onClick={cellClickHandler}
                                        className={styles.pointer}
                                    >
                                        {inputNumber === tmpCellNumber ?
                                            <InputCell
                                                inputValue={inputText}
                                                onChange={changeHandler}
                                                copiedText={text}
                                            /> :
                                            <TextCell cellText={cur.data[idx].value} copyText={setText}/>
                                        }
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomTable;
