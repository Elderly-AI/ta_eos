import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from '@material-ui/core';
import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    tableView: {
        // backgroundColor: 'red',
    },

    input: {
        // width: 'min-content',
        width: '100px',
    },
});

const CustomTable = () => {
    const styles = useStyles();
    const [inputNumber, setInputNumber] = useState(0);
    const [arr, setArr] = useState<number[]>([1, 2, 3, 4]);
    const [state, setState] = useState('10010');

    const cellClickHandler = (evt: any) => {
        console.log('click', evt.currentTarget.id.split('_'));
        const id = +evt.currentTarget.id.split('_')[1];
        if (id !== inputNumber) {
            setState(arr[id].toString());
            setInputNumber(id);
        }
    };

    return (
        <TableContainer component={Paper} className={styles.tableView}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left"/>
                        <TableCell align="left">Прямой</TableCell>
                        <TableCell align="left">Обратный</TableCell>
                        <TableCell align="left">Дополнительный</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {
                            [0, 1, 2, 3].map((cur) => (
                                <TableCell
                                    id={'cell_' + cur}
                                    key={'cell_' + cur}
                                    width={'25%'}
                                    onClick={cellClickHandler}
                                >
                                    {
                                        inputNumber === cur ?
                                            <TextField
                                                variant="standard"
                                                className={styles.input}
                                                value={state}
                                                onChange={(evt) => {
                                                    setArr((arr) => {
                                                        arr[cur] = +evt.target.value;
                                                        // arr.push(Number(evt.target.value));
                                                        return arr;
                                                    });
                                                    setState(evt.target.value);
                                                    console.log(evt.target.value);
                                                    console.log(arr);
                                                }
                                                }
                                                autoFocus
                                            /> :
                                            arr[cur]
                                    }
                                </TableCell>
                            ))
                        }
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomTable;
