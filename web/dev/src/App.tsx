import "./App.css";
import Form from "./components/Form";
import Home from "./components/Home";
import Modal from "./components/Modal";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useActions } from "./hooks/useActions";
import { useEffect } from "react";

function App() {
  const auth = useTypedSelector((state) => state.auth);
  const modal = useTypedSelector((state) => state.modal);
  const history = useHistory();
  const { authInside } = useActions();
  console.log("user", auth);
  console.log("app user inside >>>", auth?.inside)

  useEffect(() => {
    authInside();
    // isInside();
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path="/auth" component={Form} />
        <Route path="/home" component={Home}/>
        {auth?.inside ? history.push("/home") : history.push("/auth")}
      </Switch>
      {modal.show ? <Modal /> : ""}
      {/* {auth?.inside ? <Home/> : <Form/>} */}

    </div>
  );
}

export default App;
