import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SignUp from './components/signUp'
import LandingPage from './pages/landing-page'
import GamePage from './pages/game-page'
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
        const { username } = this.state
        var page = null
        if (username) {
            page = <GamePage username={this.state.username} />
        }
        else {
            page =
            <Router>
                <div className="header">
                    <div id="landingPage">
                        <Route exact path='/' render={(props) => {
                            return <LandingPage onSignIn={this.onSignIn.bind(this)} {...props} />
                        }} />
                    </div>
                    <Route path='/games' render={(props) => {
                        return <GamePage username={username} {...props} />
                    }} />
                    <Route path='/signup' render={(props) => {
                        return <SignUp onSubmit={createNewUser} />
                    }} />
                </div>
            </Router>
        }
        return page;
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
