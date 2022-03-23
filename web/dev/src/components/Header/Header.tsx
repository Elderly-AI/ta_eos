import {
    AppBar,
    Toolbar,
    Button,
    makeStyles
} from '@material-ui/core';
import {blue} from '@material-ui/core/colors';
import {Link as RouterLink} from 'react-router-dom';
import React, {useState} from 'react';
import {useTypedSelector} from '../../../src/hooks/useTypedSelector';

const useStyles = makeStyles(() => ({
    header: {
        backgroundColor: blue[900],
    },
    titleButton: {
        fontWeight: 600,
        color: 'white',
        textAlign: 'left',
    },
    toolbar: {
        display: 'flex',
    },
}));

export default function Header() {
    const {header, titleButton, toolbar} = useStyles();

    const user = useTypedSelector((state) => state.auth);

    const contentHeaderComponent = () => {
        return (
            <Toolbar className={toolbar}>
                {titleButtonComponent('тренажёр', '/home')}
                {titleButtonComponent('контрольные', '/works')}
                {titleButtonComponent('лекции', '/lectures')}
                {user?.role === 'admin' && titleButtonComponent('управление', '/admin')}
            </Toolbar>
        );
    };

    const titleButtonComponent = (title: string, link: string) => {
        return (
            <Button className={titleButton}
                {...{
                    color: 'inherit',
                    to: link,
                    component: RouterLink,
                    label: title,
                }}
            >
                {title}
            </Button>
        );
    };

    return (
        <header>
            <AppBar className={header}>{contentHeaderComponent()}</AppBar>
        </header>
    );
}
