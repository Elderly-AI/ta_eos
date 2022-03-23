import Button from '@material-ui/core/Button';
import React, {ChangeEvent, useState} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {useActions} from '../../../../src/hooks/useActions';
import CustomInput, {CustomInputProps} from '../../CustomInput/CustomInput';
import {Link} from 'react-router-dom';
import {authLoginRequest} from '../../../../src/data/Models';
import Validator from '../../../../src/utils/Validator';

const useStyles = makeStyles((theme: Theme) => ({
    form: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '32px',
    },
    textInputs: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
}));

const Login = () => {
    const {authorize, showModal} = useActions();
    const classes = useStyles();
    // TOKEN
    // const token = useTypedSelector((store) => store.auth?.token);
    const [fd, setFd] = useState<authLoginRequest>({} as authLoginRequest);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [groupError, setGroupError] = useState('');

    const inputs: CustomInputProps[] = [
        {
            id: 'email',
            label: 'Email',
            isPassword: false,
            errorMessage: emailError,
        },
        {
            id: 'password',
            label: 'Пароль',
            isPassword: true,
            errorMessage: passwordError,
        },
        {
            id: 'group',
            label: 'Группа',
            isPassword: false,
            errorMessage: groupError,
        }
    ];


    const formHandler = (e: any) => {
        // TOKEN
        // let headers: HeadersInit | undefined;
        //
        // if (document.cookie && token) {
        //     headers = {
        //         "Content-Type": "application/json;charset=utf-8",
        //         "X-CSRFToken": token,
        //     };
        // } else {
        //     headers = {
        //         "Content-Type": "application/json;charset=utf-8",
        //     };
        // }

        e.preventDefault();

        // eslint-disable-next-line
        let errorEmail, errorPassword, errorGroup;
        setEmailError(errorEmail = Validator.validateEmail(fd.email));
        setPasswordError(errorPassword = Validator.validatePassword(fd.password));
        // TODO раскоментить это на проде!
        // setGroupError(errorGroup = Validator.validateGroup(fd.group.toLocaleUpperCase()));

        if (!errorEmail && !errorPassword && !errorGroup) {
            authorize({
                email: fd.email,
                password: fd.password,
                group: fd.group.toLocaleUpperCase(),
            } as authLoginRequest);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setFd({...fd, [e?.target?.id]: e.target.value});
    };

    return (
        <form className={classes.form}>
            <div className={classes.textInputs}>
                {inputs.map((input) => (
                    <CustomInput key={input.id} handler={handleChange} {...input} />
                ))}
                <Link onClick={formHandler} to="/home">
                    <Button variant="contained" color="primary">
                        Вход
                    </Button>
                </Link>
            </div>
        </form>
    );
};

export default Login;
