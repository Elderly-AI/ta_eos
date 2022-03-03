import React from 'react';
import {blue} from '@material-ui/core/colors';
import {makeStyles} from '@mui/styles';
import Header from '@Header';
import Math from '@Math';

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: blue[800],
        height: '100%',
    },

}));

const Home = () => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Header/>
            <Math/>
        </div>
    );
};

export default Home;
