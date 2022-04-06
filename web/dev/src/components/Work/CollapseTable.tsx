import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Checkbox, Table, TableBody, TableCell, TableRow, TextField, Tooltip, Typography} from '@material-ui/core';
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
        position: 'relative',
        left: '-80px',
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
        width: '60px',
        position: 'relative',
        display: 'grid',
        height: '260px',
        gridTemplateAreas: `"firstLine"
                            "secondLine"
                            "separator"
                            "thirdLine"
                            "fifthLine"
                            "sixthLine"
                            "seventhLine"`,
        gridTemplateRows: '1fr 1fr min-content 1fr 1fr 1fr 1fr',
        gridGap: '5px',
    },

    firstLine: {
        gridTemplate: 'firstLine',
    },

    secondLine: {
        gridTemplate: 'secondLine',
    },

    sixthLine: {
        gridArea: 'sixthLine',
        width: 'max-content',
        justifySelf: 'center',
    },

    seventhLine: {
        gridArea: 'seventhLine',
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

    center: {
        textAlign: 'center',
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

    resDirect: {
        display: 'flex',
        alignItems: 'center',
    }
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
    array: TableState[],
    className?: string,
    value: string | null,
    onChange: (evt: any, value?: string) => void,
    inputCellNumber: number,
    sumTmpValues: Record<string, any>,
    setSumValues: Dispatch<SetStateAction<Record<string, any>>>,
}

const SumCell = React.memo(({
    id,
    array,
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
    const [inputNumber, setInputNumber] = useState(0);
    const [inputText, setInputText] = useState('');

    const handleChecked = () => {
        setSumValues((obj) => {
            const prepared = {
                ...obj
            };

            if (!prepared[inputCellNumber].overflow) {
                prepared[inputCellNumber].value[2] = value || '';
                onChange(undefined, '');
            }

            prepared[inputCellNumber].overflow = !prepared[inputCellNumber].overflow;
            return prepared;
        });
        setIsInput((prev) => !prev);
    };

    const handleClick = (evt: any) => {
        console.log('id', evt.currentTarget.id);
        const id = +evt.currentTarget.id.split('_').pop();
        if (id !== inputNumber) {
            setInputText(sumTmpValues[inputCellNumber].value[id] || '');
            setInputNumber(id);
        }
    };

    const handleChange = (evt: any, index: number) => {
        console.log('evt', evt.currentTarget.value);
        setSumValues((obj) => {
            obj[inputCellNumber].value[index] = evt.currentTarget.value || '';
            return obj;
        });
        setInputText(evt?.currentTarget.value || '');
    };
    console.log('ID:', id, id.split('_').pop()!);
    const operationName = array[0].data[+id.split('_').pop()!].name;
    let operationNameValues = [];
    let resultName = '';
    operationNameValues = operationName.split('+');
    if (operationNameValues[1][0] === '-') {
        resultName = operationNameValues[0] + operationNameValues[1];
    } else {
        resultName = operationName;
    }

    return (
        <div className={containerClasses} id={`container_${id}`}>
            <div className={styles.sumCellContainer}>
                <Typography className={styles.center}>{operationNameValues[0]}</Typography>
                <Typography className={styles.plusSymbol}>+</Typography>
                <Typography className={styles.center}>{operationNameValues[1]}</Typography>
                <Tooltip className={styles.sumCheckbox} title={'Перенос разряда'} placement="left" arrow>
                    <Checkbox
                        size="small"
                        color="primary"
                        checked={!!sumTmpValues[inputCellNumber]?.overflow}
                        onChange={handleChecked}
                    />
                </Tooltip>
                <Typography className={styles.sixthLine}>
                    <span>{resultName}</span>
                    <sub>[пр]</sub>
                </Typography>
                <Typography className={styles.seventhLine}>
                    <span>{resultName}</span>
                    <sub>10</sub>
                </Typography>
            </div>
            <div className={styles.sumCellContainer}>
                <div className={styles.separator}/>
                {[0, 1, 2].map((index) => {
                    if ((sumTmpValues[inputCellNumber]  && sumTmpValues[inputCellNumber].overflow) || index !== 2) {
                        const isNotEmpty = sumTmpValues[inputCellNumber];
                        console.log('inputText', inputText);
                        return <SumInputCell
                            id={id}
                            inputText={isNotEmpty ? sumTmpValues[inputCellNumber].value[index] : ''}
                            onChange={(evt) => handleChange(evt, index)}
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
                <div className={classNames(styles.sixthLine, styles.resDirect)}>
                    <SumInputCell
                        id={id}
                        inputText={sumTmpValues[inputCellNumber] ? sumTmpValues[inputCellNumber].value[4] : ''}
                        onChange={(evt) => handleChange(evt, 4)}
                        onClick={handleClick}
                        index={4}
                        inputNumber={inputNumber}
                    />
                </div>
                <TextField
                    className={styles.seventhLine}
                    value={sumTmpValues[inputCellNumber] ? sumTmpValues[inputCellNumber].value[5] : ''}
                    onChange={(evt) => handleChange(evt, 5)}
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
    sumTmpValues: Record<string, any>,
    setSumValues: Dispatch<SetStateAction<Record<string, any>>>,
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
            values[rowNumber * 3] = {value: ['', '', '', '', '', ''], overflow: false};
            values[rowNumber * 3 + 1] = {value: ['', '', '', '', '', ''], overflow: false};
            values[rowNumber * 3 + 2] = {value: ['', '', '', '', '', ''], overflow: false};
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
                                        id={`sum_input_cell_${idx}`}
                                        array={array}
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
