import './App.css';
import React, {useEffect} from 'react';
import Form from './components/Form';
import Modal from './components/Modal';
import {useTypedSelector} from '@hooks/useTypedSelector';
import {Route, Switch, useHistory} from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import {useActions} from '@hooks/useActions';
import Admin from './components/Admin';
import Works from './components/Works';

const App: React.FC = () => {
    const auth = useTypedSelector((state) => state.auth);
    const modal = useTypedSelector((state) => state.modal);
    const {getCurrentUser} = useActions();
    const history = useHistory();

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <div className="App">
            <Switch>
                <Route exact path="/auth" component={Form}/>
                <Route path="/home" component={Home}/>
                <Route exact path="/admin" component={Search}/>
                <Route path='/admin/:userId' component={Admin}/>
                <Route exact path="/works" component={Works}/>
                {auth?.name ? history.push('/home') : history.push('/auth')}
            </Switch>
            {modal.show ? <Modal/> : ''}
        </div>
    );
};

export default App;
