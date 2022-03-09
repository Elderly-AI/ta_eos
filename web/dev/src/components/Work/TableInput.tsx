import React, {useRef, useState} from 'react';
import {TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles({
    input: {
        width: '12px',
        margin: '0 3px',

        '& .MuiInputBase-input': {
            textAlign: 'center',
            padding: '0 0 6px',
        },

        '&:first-child': {
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
});

const nullSymbol = '_';

const replaceAt = (str: string, idx: number, newSymbol: string) => {
    newSymbol = newSymbol[0];
    return str.substring(0, idx) + newSymbol + str.substring(idx + 1, str.length);
};

interface TableInputProps {
    id?: string,
    value: string,
    digitsNumber?: number,
    onChange: (evt: any, value?: string) => void,
    className? : string,
}

// компонент содержит значение в виде строки в родительском элементе(button) и значения каждого разряда в инпутах
const TableInput = ({id, className, value, onChange, digitsNumber = 8}: TableInputProps) => {
    const styles = useStyles();
    const [errorId, setErrorId] = useState<number | undefined>(undefined);
    const [timerId, setTimerId] = useState<any>(-1);
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

    const handleChange = (evt: any) => {
        const id = +evt.target.name.split('_').pop();
        const idxValue = evt.target.value;
        let fullValue = evt.currentTarget.value;
        // заменяем пустую строку на строку с незначащими символами, чтобы правильно отрабатывался ввод в любой разряд
        if (fullValue.length !== digitsNumber) {
            fullValue = nullSymbol.repeat(digitsNumber);
            evt.currentTarget.value = fullValue;
        }

        // валидация вводимых данных и отображение ошибки в инпуте
        if (timerId !== -1) {
            clearTimeout(timerId);
        }
        if (idxValue != '1' && idxValue != '0' && idxValue != '') {
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
            evt.currentTarget.value = replaceAt(fullValue, id, nullSymbol);
        } else {
            evt.currentTarget.value = replaceAt(fullValue, id, idxValue);
            if (id > 0) {
                // эта красота тут потому что mui не переопределяет метод select() для своего TextField и надо
                // добраться непосредственно до самого инпута в недрах компонента
                (textFieldRefs[id - 1].ref.current?.children[0].children[0] as HTMLInputElement).focus();
            }
        }

        if (evt.currentTarget.value.length <= digitsNumber) {
            onChange(evt);
        } else {
            console.log('overflow input', evt.currentTarget.value.length);
        }
    };

    const validateIdxValue = (val: string) => {
        if (val && val !== nullSymbol) {
            return val;
        }
        return '';
    };

    return (
        <button
            id={id}
            className={classNames(styles.container, className)}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        >
            {textFieldRefs.map((refObj, idx) => (
                <TextField
                    name={refObj.name}
                    key={refObj.name}
                    ref={refObj.ref}
                    className={styles.input}
                    value={validateIdxValue(value[idx])}
                    variant="standard"
                    error={errorId === idx}
                    autoFocus={idx === digitsNumber - 1}
                    onFocus={(evt) => evt.currentTarget.select()}
                />
            ))}
        </button>
    );
};

export default TableInput;
