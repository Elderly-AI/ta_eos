import React, {ChangeEvent} from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@mui/styles';
import {blue, red} from '@material-ui/core/colors';
import {createTheme} from '@mui/material';

const theme = createTheme();

export interface CustomInputProps {
  id: string;
  label?: string;
  handler?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  startVal?: string;
  isPassword?: boolean;
  errorMessage?: string;
}

const useStyles = makeStyles(() => ({
    formItem: {
        'width': '100%',
        'color': blue[800],
        '&:not(:last-child)': {
            marginBottom: theme.spacing(2),
            minHeight: '80px',
        },
        '& .Mui-error': {
            '&:hover fieldset': {
                borderColor: red[500],
            }
        },
        '& .MuiOutlinedInput-root': {
            'borderRadius': '16px',
            '& input': {},
            '& fieldset': {
                borderColor: blue[800],
            },
            '&:hover fieldset': {
                borderColor: blue[800],
            },
        },
    },
}));

const CustomInput = ({handler, id, label, isPassword, errorMessage}: CustomInputProps) => {
    const classes = useStyles();

    return (
        <TextField
            onChange={handler}
            variant="outlined"
            className={classes.formItem}
            id={id}
            label={label}
            type={isPassword ? 'password' : 'text'}
            error={errorMessage !== '' && errorMessage !== undefined}
            helperText={errorMessage}
        />
    );
};

export default CustomInput;
