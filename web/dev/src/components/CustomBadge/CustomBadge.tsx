import React, {FC} from 'react';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    badge: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '64px',
        minWidth: 52,
    },
    wrapper: {
        display: 'flex',
        gap: '8px',
    },
    successBadge: {
        backgroundColor: '#2E7D32'
    },
    errorBadge: {
        backgroundColor: 'red'
    }
}));

type Props = {
  text: string,
  isSuccessBadge: boolean
}

const CustomBadge: FC<Props> = ({
    children,
    text,
    isSuccessBadge
}) => {
    const classes = useStyles();

    return <div className={classes.wrapper}>
        {text}
        {
            children && <div
                className={`${classes.badge} ${isSuccessBadge ? classes.successBadge : classes.errorBadge}`}
            >
                {children}
            </div>
        }
    </div>;
};

export default CustomBadge;
