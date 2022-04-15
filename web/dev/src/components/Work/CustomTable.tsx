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
  id? : string,
  className?: string
  cellText: string | null,
  isOverflow?: boolean | null | undefined,
  copyText: (text: string) => void,
  isAnswerCorrect: AnswerType,
  popSelectState: () => SelectionMock,
}

const TextCell: FC<TextCellProps> = ({
    id,
    cellText,
    isOverflow,
    copyText,
    isAnswerCorrect,
    className,
    popSelectState,
}) => {
    const styles = useStyles();
    const classes = useStyle();
    const [open, setOpen] = useState(false);
    const [timerId, setTimerId] = useState<any>(-1);

    // эти танцы с бубном тут из-за особенностей реализации тултипов в mui: они завязаны на дочерних элементах и
    // начинают багать при отсутствии таковых(а иконка исчезает при снятии курсора). Поэтому и убираем тултип ручками
    const cellMouseOutHandler = () => {
        if (timerId !== -1) {
            clearTimeout(timerId);
        }
        setOpen(false);
    };

    const copyClickHandler = (evt: React.MouseEvent) => {
        evt.stopPropagation();

        if (timerId !== -1) {
            clearTimeout(timerId);
        }
        setOpen(true);
        setTimerId(setTimeout(() => {
            setOpen(false);
            setTimerId(-1);
        }, 1200));

        const tmpSelection = popSelectState();
        const selectionParentId = tmpSelection?.anchorNode?.parentElement?.id?.split('_')?.pop() ?? '';
        const currentTargetId = evt.currentTarget.id.split('_').pop() ?? '';

        const value = cellText?.replaceAll('_', '') ?? '';
        if (
            tmpSelection &&
            !tmpSelection.isCollapsed &&
            tmpSelection.anchorNode === tmpSelection.focusNode &&
            selectionParentId === currentTargetId
        ) {
            copyText(tmpSelection.selelctedText ?? value);
        } else {
            copyText(value);
        }
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
            <div id={id || ''} className={styles.iconContainer} onMouseOut={cellMouseOutHandler}>
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
                    id={id ? 'text_' + id : ''}
                    className={`${isAnswerCorrect ? styles.wrongCell : ''} ${className || ''}`}
                    variant="subtitle1"
                >
                    {cellText}
                </Typography>
                <Tooltip
                    open={open}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={'Скопировано'}
                    placement="top"
                    arrow
                >
                    <svg
                        id={id ? 'icon_' + id : ''}
                        className={classNames(styles.icon, classes.root)}
                        viewBox="0 0 24 24"
                        onClick={copyClickHandler}
                    >
                        {/* eslint-disable max-len */}
                        <path
                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                </Tooltip>
            </div>
        );
    }
};

const InputCell = ({inputValue, onChange, copiedText, operationType, overflow, setOverflow}: InputCellProps) => {
    const styles = useStyles();
    const ref = useRef<HTMLInputElement>(null);
    // const digitsNumber = 8; // числа в кр состоят из 8 разрядов

    const pasteClickHandler = (evt: React.MouseEvent) => {
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
                // digitsNumber={digitsNumber}
            />
            <svg className={styles.icon} viewBox="0 0 24 24" onClick={pasteClickHandler}>
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

interface SelectionMock {
    anchorNode: Node | null | undefined;
    anchorOffset: number | undefined;
    focusNode: Node | null | undefined;
    focusOffset: number | undefined;
    isCollapsed: boolean | undefined,
    selelctedText: string | null | undefined,
}

const CustomTable = ({array, setArray, compareArray, mistakeCountHandler}: CustomTableProps) => {
    const styles = useStyles();
    const [inputNumber, setInputNumber] = useState(0);
    const [inputText, setInputText] = useState('');
    const [inputCheckbox, setInputCheckbox] = useState(false);
    const [sumTmpValues, setSumValues] = useState<Record<string, any>>({});
    const [prevSelection, setPrevSelection] = useState<SelectionMock>({} as SelectionMock);
    const [text, setText] = useClippy();

    const popPrevSelectState = () => {
        const selectState = {
            anchorNode: prevSelection?.anchorNode,
            anchorOffset: prevSelection?.anchorOffset,
            focusNode: prevSelection?.focusNode,
            focusOffset: prevSelection?.focusOffset,
            isCollapsed: prevSelection?.isCollapsed,
            selelctedText: prevSelection.selelctedText,
        };
        setPrevSelection({} as SelectionMock);
        return selectState;
    };

    const cellClickHandler = (evt: any) => {
        const tmpSelection = document.getSelection();

        if (tmpSelection?.isCollapsed || (
            tmpSelection?.anchorNode === prevSelection?.anchorNode &&
            tmpSelection?.anchorOffset === prevSelection?.anchorOffset &&
            tmpSelection?.focusNode === prevSelection?.focusNode &&
            tmpSelection?.focusOffset === prevSelection?.focusOffset
        )) {
            // условие аналогично тому, что произошел клик, а не селект текста
            const id = +evt.currentTarget.id.split('_')[1];
            if (id !== inputNumber) {
                setInputText(array[id % 3 + 1].data[~~(id / 3)].value?.toString() || '');
                setInputCheckbox(array[id % 3 + 1].data[~~(id / 3)].overflow || false);
                setInputNumber(id);
            }
        }
        setPrevSelection({
            anchorNode: tmpSelection?.anchorNode,
            anchorOffset: tmpSelection?.anchorOffset,
            focusNode: tmpSelection?.focusNode,
            focusOffset: tmpSelection?.focusOffset,
            isCollapsed: tmpSelection?.isCollapsed,
            selelctedText: tmpSelection?.toString(),
        });
    };

    const tableBody = useMemo(() => {
        let mistakesCount = 0;
        const isDisabled = !compareArray.length;

        const tableBody = <TableBody>
            {array[0]?.data?.map((current, idx) => {
                const isCollapsed = ~~(inputNumber / 3) === idx;
                const collapse = getOpType(current.name) === OpType.SUM &&
            <TableCell className={styles.collapseCell} colSpan={4}>
                <Collapse in={isCollapsed} timeout="auto" unmountOnExit>
                    <CollapseTable
                        idx={idx}
                        inputNumber={inputNumber}
                        inputValue={inputText}
                        array={array}
                        setInputNumber={setInputNumber}
                        coppiedText={text}
                        copyText={setText}
                        setArray={setArray}
                        setInputText={setInputText}
                        sumTmpValues={sumTmpValues}
                        setSumValues={setSumValues}
                        isDisabled={isDisabled}
                    />
                </Collapse>
            </TableCell>;
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
                                            id={`text_cell_${tmpCellNumber}`}
                                            isAnswerCorrect={answerType}
                                            cellText={cur.data[idx].value}
                                            isOverflow={cur.data[idx].overflow}
                                            copyText={setText}
                                            popSelectState={popPrevSelectState}
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
    }, [
        array,
        mistakeCountHandler,
        inputNumber,
        compareArray,
        styles.collapseCell,
        styles.tableRow,
        styles.pointer,
        inputText, setText,
        setArray, sumTmpValues,
        cellClickHandler, text,
        inputCheckbox
    ]
    );

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
