import './App.css';
import React, {useCallback, useEffect} from 'react';
import Form from './components/Form';
import Modal from './components/Modal';
import {useTypedSelector} from '../src/hooks/useTypedSelector';
import {Route, Switch, useHistory} from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import {useActions} from '../src/hooks/useActions';
import Admin from './components/Admin';
import Works from './components/Works';
import Work from './components/Work';

const App: React.FC = () => {
    const auth = useTypedSelector((state) => state.auth);
    const modal = useTypedSelector((state) => state.modal);
    const {getCurrentUser} = useActions();
    const history = useHistory();
    useEffect(() => {
        getCurrentUser();
    }, []);

    const redirect = useCallback(() => {
        console.log('auth', auth);
        if (!auth) {
            history.push('/auth');
            return;
        }

        if (history.location.pathname === '/auth') {
            history.push('/home');
        }
    }, [auth, history]);

    return (
        <div className="App">
            <Switch>
                <Route exact path="/auth" component={Form}/>
                <Route path="/home" component={Home}/>
                <Route exact path="/admin" component={Search}/>
                <Route path='/admin/:userId' component={Admin}/>
                <Route exact path="/works" component={Works}/>
                <Route exact path="/work/:userId" component={Work}/>
                {redirect()}
            </Switch>
            {modal.show ? <Modal/> : ''}
        </div>
    );
};

export default App;
