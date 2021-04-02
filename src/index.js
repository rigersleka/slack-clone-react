import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import registerServiceWorker from "./registerServiceWorker";
import firebase from "./firebase";
import "semantic-ui-css/semantic.min.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter
} from "react-router-dom";

import {createStore} from "redux";
import {Provider, connect} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";
import rootReducer from "./reducers";
import {setUser, clearUser} from "./actions";
import Spinner from './Spinner';


const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {

    // lifeCycle() -> if userIsAuth Redirect me to HomePage
    componentDidMount() {
        console.log(this.props.isLoading);
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // console.log(user);
                this.props.setUser(user);     // will notify us for the state with the action
                this.props.history.push("/");
            } else {
                // when user is not found but the listener
                this.props.history.push('/login');
                this.props.clearUser();
            }
        });
    }

    render() {
        return this.props.isLoading ? <Spinner /> : (
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Switch>
        );
    }
}

const mapStateFromProps = state => ({
   isLoading : state.user.isLoading // has been taken from user_reducer that is initialize in initialState
});

const RootWithAuth = withRouter(
    connect(
        mapStateFromProps,
        {setUser, clearUser}
    )(Root)
);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth/>
        </Router>
    </Provider>,
    document.getElementById("root")
);
registerServiceWorker();
