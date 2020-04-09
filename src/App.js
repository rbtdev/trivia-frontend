import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import GamePage from './pages/game-page';
import './App.css'
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            user: [],
            newUserSuccess: false,
            errors: null,
        }
    }
    newUserSubmit() {
    }
    onSignIn(formData) {
        this.setState({ username: formData.email })
    }
    handleNewUser = (user) => {
        createNewUser(user)
            .then((res) => {
                const { user, errors } = res
                this.setState({
                    user: user,
                    newUserSuccess: res.errors ? false : true,
                    errors: errors
                })
            })
            .catch(e => console.log("error creating user:", e))
    }


    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/games/:gameId' component={GamePage} />
                    <Route path='/' component={GamePage} />
                </Switch>
            </Router>
        )
    }
}
const API = "http://localhost:3000"
function createNewUser(user) {
    console.log("creating user:", user)
    return fetch(`${API}/users`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    })
        .then((raw) => raw.json())
}
export default App;
