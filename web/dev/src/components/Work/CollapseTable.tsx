import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import {Checkbox, Table, TableBody, TableCell, TableRow, TextField, Tooltip, Typography} from '@material-ui/core';
import {CollapsedTableCell, TableState} from './Work';
import classNames from 'classnames';
import TableInput from './TableInput';
import {makeStyles} from '@material-ui/core/styles';
import ReactTestUtils from 'react-dom/test-utils';

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
        width: 'calc(100% + 80px)',
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

    leftSumCellContainer: {
        width: '60px',
    },

    firstLine: {
        gridTemplate: 'firstLine',
    },

    secondLine: {
        gridTemplate: 'secondLine',
    },

    sixthLine: {
        gridArea: 'sixthLine',
    },

    sixthLineLeft: {
        width: 'max-content',
        justifySelf: 'center',
    },

    seventhLine: {
        gridArea: 'seventhLine',
        textAlign: 'center',
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
        width: '138px',
    },

    resDirect: {
        display: 'flex',
        alignItems: 'center',
    },

    iconsContainer: {
        display: 'flex',
        gridGap: '15px',
        position: 'relative',
        alignItems: 'center',

        '&:hover': {
            '& .MuiCustomSvgIcon-root': {
                display: 'block !important',
            }
        },
    },

    icons: {
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
  onChange: (evt: any, value?: string, field?: keyof CollapsedTableCell) => void,
  inputCellNumber: number,
  sumTmpValues: Record<string, any>,
  setSumValues: Dispatch<SetStateAction<Record<string, any>>>,
  handleChangeOverflow: (newValue: boolean) => void
  coppiedText: string,
  copyText: (clipboard: string) => void,
  isDisabled: boolean,
}

const SumCell = React.memo(({
    id,
    array,
    className,
    value,
    onChange,
    inputCellNumber,
    setSumValues,
    sumTmpValues,
    handleChangeOverflow
    sumTmpValues,
    coppiedText,
    copyText,
    isDisabled,
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
            handleChangeOverflow(!prepared[inputCellNumber].overflow);

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
            <div className={classNames(styles.sumCellContainer, styles.leftSumCellContainer)}>
                <Typography className={styles.center}>{operationNameValues[0]}</Typography>
                <Typography className={styles.plusSymbol}>+</Typography>
                <Typography className={styles.center}>{operationNameValues[1]}</Typography>
                <Tooltip className={styles.sumCheckbox} title={'Перенос разряда'} placement="left" arrow>
                    <Checkbox
                        size="small"
                        color="primary"
                        checked={!!sumTmpValues[inputCellNumber]?.overflow}
                        onChange={handleChecked}
                        disabled={!isDisabled}
                    />
                </Tooltip>
                <Typography className={classNames(styles.sixthLine, styles.sixthLineLeft)}>
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
                    if ((sumTmpValues[inputCellNumber] && sumTmpValues[inputCellNumber].overflow) || index !== 2) {
                        const isNotEmpty = sumTmpValues[inputCellNumber];
                        console.log('inputText', inputText);
                        return <SumInputCell
                            id={id}
                            inputText={isNotEmpty ? sumTmpValues[inputCellNumber].value[index] : ''}
                            onChange={(evt) => {
                                handleChange(evt, index);
                                switch (index) {
                                case 0:
                                    onChange(evt, id, 'a');
                                    break;
                                case 1:
                                    onChange(evt, id, 'b');
                                    break;
                                case 2:
                                    onChange(evt, id, 'transfer');
                                    break;
                                }
                            }}
                            onClick={handleClick}
                            index={index}
                            inputNumber={inputNumber}
                            coppiedText={coppiedText}
                            copyText={copyText}
                            isDisabled={isDisabled}
                        />;
                    }
                })}
                <SumInputCell
                    id={id}
                    inputText={value || ''}
                    onChange={(evt) => onChange(evt, id)}
                    onClick={handleClick}
                    index={3}
                    inputNumber={inputNumber}
                    coppiedText={coppiedText}
                    copyText={copyText}
                    isDisabled={isDisabled}
                />
                <div className={classNames(styles.sixthLine, styles.resDirect)}>
                    <SumInputCell
                        id={id}
                        inputText={sumTmpValues[inputCellNumber] ? sumTmpValues[inputCellNumber].value[4] : ''}
                        onChange={(evt) => {
                            handleChange(evt, 4);
                            onChange(evt, id, 'direct');
                        }}
                        onClick={handleClick}
                        index={4}
                        inputNumber={inputNumber}
                        coppiedText={coppiedText}
                        copyText={copyText}
                        isDisabled={isDisabled}
                    />
                </div>
                <TextField
                    className={styles.seventhLine}
                    value={sumTmpValues[inputCellNumber] ? sumTmpValues[inputCellNumber].value[5] : ''}
                    onChange={(evt) => {
                        handleChange(evt, 5);
                        onChange(evt, id, 'decimal');
                    }}
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
    coppiedText: string,
    copyText: (clipboard: string) => void,
    isDisabled: boolean,
}

