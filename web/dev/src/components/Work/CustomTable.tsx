import {
    Checkbox,
    Collapse,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@material-ui/core';
import React, {Dispatch, FC, SetStateAction, useMemo, useRef, useState} from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {makeStyles} from '@material-ui/core/styles';
import ReactTestUtils from 'react-dom/test-utils';
import classNames from 'classnames';
import useClippy from 'use-clippy';
import {TableState} from './Work';
import TableInput from './TableInput';
import {Cancel} from '@mui/icons-material';
import CollapseTable from './CollapseTable';

const useStyles = makeStyles({
    none: {
        display: 'none !important',
    },

    inputsMock: {
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
    },

    tableRow: {
        height: '75px',
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
        left: '-53px',
    },

    wrongCell: {
        borderBottom: '1px solid #ff1515',
    },

    correctCel: {
        borderBottom: '1px solid #00A318',
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

    collapseCell: {
        borderBottom: 'none',
        boxShadow: 'inset 0px -1px 0px rgba(224, 224, 224, 1)',
        padding: 0,
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
  mistakeCountHandler: (count: number) => void
}

type TextCellProps = {
  className?: string
  cellText: string | null,
  isOverflow?: boolean | null | undefined,
  copyText: (text: string) => void,
  isAnswerCorrect: AnswerType,
}

const TextCell: FC<TextCellProps> = ({
    cellText,
    isOverflow,
    copyText,
    isAnswerCorrect,
    className,
}) => {
    const styles = useStyles();
    const classes = useStyle();

    const clickHandler = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        const value = cellText?.replaceAll('_', '');
        copyText(value || '');
    };

    if (!cellText || isOverflow) {
        return <div className={styles.flex}>
            <Typography
                className={`${isAnswerCorrect ? styles.wrongCell : ''} ${className || ''}`}
                variant="subtitle1"
            >
                {isOverflow ? 'Переполнение' : '...'}
            </Typography>
        </div>;
    } else {
        return (
            <div className={styles.iconContainer}>
                {
                    isAnswerCorrect === AnswerType.CORRECT && (
                        <CheckCircleIcon
                            color='success'
                        />
                    )
                }
                {
                    isAnswerCorrect === AnswerType.WRONG && (
                        <Cancel
                            color='error'
                        />
                    )
                }

                <Typography
                    className={`${isAnswerCorrect ? styles.wrongCell : ''} ${className || ''}`}
                    variant="subtitle1"
                >
                    {cellText}
                </Typography>
                <svg className={classNames(styles.icon, classes.root)} viewBox="0 0 24 24" onClick={clickHandler}>
                    {/* eslint-disable max-len */}
                    <path
                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
            </div>
        )
        ;
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

    let checkbox: JSX.Element | string;

    switch (operationType) {
    case OpType.REGULAR:
    case OpType.SUM:
        checkbox = '';
        break;
    case OpType.SHIFT:
        checkbox =
        <Tooltip title={'Переполнение'} placement="left" arrow>
            <Checkbox size="small" color="primary" checked={overflow ? overflow : false} onChange={setOverflow}/>
        </Tooltip>;
        break;
    }

    return (
        <div className={classNames(styles.iconContainer, operationType === OpType.SHIFT ? styles.left : '')}>
            {checkbox}
            <TableInput
                id="input"
                ref={ref}
                value={inputValue}
                onChange={onChange}
                className={styles.input}
                disabled={overflow ? overflow : false}
            />
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
        const values = name.split('>>');
        return (
            <span>
                {values[0] + '∙2'}
                <sup>{values[1]}</sup>
            </span>
        );
    }
    if (name.includes('<<')) {
        const values = name.split('<<');
        return (
            <span>
                {values[0] + '∙2'}
                <sup>{'-' + values[1]}</sup>
            </span>
        );
    }
    if (name.includes('+')) {
        const values = name.split('+');
        if (values[1][0] === '-') {
            return values[0] + values[1];
        }
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

const CustomTable = ({array, setArray, compareArray, mistakeCountHandler}: CustomTableProps) => {
    const styles = useStyles();
    const [inputNumber, setInputNumber] = useState(0);
    const [inputText, setInputText] = useState('');
    const [inputCheckbox, setInputCheckbox] = useState(false);
    const [sumTmpValues, setSumValues] = useState<Record<string, string[]>>({});
    const [text, setText] = useClippy();

    const cellClickHandler = (evt: any) => {
        const id = +evt.currentTarget.id.split('_')[1];
        if (id !== inputNumber) {
            setInputText(array[id % 3 + 1].data[~~(id / 3)].value?.toString() || '');
            setInputCheckbox(array[id % 3 + 1].data[~~(id / 3)].overflow || false);
            setInputNumber(id);
        }
    };

    const tableBody = useMemo(() => {
        let mistakesCount = 0;

        const tableBody = <TableBody>
            {array[0]?.data?.map((current, idx) => {
                const collapse = getOpType(current.name) === OpType.SUM ?
                    <TableRow>
                        <TableCell className={styles.collapseCell} colSpan={4}>
                            <Collapse in={~~(inputNumber / 3) === idx && !compareArray.length} timeout="auto" unmountOnExit>
                                <CollapseTable
                                    idx={idx}
                                    inputNumber={inputNumber}
                                    inputValue={inputText}
                                    array={array}
                                    setInputNumber={setInputNumber}
                                    setText={setText}
                                    setArray={setArray}
                                    setInputText={setInputText}
                                    sumTmpValues={sumTmpValues}
                                    setSumValues={setSumValues}
                                />
                            </Collapse>
                        </TableCell>
                    </TableRow> :
                    '';
                // тут ебнутая логика с массивом: данные лежат в нем по столбцам, а таблица строится по строкам
                // первый map идет по 1(не важно какому) столбцу и задает только номер текущей строки(idx)
                return <>
                    <TableRow key={'row_' + idx} className={styles.tableRow} hover>
                        {array.map((cur, index) => {
                            // второй map идет по самим столбцам(массиву) и забирает по одному значению из них
                            // согласно номеру строки. Искренне надеюсь, что это не придется переписывать)
                            const tmpCellNumber = idx * 3 + index - 1;
                            let answerType: AnswerType = AnswerType.UNCHECKED;

                            if (index === 0) {
                                return (
                                    <TableCell key={'leftCell_' + tmpCellNumber + 1} width="25%">
                                        {transformName(cur.data[idx].name)}
                                    </TableCell>
                                );
                            }

                            if (compareArray.length) {
                                if (array[index].data[idx].overflow && compareArray[index].data[idx].overflow) {
                                    answerType = AnswerType.CORRECT;
                                } else {
                                    answerType = array[index].data[idx].value === compareArray[index].data[idx].value ?
                                        AnswerType.CORRECT : AnswerType.WRONG;
                                }
                            }

                            if (answerType === AnswerType.WRONG) {
                                mistakesCount++;
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

                            const cellIsInput = inputNumber === tmpCellNumber &&
                                getOpType(cur.data[idx].name) !== OpType.SUM &&
                                !compareArray.length;

                            return (
                                <TableCell
                                    id={'cell_' + tmpCellNumber}
                                    key={'cell_' + tmpCellNumber}
                                    width={'25%'}
                                    onClick={cellClickHandler}
                                    className={styles.pointer}
                                >
                                    {cellIsInput ?
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
                                            isOverflow={cur.data[idx].overflow}
                                            copyText={setText}
                                        />
                                    }
                                </TableCell>
                            );
                        })}
                    </TableRow>
                    {collapse}
                </>;
            })}
        </TableBody>;

        mistakeCountHandler(mistakesCount);

        return tableBody;
    }, [array, mistakeCountHandler, styles.tableRow, styles.pointer, compareArray, cellClickHandler, inputNumber,
        inputText, text, inputCheckbox, setText, setArray, sumTmpValues, setSumValues]);

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
                {tableBody}
            </Table>
        </TableContainer>
    );
};

export default CustomTable;
