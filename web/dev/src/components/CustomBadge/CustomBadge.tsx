import React, {FC} from 'react';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    badge: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '64px',
        minWidth: 52,
        backgroundColor: '#2E7D32'
    },
}));

const CustomBadge: FC = ({children}) => {
    const classes = useStyles();

    return <div className={classes.badge}>
        {children}
    </div>;
};

export default CustomBadge;
