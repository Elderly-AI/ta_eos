import Header from '@Header';
import React, {useState} from 'react';
import {Button, makeStyles, TextField} from '@material-ui/core';
import DataService from '@data/DataService';
import {SearchUser} from '@data/Models';
import {Link} from 'react-router-dom';

const useStyles = makeStyles(() => ({
    textField: {
        display: 'flex',
        width: '50vh',
    },
    searchButton: {
        display: 'flex',
    },
    searchComponent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '80vw',
        marginLeft: '10vh',
        marginRight: '10vh',
        marginTop: '15vh',
    },
}));

export default function Search() {
    const classes = useStyles();

    const [users, setUsers] = useState<Array<SearchUser>>([]);
    const [searchWord, setSearchWord] = useState<string>('');

    const buttonClicked = () => {
        console.log('kek');
        DataService.search(searchWord)
            .then((users) => {
                setUsers(users);
                console.log(users);
            });
    };

    const textChanged = (event: any) => {
        setSearchWord(event.target.value);
        console.log(searchWord);
    };

    return (
        <div>
            <Header/>
            <div className={classes.searchComponent}>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={searchWord}
                    className={classes.textField}
                    onChange={(event) => textChanged(event)}/>
                <Button variant="contained" onClick={() => buttonClicked()}>Поиск</Button>
                <Link to={`/admin/${searchWord}`}>go</Link>
            </div>
        </div>
    );
}
