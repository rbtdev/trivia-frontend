import React, { Component } from 'react'
import SignIn from '../components/signIn'
import '../App.css';
class LandingPageView extends Component {
    constructor (props) {
        super();
        this.onSignIn = props.onSignIn;
    }
  render() {
    return (
        <div className="home-bg">
            <div>
                <h1 className="devX">DevX Trivia</h1>
            </div>
            <div className="container">
                <div className="signin">
                    <h3>Sign-In</h3>
                        <SignIn onSignIn = {this.onSignIn}/>
                </div>
            </div>
        </div>
    );
  }
}
export default LandingPageView;
