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
      gameId: this.props.match.params.gameId || null,
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

  createGame() {
    if (this.state.username) this.socket.emit('create-game');
  }

  signin() {
    if (this.state.gameId && this.state.username) this.setState({ joinGame: true });
  }

  render() {
    let step = null;
    console.log(JSON.stringify(this.props));
    if (this.state.joinGame) {
      step = <Game onQuit={error => this.onQuit(error)} socket={this.socket} gameId={this.state.gameId} username={this.state.username} />
    }
    else if (this.props.match.params.gameId) {
      step = <div>
        <div className="home-bg">
          <div>
            <h1 className="devX">Corona Trivia!</h1>
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
                      <FormControl
                        type="text"
                        name="username"
                        placeholder="Player name"
                        value={this.state.username}
                        onChange={e => this.setState({ username: e.target.value })}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <FormGroup>
                      <Button className="logInbtn" onClick={() => this.signin()}>Join Game</Button>
                    </FormGroup>
                  </Col>
                </Row>
              </form>
            </div>
          </div>
        </div>
      </div>
    }
    else if (this.state.gameCreated && this.state.gameId) {
      step =
        <div>
          <div className="home-bg">
            <div>
              <div>
                <h1 className="devX">Corona Trivia!</h1>
              </div>
              <div className="container">
                <div className="signup">
                  <div>Your new game ID is {this.state.gameId}</div>
                  <div>Send this URL to other players and they can join the game</div>
                  <div className='gameUrl'>{`${window.location.href}games/${this.state.gameId}`}</div>
                  <button onClick={() => this.signin()}>Join Game Now</button>
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
              <h1 className="devX">Corona Trivia!</h1>
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
                        <FormControl
                          type="text"
                          name="username"
                          placeholder="Player name"
                          value={this.state.username}
                          onChange={e => this.setState({ username: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} >
                      <FormGroup>
                        <Button className="logInbtn" onClick={() => this.createGame()}>Create New Game</Button>
                      </FormGroup>
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