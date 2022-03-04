import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from '@material-ui/core';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {TableState} from './Work';
import {CopyToClipboard} from 'react-copy-to-clipboard';

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

    iconMock: {
        width: '20px',
        height: '20px',
        backgroundColor: 'black',
        // diaplay: 'none',
    },

    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        gridGap: '15px',
        backgroundColor: 'red',

        '&:hover': {
            '& .MuiIconMock-root': {
                // backgroundColor: 'gray',
                display: 'block',
            }
        },
    },
});

const useStyle = makeStyles({
    root: {
        width: '20px',
        height: '20px',
        backgroundColor: 'black',
        display: 'none',
    },
}, {name: 'MuiIconMock'});

interface InputCellProps {
    inputValue: string,
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

interface CustomTableProps {
    array: TableState[],
    setArray: Dispatch<SetStateAction<TableState[]>>,
}

const TextCell = (props: {cellText: string | null}) => {
    const {cellText} = props;
    const styles = useStyles();
    const classes = useStyle();

    const clickHandler = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        navigator.clipboard.readText().then(
            (data) => {
                console.log('copied', data);
            });
    };

    if (!cellText) {
        return <>...</>;
    } else {
        return (
            <div className={styles.iconContainer}>
                {cellText}
                <CopyToClipboard text={cellText || ''}>
                    <div className={classes.root} onClick={clickHandler}/>
                </CopyToClipboard>
            </div>
        );
    }
};

const InputCell = ({inputValue, onChange}: InputCellProps) => {
    const styles = useStyles();

    return (
        <TextField
            variant="standard"
            className={styles.input}
            value={inputValue}
            onChange={onChange}
            autoFocus
        />
    );
};

const CustomTable = ({array, setArray}: CustomTableProps) => {
    const styles = useStyles();
    const [inputNumber, setInputNumber] = useState(0);
    const [state, setState] = useState('');

    const cellClickHandler = (evt: any) => {
        const id = +evt.currentTarget.id.split('_')[1];
        if (id !== inputNumber) {
            setState(array[id % 3 + 1].data[~~(id / 3)].value?.toString() || '');
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
                                const cellNumber = idx * 3 + index - 1;

                                if (index === 0) {
                                    return (
                                        <TableCell key={'leftCell_' + cellNumber + 1} width="25%">
                                            {cur.data[idx].name}
                                        </TableCell>
                                    );
                                }

                                const changeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
                                    setArray((arr) => {
                                        cur.data[idx].value = evt.target.value;
                                        return arr;
                                    });
                                    setState(evt.target.value);
                                };

                                return (
                                    <TableCell
                                        id={'cell_' + cellNumber}
                                        key={'cell_' + cellNumber}
                                        width={'25%'}
                                        onClick={cellClickHandler}
                                        className={styles.pointer}
                                    >
                                        {inputNumber === cellNumber ?
                                            <InputCell inputValue={state} onChange={changeHandler}/> :
                                            <TextCell cellText={cur.data[idx].value} />
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
