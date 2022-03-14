import {
    Checkbox,
    FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@material-ui/core';
import React, {Dispatch, FC, SetStateAction, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {TableState} from './Work';
import classNames from 'classnames';
import useClippy from 'use-clippy';
import TableInput from './TableInput';
import ReactTestUtils from 'react-dom/test-utils';

const useStyles = makeStyles({
    tableRow: {
        height: '70px',
    },

    tableHead: {
        fontWeight: 'bold',
    },

    input: {},

    pointer: {
        cursor: 'pointer',
    },

    iconContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gridGap: '15px',

        '&:hover': {
            '& .MuiCustomSvgIcon-root': {
                display: 'block !important',
            }
        },
    },

    left: {
        left: '-35px',
    },

    wrongCell: {
        borderBottom: '1px solid #ff1515',
    },

    iconFontSize: {
        fontSize: '1rem !important',
    },

    flex: {
        display: 'flex',
    },

    icon: {
        width: '1em',
        height: '1em',
        fontSize: '1rem',
        fill: '#0d47a1',
    },

    checkboxContainer: {
        margin: '0',
    },
});

const useStyle = makeStyles({
    root: {
        display: 'none !important',
    },
}, {name: 'MuiCustomSvgIcon'});

enum AnswerType {
  UNCHECKED,
  CORRECT,
  WRONG
}

enum OpType {
    REGULAR,
    SUM,
    SHIFT
}

interface InputCellProps {
  inputValue: string,
  onChange: (evt: any, value?: string) => void,
  copiedText: string,
  operationType: OpType,
  overflow: boolean | null | undefined,
  setOverflow: (evt: any) => void,
}

interface CustomTableProps {
  array: TableState[],
  compareArray: TableState[],
  setArray: Dispatch<SetStateAction<TableState[]>>,
}

type TextCellProps = {
  cellText: string | null,
  copyText: (text: string) => void,
  isAnswerCorrect: AnswerType
}

const TextCell: FC<TextCellProps> = ({cellText, copyText, isAnswerCorrect}) => {
    const styles = useStyles();
    const classes = useStyle();

    const clickHandler = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        const value = cellText?.replaceAll('_', '');
        copyText(value || '');
    };

    if (!cellText) {
        return <div className={styles.flex}>
            <Typography
                className={`${isAnswerCorrect ? styles.wrongCell : ''}`}
                variant="subtitle1"
            >
                ...
            </Typography>
        </div>;
    } else {
        return (
            <div className={styles.iconContainer}>
                <Typography
                    className={`${isAnswerCorrect ? styles.wrongCell : ''}`}
                    variant="subtitle1">
                    {cellText}
                </Typography>
                <svg className={classNames(styles.icon, classes.root)} viewBox="0 0 24 24" onClick={clickHandler}>
                    {/* eslint-disable max-len */}
                    <path
                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
            </div>
        );
    }
};

const InputCell = ({inputValue, onChange, copiedText, operationType, overflow, setOverflow}: InputCellProps) => {
    const styles = useStyles();
    const ref = useRef<HTMLInputElement>(null);

    const clickHandler = (evt: React.MouseEvent) => {
        evt.stopPropagation();

        const input = ref.current as HTMLInputElement;
        input.value = copiedText;
        ReactTestUtils.Simulate.change((ref.current as HTMLInputElement));
    };

    let checkbox: JSX.Element;

    switch (operationType) {
    case OpType.REGULAR:
        checkbox = <></>;
        break;
    case OpType.SHIFT:
    case OpType.SUM:
        checkbox =
            <FormControlLabel
                className={styles.checkboxContainer}
                value="top"
                control={<Checkbox size="small" color="primary" checked={overflow ? overflow : false}
                    onChange={setOverflow} />}
                label=""
                labelPlacement="top"
            />;
        break;
    }

    return (
        <div className={classNames(styles.iconContainer, operationType !== OpType.REGULAR ? styles.left : '')}>
            {checkbox}
            <TableInput id="input" ref={ref} value={inputValue} onChange={onChange} className={styles.input}/>
            <svg className={styles.icon} viewBox="0 0 24 24" onClick={clickHandler}>
                {/* eslint-disable max-len */}
                <path
                    d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
            </svg>
        </div>
    );
};

const transformName = (name: string) => {
    if (name.includes('>>')) {
        return name.replace('>>', '*2^');
    }
    if (name.includes('<<')) {
        return name.replace('<<', '*2^-');
    }
    return name;
};

const getOpType = (name: string) => {
    if (name.includes('>>') || name.includes('<<')) {
        return OpType.SHIFT;
    }
    if (name.includes('+')) {
        return OpType.SUM;
    }
    return OpType.REGULAR;
};

const CustomTable = ({array, setArray, compareArray}: CustomTableProps) => {
    const styles = useStyles();
    const [inputNumber, setInputNumber] = useState(0);
    const [inputText, setInputText] = useState('');
    const [inputCheckbox, setInputCheckbox] = useState(false);
    const [text, setText] = useClippy();

    const cellClickHandler = (evt: any) => {
        const id = +evt.currentTarget.id.split('_')[1];
        if (id !== inputNumber) {
            setInputText(array[id % 3 + 1].data[~~(id / 3)].value?.toString() || '');
            setInputCheckbox(array[id % 3 + 1].data[~~(id / 3)].overflow || false);
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
                                width={'16%'}
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
                                let answerType: AnswerType = AnswerType.UNCHECKED;

                                if (index === 0) {
                                    return (
                                        <TableCell key={'leftCell_' + tmpCellNumber + 1} width="28%">
                                            {transformName(cur.data[idx].name)}
                                        </TableCell>
                                    );
                                }

                                if (compareArray.length) {
                                    answerType = array[index].data[idx].value === compareArray[index].data[idx].value ?
                                        AnswerType.CORRECT : AnswerType.WRONG;// TODO добавить чекбокс в проверку
                                }


                                const changeHandler = (evt: any, value?: string) => {
                                    // currentTarget.value - полное значение, target.value - текущий разряд
                                    setArray((arr) => {
                                        arr[index].data[idx].value = evt?.currentTarget.value || value || '';
                                        return arr;
                                    });
                                    setInputText(evt?.currentTarget.value || value || '');
                                };

                                const changeCheckBoxHandler = (evt: any) => {
                                    setArray((arr) => {
                                        arr[index].data[idx].overflow = evt.target.checked;
                                        return arr;
                                    });
                                    setInputCheckbox(evt.target.checked);
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
                                                operationType={getOpType(cur.data[idx].name)}
                                                overflow={inputCheckbox}
                                                setOverflow={changeCheckBoxHandler}
                                            /> :
                                            <TextCell
                                                isAnswerCorrect={answerType}
                                                cellText={cur.data[idx].value}
                                                copyText={setText}
                                            />
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