const SumInputCell = React.memo(({
    id,
    inputNumber,
    index,
    inputText,
    onChange,
    onClick,
    coppiedText,
    copyText,
    isDisabled,
}: SumInputCellProps) => {
    const styles = useStyles();
    const classes = useStyle();
    const ref = useRef<HTMLInputElement>(null);

    const pasteClickHandler = (evt: React.MouseEvent) => {
        evt.stopPropagation();

        const input = ref.current as HTMLInputElement;
        input.value = coppiedText;
        ReactTestUtils.Simulate.change((ref.current as HTMLInputElement));
    };

    const copyClickHandler = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        const value = inputText?.replaceAll('_', '');
        copyText(value || '');
    };

    return (
        <div className={styles.iconsContainer}>
            {inputNumber === index && isDisabled ?
                <>
                    <TableInput
                        key={`sum_cell_${id}_${index}`}
                        id={`sum_cell_${id}_${index}`}
                        ref={ref}
                        className={classNames(styles.input)}
                        disabled={false}
                        value={inputText}
                        onChange={onChange}
                    />
                    <svg className={styles.icons} viewBox="0 0 24 24" onClick={pasteClickHandler}>
                        {/* eslint-disable max-len */}
                        <path
                            d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
                    </svg>
                </> :
                <>
                    <CellTextValue
                        key={`sum_cell_typo_${id}_${index}`}
                        id={`sum_cell_typo_${id}_${index}`}
                        onClick={onClick}
                        value={inputText}
                    />
                    {inputText && <svg className={classNames(styles.icons, classes.root)} viewBox="0 0 24 24" onClick={copyClickHandler}>
                        {/* eslint-disable max-len */}
                        <path
                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>}
                </>
            }
        </div>
    );
});

SumInputCell.displayName = 'SumInputCell';

interface CollapseTableProps {
  idx: number,
  inputNumber: number,
  inputValue: string,
  array: TableState[],
  setInputNumber: Dispatch<SetStateAction<number>>,
  setArray: Dispatch<SetStateAction<TableState[]>>,
  setInputText: Dispatch<SetStateAction<string>>,
  sumTmpValues: Record<string, any>,
  setSumValues: Dispatch<SetStateAction<Record<string, any>>>,
  isDisabled?: boolean,
  coppiedText: string,
  copyText: (clipboard: string) => void,
}

const CollapseTable = React.memo(({
    idx,
    inputNumber,
    inputValue,
    setArray,
    setInputText,
    setInputNumber,
    coppiedText,
    copyText,
    array,
    setSumValues,
    sumTmpValues,
    isDisabled,
}: CollapseTableProps) => {
    const styles = useStyles();
    const rowNumber = ~~(inputNumber / 3);
    const columnNumber = inputNumber % 3;
    if (!sumTmpValues[inputNumber]) {
        setSumValues((values) => {
            values[rowNumber * 3] = {value: ['', '', '', '', '', ''], overflow: false};
            values[rowNumber * 3 + 1] = {value: ['', '', '', '', '', ''], overflow: false};
            values[rowNumber * 3 + 2] = {value: ['', '', '', '', '', ''], overflow: false};
            return values;
        });
    }

    const changeHandler = (evt: any, index: number, idx: number, value?: string, field?: keyof CollapsedTableCell) => {
        console.log('handle check', evt, index, idx, value, array);
        const newValue = evt?.currentTarget.value || '';

        switch (field) {
        case 'a':
            setArray((arr) => {
                arr[index + 1].data[idx].additionalSteps = {
                    ...arr[index + 1].data[idx].additionalSteps,
                    a: newValue
                };
                return arr;
            });
            break;
        case 'b':
            setArray((arr) => {
                arr[index + 1].data[idx].additionalSteps = {
                    ...arr[index + 1].data[idx].additionalSteps,
                    b: newValue
                };
                return arr;
            });
            break;
        case 'transfer':
            setArray((arr) => {
                arr[index + 1].data[idx].additionalSteps = {
                    ...arr[index + 1].data[idx].additionalSteps,
                    transfer: newValue
                };
                return arr;
            });
            break;
        case 'direct':
            setArray((arr) => {
                arr[index + 1].data[idx].additionalSteps = {
                    ...arr[index + 1].data[idx].additionalSteps,
                    direct: newValue
                };
                return arr;
            });
            break;
        case 'decimal':
            setArray((arr) => {
                arr[index + 1].data[idx].additionalSteps = {
                    ...arr[index + 1].data[idx].additionalSteps,
                    decimal: newValue
                };
                return arr;
            });
            break;
        case undefined:
            setArray((arr) => {
                // TODO: REMOVE WITH BE FIX THIS BUG
                if (!arr[index + 1].data[idx].additionalSteps?.transfer) {
                    arr[index + 1].data[idx].additionalSteps = {
                        ...arr[index + 1].data[idx].additionalSteps,
                        transfer: '000000'
                    };
                }
                arr[index + 1].data[idx].value = evt?.currentTarget.value || '';
                return arr;
            });
            setInputText(evt?.currentTarget.value || '');
            break;
        }
    };

    const handleChangeOverflow = (index: number, idx: number, newOverflow: boolean) => {
        setArray((arr) => {
            console.log('arr be', arr[index].data[idx]);
            arr[index].data[idx].overflow = newOverflow;
            console.log('arr aft', arr[index].data[idx]);
            return arr;
        });
    }
  ;

    const clickHandler = (index: number) => {
        setInputText(array[index + 1].data[rowNumber].value?.toString() || '');
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
                                {(columnNumber === index && rowNumber === idx) ||
                                    (rowNumber * 3 + index === inputNumber && !isDisabled) ?
                                    <SumCell
                                        id={`sum_input_cell_${idx}`}
                                        array={array}
                                        value={inputValue}
                                        onChange={
                                            (evt: any, value?: string, field?: keyof CollapsedTableCell) =>
                                                changeHandler(evt, index, idx, value, field)
                                        }
                                        inputCellNumber={inputNumber}
                                        setSumValues={setSumValues}
                                        sumTmpValues={sumTmpValues}
                                        handleChangeOverflow={((newValue) =>
                                            handleChangeOverflow(index, idx, newValue))}
                                        coppiedText={coppiedText}
                                        copyText={copyText}
                                        isDisabled={!!isDisabled}
                                    /> :
                                    <Typography variant="subtitle1">
                                        {array[index + 1].data[rowNumber].value || '...'}
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
