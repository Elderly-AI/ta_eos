import Button from '@material-ui/core/Button';
import React, {ChangeEvent, useState} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import CustomInput, {CustomInputProps} from '../../CustomInput';
import {useActions} from '../../../../src/hooks/useActions';
import {authLoginRequest, authRegisterRequest} from '../../../../src/data/Models';
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

const Registration = () => {
    const classes = useStyles();
    // TOKEN
    // const token = useTypedSelector((store) => store.auth?.token);
    const {authorize, showModal, register} = useActions();
    const [fd, setFd] = useState<authRegisterRequest>({} as authRegisterRequest);
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
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
            id: 'name',
            label: 'Имя',
            isPassword: false,
            errorMessage: nameError,
        },
        {
            id: 'group',
            label: 'Группа',
            isPassword: false,
            errorMessage: groupError,
        },
    ];

    const formHandler = (e: any) => {
        e.preventDefault();

        // eslint-disable-next-line
        let errorEmail, errorPassword, errorGroup, errorName;

        setEmailError(errorEmail = Validator.validateEmail(fd.user?.email));
        setNameError(errorName = Validator.validateName(fd.user?.name));
        setPasswordError(errorPassword = Validator.validatePassword(fd.user?.password));
        setGroupError(errorGroup = Validator.validateGroup(fd.user?.group.toLocaleUpperCase()));

        if (!errorEmail && !errorPassword && !errorGroup && ! errorName) {
            register({
                user: {
                    name: fd.user.name,
                    email: fd.user.email,
                    group: fd.user.group.toLocaleUpperCase(),
                    password: fd.user.password,
                }
            } as authRegisterRequest);
        }
        // const datForLogin: authLoginRequest = {
        //     email: fd.user.email,
        //     group: fd.user.group,
        //     password: fd.user.password,
        // };
        // authorize(datForLogin);
        // TOKEN
        // let headers: HeadersInit | undefined;
        // if (document.cookie && token) {
        //   headers = {
        //     "Content-Type": "application/json;charset=utf-8",
        //     "X-CSRFToken": token,
        //   };
        // } else {
        //   headers = {
        //     "Content-Type": "application/json;charset=utf-8",
        //   };
        // }
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        setFd((prevState) => ({
            user: {
                ...prevState.user,
                [e?.target?.id]: e.target.value,
            },
        }));
    };

    return (
        <form onSubmit={(e) => formHandler(e)} method="POST" className={classes.form} noValidate autoComplete="off">
            <div className={classes.textInputs}>
                {inputs.map((input) => (
                    <CustomInput key={input.id} handler={handleChange} {...input} />
                ))}
                <Button type="submit" variant="contained" color="primary">
                    Зарегистрироваться
                </Button>
            </div>
        </form>
    );
};

export default Registration;
