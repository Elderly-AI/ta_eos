import Button from "@material-ui/core/Button";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {ChangeEvent, useState} from "react";
import CustomInput from "../../CustomInput";
import {CustomInputProps} from "../../CustomInput/CustomInput";
import {useActions} from "../../../hooks/useActions";
import {authLoginRequest, authRegisterRequest} from "../../../data/Models";

const useStyles = makeStyles((theme: Theme) => ({
    form: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    textInputs: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
    },
}));

const inputs: CustomInputProps[] = [
    {
        id: "email",
        label: "Email",
        isPassword: false,
    },
    {
        id: "password",
        label: "Пароль",
        isPassword: true,
    },
    {
        id: "name",
        label: "Имя",
        isPassword: false,
    },
    {
        id: "group",
        label: "Группа",
        isPassword: false,
    },
];

const Registration = () => {
    const classes = useStyles();
    // TOKEN
    // const token = useTypedSelector((store) => store.auth?.token);
    const {authorize, showModal, register} = useActions();
    const [fd, setFd] = useState<authRegisterRequest>({} as authRegisterRequest);

    const formHandler = (e: any) => {
        const datForLogin: authLoginRequest = {
            email: fd.user.email,
            group: fd.user.group,
            password: fd.user.password
        };
        // console.log('for login > ', datForLogin);
        e.preventDefault();

        register(fd);
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
        setFd(prevState => ({
            user: {
                ...prevState.user,
                [e?.target?.id]: e.target.value
            }
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
