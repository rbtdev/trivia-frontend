import React, { Component } from "react";
import {
  Button,
  Col,
  ControlLabel,
  FormGroup,
  FormControl,
  Row
} from "react-bootstrap";
import "../App.css"
import Game from '../components/game';

import io from "socket.io-client";

class GamePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      gameCreated: false,
      gameId: null,
      username: null,
      joinGame: false
    }

    this.socket = io('/trivia');
    this.socket.on('connect', () => {
      this.socket.on('game-created', gameId => this.setState({ gameCreated: true, gameId }));
      this.socket.on('signin', () => this.setState({ isSignedIn: true }))
    });

  }

  onQuit(error) {
    this.setState({
      error,
      gameCreated: false,
      gameId: null,
      username: null,
      joinGame: false
    })
  }

  next() {
    if (this.state.gameId && this.state.username) this.setState({ joinGame: true });
    else this.socket.emit('create-game');
  }

  render() {
    let step = null;
    if (this.state.joinGame) {
      step = <Game onQuit={error => this.onQuit(error)} socket={this.socket} gameId={this.state.gameId} username={this.state.username} />
    }
    else if (this.state.gameCreated && this.state.gameId) {
      step =
        <div>
          <div className="home-bg">
            <div>
              <div>
                <h1 className="devX">DevX Trivia</h1>
              </div>
              <div className="container">
                <div className="signup">
                  <div>You new game ID is {this.state.gameId}</div>
                  <div>Send this Game ID to other players and they can join the game</div>
                  <button onClick={() => this.next()}>Join Game Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    }
    else {
      step =
        <div>
          <div className="home-bg">
            <div>
              <h1 className="devX">DevX Trivia</h1>
            </div>
            <div className="container">
              <div className="signup">          {this.state.error &&
                <div>
                  Error during game {this.state.error}
                </div>
              }
                <form>
                  <Row>
                    <Col xs={6}>
                      <FormGroup>
                        <ControlLabel id="username"></ControlLabel>
                        <FormControl
                          type="text"
                          name="username"
                          placeholder="Username"
                          value={this.state.username}
                          onChange={e => this.setState({ username: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <FormGroup>
                        <ControlLabel id="password"></ControlLabel>
                        <FormControl
                          type="text"
                          name="game-id"
                          placeholder="Game ID"
                          value={this.state.ganeId}
                          onChange={e => this.setState({ gameId: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <Button id="logInbtn" onClick={() => this.next()}>
                        {this.state.gameId ? 'Join Game' : 'Create New Game'}
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </div>
        </div>
    }

    return (step)
  }
}

export default GamePage;