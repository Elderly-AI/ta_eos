import React, {FC} from 'react';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles(() => ({
    badge: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '64px',
        minWidth: 52,
        backgroundColor: '#2E7D32'
    },
    wrapper: {
        display: 'flex',
        gap: '8px',
    }
}));

type Props = {
  text: string,
}

const CustomBadge: FC<Props> = ({
    children,
    text
}) => {
    const classes = useStyles();

    return <div className={classes.wrapper}>
        {text}
        {
            children && <div className={classes.badge}>
                {children}
            </div>
        }
    </div>;
};

export default CustomBadge;
