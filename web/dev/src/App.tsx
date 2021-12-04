import React from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import './App.css';
import Form from '@Form';
import Modal from '@Modal';
import Home from '@Home';
import {useTypedSelector} from '@hooks/useTypedSelector';

const App: React.FC = () => {
    const auth = useTypedSelector((state) => state.auth);
    const modal = useTypedSelector((state) => state.modal);
    const history = useHistory();

    return (
        <div className="App">
            <Switch>
                <Route exact path="/auth" component={Form}/>
                <Route path="/home" component={Home}/>
                {/* {auth?.inside ? history.push("/home") : history.push("/auth")}*/}
            </Switch>
            {modal.show ? <Modal/> : ''}
            {/* {auth?.inside ? <Home/> : <Form/>} */}

        </div>
    );
};

export default App;
