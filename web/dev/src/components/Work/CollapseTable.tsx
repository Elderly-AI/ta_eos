import React, {Dispatch, SetStateAction, useState} from 'react';
import {Checkbox, Table, TableBody, TableCell, TableRow, Tooltip, Typography} from '@material-ui/core';
import {TableState} from './Work';
import classNames from 'classnames';
import TableInput from './TableInput';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    none: {
        display: 'none !important',
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

    iconFontSize: {
        fontSize: '1rem !important',
    },

    flex: {
        display: 'flex',
    },

    cellContainer: {
        display: 'flex',
        gridGap: '20px',
    },

    icon: {
        width: '1em',
        height: '1em',
        fontSize: '1rem',
        fill: '#0d47a1',
    },

    collapseCell: {
        borderBottom: 'none',
        boxShadow: 'inset 0px -1px 0px rgba(224, 224, 224, 1)',
        padding: 0,
    },

    sumCellContainer: {
        position: 'relative',
        display: 'grid',
        gridTemplateAreas: `"firstLine"
                            "secondLine"
                            "separator"
                            "thirdLine"
                            "fifthLine"`,
        gridTemplateRows: '1fr 1fr min-content 1fr 1fr',
        gridGap: '5px',
    },

    firstLine: {
        gridTemplate: 'firstLine',
    },

    secondLine: {
        gridTemplate: 'secondLine',
    },

    separator: {
        width: '138px',
        height: '2px',
        backgroundColor: '#C4C4C4',
        gridArea: 'separator',
    },

    sumCheckbox: {
        gridArea: 'thirdLine',
        padding: '0',
    },

    plusSymbol: {
        position: 'absolute',
        top: '0.75rem',
        right: '-15px',
    },

    digit: {
        display: 'inline-block',
        fontSize: '1rem',
        width: '12px',
        margin: '0 3px',
        textAlign: 'center',

        '&:first-child': {
            marginLeft: '0',
        },

        '&:last-child': {
            marginRight: '0',
        },
    },

    emptyCell: {
        textAlign: 'center',
        fontSize: '1rem',
        width: '100%',
        // height: '25px',
    },
});

interface CellTextValueProps {
    id: string,
    value: string,
    valueLength?: number,
    onClick?: (evt: any) => void,
}

const CellTextValue = React.memo(({id, value, onClick, valueLength = 8}: CellTextValueProps) => {
    const styles = useStyles();
    const digits = [];
    if (!value) {
        return <span id={id} onClick={onClick} className={styles.emptyCell}>...</span>;
    }
    for (let i = 0; i < valueLength; i++) {
        let val = '';
        if (value[i] && value[i] !== '_') {
            val = value[i];
        } else {
            val = '.';
        }
        digits.push(<span key={`cell_text_value_${value[i]}_${i}`} className={styles.digit}>{val}</span>);
    }

    return (
        <span id={id} onClick={onClick}>
            {digits}
        </span>
    );
});

CellTextValue.displayName = 'CellTextValue';

interface SumCellProps {
    id: string,
    className?: string,
    value: string | null,
    onChange: (evt: any, value?: string) => void,
    inputCellNumber: number,
    sumTmpValues: Record<string, string[]>,
    setSumValues: Dispatch<SetStateAction<Record<string, string[]>>>,
}

const SumCell = React.memo(({
    id,
    className,
    value,
    onChange,
    inputCellNumber,
    setSumValues,
    sumTmpValues
}: SumCellProps) => {
    const styles = useStyles();
    const containerClasses = classNames(styles.cellContainer, className ? className : '');
    const [isResultInput, setIsInput] = useState(false);
    // const [resArr, serResArr] = useState<string[]>(['', '', '']);
    const [inputNumber, setInputNumber] = useState(0);
    const [inputText, setInputText] = useState('');

    const handleChecked = () => {
        if (!isResultInput) {
            setSumValues((obj) => {
                // если нажат чекбокс, надо добавить 3-й инпут и вставить в него значение их рузультирующего. поэтому 2
                obj[inputCellNumber][2] = value || '';
                return obj;
            });
            onChange(undefined, '');
        }
        setIsInput((prev) => !prev);
    };

    const handleClick = (evt: any) => {
        console.log('id', evt.currentTarget.id);
        const id = +evt.currentTarget.id.split('_').pop();
        if (id !== inputNumber) {
            setInputText(sumTmpValues[inputCellNumber][id] || '');
            setInputNumber(id);
        }
    };

    return (
        <div className={containerClasses} id={`container_${id}`}>
            <div className={styles.sumCellContainer}>
                <Typography>A</Typography>
                <Typography className={styles.plusSymbol}>+</Typography>
                <Typography>B</Typography>
                <Tooltip className={styles.sumCheckbox} title={'Перенос разряда'} placement="left" arrow>
                    <Checkbox
                        size="small"
                        color="primary"
                        checked={isResultInput}
                        onChange={handleChecked}
                    />
                </Tooltip>
            </div>
            <div className={styles.sumCellContainer}>
                <div className={styles.separator}/>
                {[0, 1, 2].map((index) => {
                    const handleChange = (evt: any) => {
                        console.log('evt', evt.currentTarget.value);
                        setSumValues((obj) => {
                            obj[inputCellNumber][index] = evt.currentTarget.value || '';
                            return obj;
                        });
                        setInputText(evt?.currentTarget.value || '');
                    };

                    if (isResultInput || index !== 2) {
                        const isNotEmpty = sumTmpValues[inputCellNumber];
                        console.log('inputText', inputText);
                        return <SumInputCell
                            id={id}
                            inputText={isNotEmpty ? sumTmpValues[inputCellNumber][index] : ''}
                            onChange={handleChange}
                            onClick={handleClick}
                            index={index}
                            inputNumber={inputNumber}
                        />;
                    }
                })}
                <SumInputCell
                    id={id}
                    inputText={value || ''}
                    onChange={onChange}
                    onClick={handleClick}
                    index={3}
                    inputNumber={inputNumber}
                />
            </div>
        </div>
    );
});

