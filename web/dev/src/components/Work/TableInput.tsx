import React from 'react';
import {TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    input: {
        width: '15px',
        margin: '0 5px',

        '& .MuiInputBase-input': {
            textAlign: 'center',
        },
    },

    container: {
        display: 'inline',
        width: 'fit-content',
        height: 'min-content',
        backgroundColor: 'inherit',
    },
});

interface TableInputProps {
    value: string,
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void,
}

const TableInput = ({value, onChange}: TableInputProps) => {
    const styles = useStyles();

    const handleChange = (evt: any) => {
        const id = +evt.target.id.split('_')[1];
        console.log('id', id);
        const idxValue = evt.target.value;
        let fullValue = evt.currentTarget.value;
        console.log('idxValue', idxValue);
        console.log('fullValue', fullValue);
        console.log('BEFORE: target', evt.target);
        console.log('BEFORE: currentTarget', evt.currentTarget);
        // eslint-disable-next-line
        // debugger;
        if (idxValue === '') {
            console.log('delete symbol');
            evt.currentTarget.value = fullValue.substring(0, id) + '_' + fullValue.substring(id+1, fullValue.length);
            // evt.target.value = '';
        } else {
            console.log('add symbol');
            if (id !== 0 && !fullValue) {
                fullValue = '_'.repeat(2);
                evt.currentTarget.value = fullValue;
            }
            evt.currentTarget.value = fullValue.substring(0, id) + idxValue+fullValue.substring(id+1, fullValue.length);
        }
        console.log('AFTER: target', evt.target);
        console.log('AFTER: currentTarget', evt.currentTarget);
        // console.log('value', evt.currentTarget.value);
        if (evt.currentTarget.value.length <= 7) {
            onChange(evt);
        } else {
            console.log('overflow input');
        }
    };

    const validateIdxValue = (val: string) => {
        if (val && val !== '_') {
            return val;
        }
        return '';
    };

    return (
        <button className={styles.container} value={value} onChange={handleChange}>
            <TextField id="in_0" className={styles.input} value={validateIdxValue(value[0])} variant="standard"/>
            <TextField id="in_1" className={styles.input} value={validateIdxValue(value[1])} variant="standard"/>
        </button>
    );
};

export default TableInput;
