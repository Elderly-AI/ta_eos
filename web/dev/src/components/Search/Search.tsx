import Header from '@Header';
import React, {useState} from 'react';
import {
    Button,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@material-ui/core';
import DataService from '@data/DataService';
import {SearchUser} from '@data/Models';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles(() => ({
    textField: {
        display: 'flex',
        width: '70vw',
    },
    searchButton: {
        display: 'flex',
        marginLeft: '2vh',
    },
    searchComponent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    adminComponent: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '10vw',
        marginRight: '10vw',
        marginTop: '15vh',
        width: '80vw',
    },
    tableView: {
        marginTop: '5vh',
        marginBottom: '10vh',
        maxWidth: '70vw',
        marginLeft: '5vw',
        marginRight: '5vw',
    },
    pointer: {
        cursor: 'pointer'
    }
}));

export default function Search() {
    const classes = useStyles();
    const history = useHistory();
    const [users, setUsers] = useState<Array<SearchUser>>([]);
    const [searchWord, setSearchWord] = useState('');

    const buttonClicked = () => {
        DataService.search(searchWord)
            .then((users) => {
                setUsers(users);
            });
    };

    const textChanged = (event: any) => {
        setSearchWord(event.target.value);
    };

    const handleClick = (userId: string) => {
        history.push(`/admin/${userId}`);
    };

    return (
        <div className={classes.adminComponent}>
            <Header/>
            <div className={classes.searchComponent}>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={searchWord}
                    className={classes.textField}
                    onChange={(event) => textChanged(event)}/>
                <Button
                    variant="contained"
                    onClick={() => buttonClicked()}
                    disabled={searchWord === ''}
                    className={classes.searchButton}
                >
                  Поиск
                </Button>
            </div>
            <TableContainer component={Paper} className={classes.tableView}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Имя</TableCell>
                            <TableCell align="center">Группа</TableCell>
                            <TableCell align="right">Почта</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                className={classes.pointer}
                                onClick={() => handleClick(user.userId)}
                                key={user.userId}
                            >
                                <TableCell component="th" scope="row">
                                    {user.name}
                                </TableCell>
                                <TableCell align="center">{user.group}</TableCell>
                                <TableCell align="right">{user.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