SumCell.displayName = 'SumCell';

interface SumInputCellProps {
    id: string,
    inputNumber: number,
    index: number,
    inputText: string,
    onChange: (evt: any) => void,
    onClick: (evt: any) => void,
}

const SumInputCell = React.memo(({
    id,
    inputNumber,
    index,
    inputText,
    onChange,
    onClick
}: SumInputCellProps) => {
    const styles = useStyles();

    return (
        <>
            {inputNumber === index ?
                <TableInput
                    key={`sum_cell_${id}_${index}`}
                    id={`sum_cell_${id}_${index}`}
                    className={classNames(styles.input)}
                    disabled={false}
                    value={inputText}
                    onChange={onChange}
                /> :
                <CellTextValue
                    key={`sum_cell_typo_${id}_${index}`}
                    id={`sum_cell_typo_${id}_${index}`}
                    onClick={onClick}
                    value={inputText}
                />
            }
        </>
    );
});

SumInputCell.displayName = 'SumInputCell';

interface CollapseTableProps {
    idx: number,
    inputNumber: number,
    inputValue: string,
    array: TableState[],
    setInputNumber: Dispatch<SetStateAction<number>>,
    setText: (clipboard: string) => void,
    setArray: Dispatch<SetStateAction<TableState[]>>,
    setInputText: Dispatch<SetStateAction<string>>,
    sumTmpValues: Record<string, string[]>,
    setSumValues: Dispatch<SetStateAction<Record<string, string[]>>>,
}

const CollapseTable = React.memo(({
    idx,
    inputNumber,
    inputValue,
    setArray,
    setInputText,
    setInputNumber,
    setText,
    array,
    setSumValues,
    sumTmpValues,
}: CollapseTableProps) => {
    const styles = useStyles();
    const rowNumber = ~~(inputNumber / 3);
    const columnNumber = inputNumber % 3;
    if (!sumTmpValues[inputNumber]) {
        console.log('row idx', inputNumber, rowNumber * 3, rowNumber * 3 + 1, rowNumber * 3 + 2);
        setSumValues((values) => {
            console.log(values);
            values[rowNumber * 3] = ['', '', ''];
            values[rowNumber * 3 + 1] = ['', '', ''];
            values[rowNumber * 3 + 2] = ['', '', ''];
            return values;
        });
    }

    const changeHandler = (evt: any, index: number, idx: number, value?: string) => {
        // currentTarget.value - полное значение, target.value - текущий разряд
        setArray((arr) => {
            arr[index+1].data[idx].value = evt?.currentTarget.value || '';
            return arr;
        });
        setInputText(evt?.currentTarget.value || '');
    };

    const clickHandler = (index: number) => {
        setInputText(array[index + 1].data[rowNumber].value?.toString()|| '');
        setInputNumber(rowNumber * 3 + index);
    };

    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell width="25%"/>
                    {[0, 1, 2].map((cur, index) => {
                        const key = 'table_in_table_row_' + idx + '_cell_' + index; // не трогать блять!!!
                        return (
                            <TableCell
                                key={key}
                                width="25%"
                                className={styles.pointer}
                                onClick={() => clickHandler(index)}
                            >
                                {columnNumber === index && rowNumber === idx ?
                                    <SumCell
                                        id={`sum_input_cell_${index}`}
                                        value={inputValue}
                                        onChange={(evt: any, value?: string) => changeHandler(evt, index, idx, value)}
                                        inputCellNumber={inputNumber}
                                        setSumValues={setSumValues}
                                        sumTmpValues={sumTmpValues}
                                    /> :
                                    <Typography variant="subtitle1">
                                        {array[index+1].data[rowNumber].value || '...'}
                                    </Typography>
                                }
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableBody>
        </Table>
    );
});

CollapseTable.displayName = 'CollapseTable';

export default CollapseTable;
