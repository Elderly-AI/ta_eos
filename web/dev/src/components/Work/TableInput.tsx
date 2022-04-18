import React, {ForwardedRef, forwardRef, MutableRefObject, useRef, useState, FocusEvent} from 'react';
import {TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import ReactTestUtils from 'react-dom/test-utils';

const useStyles = makeStyles({
    input: {
        width: '12px',
        margin: '0 3px',

        '& .MuiInputBase-input': {
            textAlign: 'center',
            padding: '0 0 6px',
        },

        '&:nth-child(2)': {
            marginLeft: '0',
        },

        '&:last-child': {
            marginRight: '0',
        },
    },

    container: {
        display: 'inline',
        width: 'fit-content',
        height: 'min-content',
        backgroundColor: 'inherit',
        border: 'none',
        padding: '0',
    },

    invisibleInput: {
        width: '0',
        height: '0',
        padding: '0',
        margin: '0',
        border: 'none',
    }
});

const nullSymbol = '_';

const replaceAt = (str: string, idx: number, newSymbol: string) => {
    newSymbol = newSymbol[0];
    return str.substring(0, idx) + newSymbol + str.substring(idx + 1, str.length);
};

interface TableInputProps {
  id: string,
  value?: string,
  digitsNumber?: number,
  onChange?: (evt: any, value?: string) => void,
  className?: string,
  disabled?: boolean,
}

// компонент содержит значение в виде строки в невидимом инпуте, на который ссылается(ref) компонент и
// значения каждого разряда в инпутах
const TableInput = forwardRef<HTMLInputElement, TableInputProps>((
    {id, className, value, onChange, disabled, digitsNumber = 8}: TableInputProps,
    ref
) => {
    const styles = useStyles();
    const [errorId, setErrorId] = useState<number | undefined>(undefined);
    const [timerId, setTimerId] = useState<any>(-1);
    const [val, setVal] = useState('');
    const inputRef: MutableRefObject<HTMLInputElement> | ForwardedRef<HTMLInputElement> = ref ? ref :
        useRef<HTMLInputElement>(null);
    const textFieldRefs: any[] = [];
    for (let i = 0; i < digitsNumber; i++) {
        const tmp = {
            name: `TableInput_${digitsNumber}_${id || ''}_${i}`,
            ref: useRef<HTMLInputElement>(null),
        };
        textFieldRefs.push(tmp);
    }

    const handleKeyDown = (evt: any) => {
        const id = +evt.target.name.split('_').pop();
        if (evt.code === 'ArrowLeft' && id > 0) {
            evt.preventDefault();
            // эта красота тут потому что mui не переопределяет метод select() для своего TextField и надо
            // добраться непосредственно до самого инпута в недрах компонента
            (textFieldRefs[id - 1].ref.current?.children[0].children[0] as HTMLInputElement).focus();
            return;
        }
        if (evt.code === 'ArrowRight' && id < digitsNumber - 1) {
            evt.preventDefault();
            (textFieldRefs[id + 1].ref.current?.children[0].children[0] as HTMLInputElement).focus();
            return;
        }
    };

    const validateIdxValue = (val: string | undefined) => {
        if (val && val !== nullSymbol) {
            return val;
        }
        return '';
    };

    const validatePastedValue = (value: string) => {
        const res = value.match(/[01]+/g);
        // валидация вводимых данных и отображение ошибки в инпуте
        if (timerId !== -1) {
            clearTimeout(timerId);
        }
        if (!res || res[0] !== value) {
            setErrorId(-1); // при errorId < 0 загораются все инпуты
            setTimerId(setTimeout(() => {
                setErrorId(undefined);
                setTimerId(-1);
            }, 3000));
            return false;
        } else if (timerId !== -1) {
            setErrorId(undefined);
            setTimerId(-1);
        }
        return true;
    };

    const setupPastedValue = (value: string) => {
        let resValue = value;
        textFieldRefs.forEach((refObj, idx) => {
            if (idx < digitsNumber - resValue.length) {
                return;
            }
            refObj.ref.current.value = resValue[idx];
        });
        resValue = transformValue(resValue);
        (inputRef as MutableRefObject<HTMLInputElement>).current.value = resValue;
    };

    const transformValue = (value: string) => {
        if (value.length === 0) {
            value = nullSymbol.repeat(digitsNumber);
        } else if (value.length < digitsNumber) {
            const inputElement = (inputRef as MutableRefObject<HTMLInputElement>).current;
            const focusedTextFieldNumber = +(inputElement.getAttribute('data-focusedIndex') || 0);
            let leftFreeInputsNumber: number;
            let rightFreeInputsNumber: number;
            let resValue = '';
            if (focusedTextFieldNumber + value.length <= digitsNumber) {
                // если есть место для вставки справа
                leftFreeInputsNumber = focusedTextFieldNumber;
                rightFreeInputsNumber = digitsNumber - focusedTextFieldNumber - value.length;
            } else {
                // если есть место для вставки слева
                leftFreeInputsNumber = focusedTextFieldNumber - value.length + 1;
                rightFreeInputsNumber = digitsNumber - focusedTextFieldNumber - 1;
            }
            resValue += nullSymbol.repeat(leftFreeInputsNumber);
            resValue += value;
            resValue += nullSymbol.repeat(rightFreeInputsNumber);
            if (leftFreeInputsNumber + value.length < digitsNumber) {
                (textFieldRefs[digitsNumber - 1].ref
                    .current.children[0].children[0] as HTMLInputElement).focus();
            } else {
                (textFieldRefs[leftFreeInputsNumber - 1].ref
                    .current.children[0].children[0] as HTMLInputElement).focus();
            }
            value = resValue;
        } else {
            value = value.slice(0, digitsNumber);
        }
        return value;
    };

    const handleTextFieldPaste = (evt: React.ClipboardEvent<HTMLInputElement>) => {
        evt.preventDefault();
        const copiedText = evt.clipboardData.getData('text');
        const input = (inputRef as MutableRefObject<HTMLInputElement>).current;
        input.value = copiedText;
        ReactTestUtils.Simulate.change(input);
    };

    const handleTextFieldFocus = (evt: FocusEvent<HTMLInputElement>) => {
        evt.currentTarget?.select();
        const id = +(evt.currentTarget.name.split('_').pop() ?? '0');
        (inputRef as MutableRefObject<HTMLInputElement>).current.setAttribute('data-focusedIndex', id.toString());
    };

    const handleInputChange = (evt: any) => {
        const isValid = validatePastedValue(evt.currentTarget.value);
        setupPastedValue(evt.currentTarget.value);
        if (!isValid) {
            return;
        }

        if (onChange) {
            onChange(evt);
        } else {
            setVal((inputRef as MutableRefObject<HTMLInputElement>).current.value);
        }
    };

    const handleTextFieldChange = (evt: any) => {
        const id = +evt.target.name.split('_').pop();
        const idxValue = evt.target.value;
        let fullValue = (inputRef as MutableRefObject<HTMLInputElement>).current.value;

        // дополняем  строку незначащими символами, чтобы правильно отрабатывался ввод в любой разряд
        fullValue = transformValue(fullValue);
        (inputRef as MutableRefObject<HTMLInputElement>).current.value = fullValue;

        // валидация вводимых данных и отображение ошибки в инпуте
        if (timerId !== -1) {
            clearTimeout(timerId);
        }
        if (idxValue != '1' && idxValue != '0' && idxValue !== '') {
            setErrorId(id);
            setTimerId(setTimeout(() => {
                setErrorId(undefined);
                setTimerId(-1);
            }, 3000));
            return;
        } else if (timerId !== -1) {
            setErrorId(undefined);
            setTimerId(-1);
        }

        if (idxValue === '') {
            (inputRef as MutableRefObject<HTMLInputElement>).current.value = replaceAt(fullValue, id, nullSymbol);
        } else {
            (inputRef as MutableRefObject<HTMLInputElement>).current.value = replaceAt(fullValue, id, idxValue);
            if (id > 0) {
                // эта красота тут потому что mui не переопределяет метод select() для своего TextField и надо
                // добраться непосредственно до самого инпута в недрах компонента
                (textFieldRefs[id - 1].ref.current?.children[0].children[0] as HTMLInputElement).focus();
            }
        }

        evt.currentTarget = (inputRef as MutableRefObject<HTMLInputElement>).current;
        if (onChange) {
            onChange(evt);
        } else {
            setVal((inputRef as MutableRefObject<HTMLInputElement>).current.value);
        }
    };

    return (
        <div id={id} className={classNames(className, styles.container)} onKeyDown={handleKeyDown}>
            <input
                className={styles.invisibleInput}
                data-focusedIndex={7}
                ref={inputRef}
                value={value || val}
                onChange={handleInputChange}/>
            {textFieldRefs.map((refObj, idx) => (
                <TextField
                    name={refObj.name}
                    key={refObj.name}
                    ref={refObj.ref}
                    className={styles.input}
                    value={validateIdxValue(value ? value[idx] : val[idx])}
                    onInput={handleTextFieldChange}
                    onPaste={handleTextFieldPaste}
                    onFocus={handleTextFieldFocus}
                    variant="standard"
                    error={(errorId && errorId < 0) || errorId === idx}
                    autoFocus={idx === digitsNumber - 1}
                    disabled={disabled}
                />
            ))}
        </div>
    );
});

TableInput.displayName = 'TableInput';

export default TableInput;
