import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from '@material-ui/core';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {TableState} from './Work';

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
    }
});

interface CustomTableProps {
    array: TableState[],
    setArray: Dispatch<SetStateAction<TableState[]>>,
}

const CustomTable = ({array, setArray}: CustomTableProps) => {
    const styles = useStyles();
    const [inputNumber, setInputNumber] = useState(0);
    const [state, setState] = useState('');

    const cellClickHandler = (evt: any) => {
        const id = +evt.currentTarget.id.split('_')[1];
        if (id !== inputNumber) {
            setState(array[id%3+1].data[~~(id/3)].value?.toString() || '');
            setInputNumber(id);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {
                            array.map((cur) => (
                                <TableCell
                                    className={styles.tableHead}
                                    align="left"
                                    width={'25%'}
                                    key={'headCell_' + cur.name}
                                >
                                    {cur.name}
                                </TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        array[0].data.map((current, idx) => (
                            <TableRow key={'row_' + idx} className={styles.tableRow} hover>
                                {
                                    array.map((cur, index) => (
                                        index === 0 ?
                                            <TableCell
                                                key={'leftCell_' + idx * 3 + index}
                                                width={'25%'}
                                            >
                                                {cur.data[idx].name}
                                            </TableCell> :
                                            <TableCell
                                                id={'cell_' + (idx * 3 + index - 1)}
                                                key={'cell_' + (idx * 3 + index - 1)}
                                                width={'25%'}
                                                onClick={cellClickHandler}
                                                className={styles.pointer}
                                            >
                                                {
                                                    inputNumber === idx * 3 + index - 1 ?
                                                        <TextField
                                                            variant="standard"
                                                            className={styles.input}
                                                            value={state}
                                                            onChange={(evt) => {
                                                                setArray((arr) => {
                                                                    cur.data[idx].value = evt.target.value;
                                                                    return arr;
                                                                });
                                                                setState(evt.target.value);
                                                            }
                                                            }
                                                            autoFocus
                                                        /> :
                                                        (cur.data[idx].value || '...')
                                                }
                                            </TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomTable;
