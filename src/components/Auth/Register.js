import React from "react";
import {Link} from "react-router-dom";
import firebase from "../../firebase";
import md5 from 'md5'; // md5 is usually being used to hash messages
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon
} from "semantic-ui-react";

class Register extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users') //table of firebase named: users
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    };

    isFormValid = () => {
        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            //throw error
            error = {message: "Fill in all fields"};
            this.setState({errors: errors.concat(error)}); //concat merge 2 or more arrays
            return false;

        } else if (!this.isPasswordValid(this.state)) {
            error = {message: "Password is invalid"};
            this.setState({errors: errors.concat(error)});
            return false;

        } else {
            return true;
        }
    }

    // if have 0 length form any of inputs will return to this function true
    isFormEmpty = ({username, email, password, passwordConfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ({password, passwordConfirmation}) => {
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    };

    // Function that will display type of the error
    displayErrors = (errors) =>
        errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleInputError = (errors, inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName)) ? "error" : "";
    };

    handleSubmit = event => {
        event.preventDefault();       // when submit to handle browser from reload/refresh
        if (this.isFormValid()) {
            // clean errors to state and load true
            this.setState({errors: [], loading: true})
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user
                        .updateProfile({
                            displayName: this.state.username,
                            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                        })
                        .then(() => {
                            this.saveUser(createdUser).then(() => {
                                console.log("user saved");
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            this.setState({
                                errors: this.state.errors.concat(err),
                                loading: false
                            });
                        });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                });
        }
    };

    // instead of a unique id set displayName & photoURL
    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({ //uid -> is ID(set as child)
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    };

    render() {
        // destructure all values from state to use as individual inputs
        const {username, email, password, passwordConfirmation, errors, loading} = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header icon color="green" textAlign="center">
                        <Icon name="puzzle piece" color="green"/>
                        Register for DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Segment>
                            <Form.Input name="username"
                                        icon="user"
                                        iconPosition="left"
                                        placeholder="Username"
                                        onChange={this.handleChange}
                                        value={username}
                                        type="text"/>
                            <Form.Input name="email"
                                        icon="mail"
                                        iconPosition="left"
                                        placeholder="Email Address"
                                        onChange={this.handleChange}
                                        value={email}
                                // if the type of the errors includes with the name of the input -> show className error
                                        className={this.handleInputError(errors, "email")}
                                        type="email"/>
                            <Form.Input name="password"
                                        icon="lock"
                                        iconPosition="left"
                                        placeholder="Password"
                                        onChange={this.handleChange}
                                        value={password}
                                        className={this.handleInputError(errors, 'password')}
                                        type="password"/>
                            <Form.Input name="passwordConfirmation"
                                        icon="repeat"
                                        iconPosition="left"
                                        placeholder="Password Confirmation"
                                        onChange={this.handleChange}
                                        className={this.handleInputError(errors, 'password')}
                                        value={passwordConfirmation}
                                        type="password"/>
                            <Button disabled={loading} className={loading ? 'loading' : ''} color="green" fluid
                                    size="medium">
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    {/*// if destructure errors from state we made as below: (before: this.state.errors.length)*/}
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error: </h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Already a user? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;
