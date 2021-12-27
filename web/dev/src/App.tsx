import './App.css';
import React, {useEffect} from 'react';
import Form from './components/Form';
import Modal from './components/Modal';
import {useTypedSelector} from '@hooks/useTypedSelector';
import {Route, Switch, useHistory} from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import {useActions} from '@hooks/useActions';

const App: React.FC = () => {
    const auth = useTypedSelector((state) => state.auth);
    const modal = useTypedSelector((state) => state.modal);
    const {getCurrentUser} = useActions();
    const history = useHistory();

    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        console.log('auth', auth);
    }, [auth]);

    console.log(auth);
    return (
        <div className="App">
            <Switch>
                <Route exact path="/auth" component={Form}/>
                <Route path="/home" component={Home}/>
                <Route path="/admin" component={Search}/>
                {auth?.name ? history.push('/home') : history.push('/auth')}
            </Switch>
            {modal.show ? <Modal/> : ''}
        </div>
    );
};

export default App;
