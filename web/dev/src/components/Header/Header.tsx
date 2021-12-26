import {AppBar, Toolbar, makeStyles, Button} from '@material-ui/core';
import {blue} from '@material-ui/core/colors';
import {Link as RouterLink} from 'react-router-dom';
import React, {useState} from 'react';
import {useTypedSelector} from '@hooks/useTypedSelector';

const useStyles = makeStyles(() => ({
    header: {
        backgroundColor: blue[900],
        paddingRight: '79px',
    },
    title: {
        fontWeight: 600,
        color: 'white',
        textAlign: 'left',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    adminButton: {
        fontWeight: 700,
        size: '18px',
    },
}));

export default function Header() {
    const {header, title, adminButton, toolbar} = useStyles();

    const user = useTypedSelector((state) => state.auth);

    const contentHeaderComponent = () => {
        return (
            <Toolbar className={toolbar}>
                {titleComponent}
                <div>{adminButtonComponent()}</div>
            </Toolbar>
        );
    };

    const titleComponent = (
        <Button variant="text" className={title}
            {...{
                color: 'inherit',
                to: '/home',
                component: RouterLink,
            }}
        >
        Тренажер по ТА
        </Button>
    );

    const adminButtonComponent = () => {
        if (user?.role !== 'admin') {
            return null;
        }
        return (
            <Button className={adminButton}
                {...{
                    color: 'inherit',
                    to: '/admin',
                    component: RouterLink,
                }}
            >
            Управление
            </Button>
        );
    };

    return (
        <header>
            <AppBar className={header}>{contentHeaderComponent()}</AppBar>
        </header>
    );
}
