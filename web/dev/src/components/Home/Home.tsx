import React from 'react';
import {blue} from '@material-ui/core/colors';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Header from '@Header';
import Math from '@Math';

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: blue[800],
    },

}));

const Home = () => {
    const classes = useStyles();
    console.log('dir');
    return (
        <div className={classes.container}>
            <Header/>
            <Math/>
        </div>
    );
};

export default Home;
