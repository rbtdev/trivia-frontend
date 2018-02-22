import React, { Component } from 'react'
import SignIn from '../components/signIn'
import '../App.css';

class LandingPageView extends Component {
  render() {
    return (
        <div className="home-bg">
            <div>
                <h1 className="devX">DevX Trivia</h1>
            </div>
            <div className="container">
                <div className="signin">
                    <h3>Sign-In</h3>
                        <SignIn />
                </div>
            </div>
        </div>

    );
  }
}

export default LandingPageView;
