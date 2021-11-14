import "./App.css";
import Form from "./components/Form";
import Modal from "./components/Modal";
import {useTypedSelector} from "./hooks/useTypedSelector";
import {Route, Switch, useHistory} from "react-router-dom";
import {useEffect} from "react";
import DataService from "./data/DataService";

function App() {
    const auth = useTypedSelector((state) => state.auth);
    const modal = useTypedSelector((state) => state.modal);
    const history = useHistory();
    console.log("user", auth);

    useEffect(() => {
        DataService.curUser()
            .then((res) => console.log(res))
            .catch((error) => console.error('er', error))
    }, [])

    return (
        <div className="App">
            <Switch>
                <Route exact path="/auth" component={Form}/>
                {/*<Route path="/home" component={Home}/>*/}
                {/*{auth?.inside ? history.push("/home") : history.push("/auth")}*/}
            </Switch>
            {modal.show ? <Modal/> : ""}
            {/* {auth?.inside ? <Home/> : <Form/>} */}

        </div>
    );
}

export default App;
