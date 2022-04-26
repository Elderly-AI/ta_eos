import React from 'react';
import {blue} from '@material-ui/core/colors';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Header from '../../../src/components/Header';
import Math from '../../../src/components/Math';

const useStyles = makeStyles((theme: Theme) => ({
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
