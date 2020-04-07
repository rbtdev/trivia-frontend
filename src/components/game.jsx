import React, { Component } from "react"
import "../App.css"

const categoryImages = {
    "Animals": "./images/Animals.jpg",
    "General Knowledge": "./images/general-knowledge.jpg",
    "Entertainment: Books": "./images/library.jpg",
    "Entertainment: Film": "./images/Entertainment-film.jpg",
    "Entertainment: Music": "./images/mic.jpg",
    "Entertainment: Television": "./images/entertainment-television.jpg",
    "Entertainment: Video Games": "./images/pubg.jpg",
    "Entertainment: Board Games": "./images/entertainment-board-games.jpg",
    "Science & Nature": "./images/science-nature.jpg",
    "Science: Computers": "./images/computerchip.jpg",
    "Science: Mathematics": "./images/maths.jpg",
    "Mythology": "./images/greek.jpg",
    "Sports": "./images/stadium.jpg",
    "Geography": "./images/flatEarth.png",
    "History": "./images/history.jpg",
    "Politics": "./images/washington-dc.jpg",
    "Art": "./images/art.jpg",
    "Celebrities": "./images/hollywood.jpg",
    "Vehicles": "./images/cbackToFut.jpg",
    "Entertainment: Comics": "./images/deadPool.png",
    "Science: Gadgets": "./images/Gadgets.jpg",
    "Entertainment: Japanese Anime & Manga": "./images/goku.jpg",
    "Entertainment: Cartoon & Animations": "./images/cartoons.jpg",
    "Entertainment: Musicals & Theatres": "./images/theatre.jpg"
}


//
// Utility to decode HTML strings
//
function decodeEntities(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}

const SIGNIN_ERRORS = {
    'invalid-game': 'The game ID you provided was not a valid game',
    'default': 'An unknown error occured during signin'
}

class Game extends Component {
    constructor(props) {
        super(props);


        this.state = {
            connecting: true,
            signinError: null,
            waiting: false,
            getReady: false,
            question: {},
            answerStatus: '',
            correctAnswer: '',
            score: 0,
            timeout: false,
            scoreList: [],
        };

        this.props.socket.on('signin', signinError => this.props.onQuit(signinError));
        this.props.socket.on('waiting', () => this.setState({ mode: 'waiting' }));
        this.props.socket.on('getready', () => this.setState({ mode: 'getready' }));

        this.props.socket.on('question', question => this.setState({
            mode: 'question',
            question: question,
            answerStatus: '',
            correctAnswer: '',
            timeout: false,
        }));

        this.props.socket.on('timeout', () => this.setState({
            mode: 'timeout',
            question: {},
            answerStatus: '',
            correctAnswer: ''
        }));

        this.props.socket.on('right', score => this.setState({
            question: {},
            mode: 'right',
            score,
            correctAnswer: '',
            timeout: false
        }));

        this.props.socket.on('wrong', correctAnswer => this.setState({
            mode: 'wrong',
            question: {},
            correctAnswer,
            timeout: false
        }));

        this.props.socket.on('scorelist', scoreList => this.setState({ scoreList }));
    }

    get background() {
        let categoryImage = categoryImages[this.state.question.category]
        let background = categoryImage
            ? <img id="background" src={categoryImage} alt="category" />
            : <div id="background"></div>
        return background;
    }

    get scoreboard() {
        let scoreList = [...this.state.scoreList];
        let place = 1;
        let prevPlayer = null;
        let scoreboard = scoreList.sort((a,b) => (b.score - a.score)).map((player, index) => {
            if (prevPlayer && player.score < prevPlayer.score) place++;
            prevPlayer = player;
            let playerElement =
                <div key = {index} className='playerElement'>
                    <div className='playerRank'>{place}</div>
                    <div className='playerUserName'>{player.username}</div>
                    <div className='playerScore'>{player.score}</div>
                </div>
            return playerElement;
        })
        return (
            <div className='scoreBoard'>
                {scoreboard}
            </div>
        );
    }

    get content() {
        let currentQuestion = this.state.question
        let answers = currentQuestion.answers;
        const { score } = this.state
        let content = <div>
            <p>Invalid state {this.state.mode}</p>
        </div>

        switch (this.state.mode) {
            case 'connecting': {
                content = <div>
                    Connecting to game {this.props.gameId}...
            </div>
            }
            case 'waiting':
                content =
                    <div>
                        <div id='waiting'>You'll be in the game for the next question, hold tight</div>
                    </div>
                break;
            case 'getready':
                content =
                    <div>
                        <div id='waiting'>Ok, here comes the next question</div>
                    </div>
                break;
            case 'question':
                content =
                    <div>
                        <p className='category'>{currentQuestion.category} - {currentQuestion.points} points </p>
                        <p className='question'> {decodeEntities(currentQuestion.question)} </p>
                        <div className="answer-container">
                            {answers.map((a) => {
                                return <div className="answer-button" key={a} onClick={this.answerClick.bind(this, a)}> {decodeEntities(a)} </div>
                            })}
                        </div>
                    </div>
                break;
            case 'right':
                content =
                    <div>
                        <h3 className='score'> Score: {score} </h3>
                        <p className='question'> You are Right!</p>
                    </div>
                break;
            case 'wrong':
                content =
                    <div>
                        <h3 className='score'> Score: {score} </h3>
                        <p className='question'> You are Wrong! the correct answer is "{this.state.correctAnswer}"</p>
                    </div>
                break;
            case 'timeout':
                content =
                    <div >
                        <p> Sorry, time is up.</p>
                    </div>
                break;
        }
        return content;
    }

    answerClick(answer) {
        this.props.socket.emit('answer', answer);
    }

    componentDidMount() {
        this.props.socket.emit('signin', this.props.gameId, this.props.username)
    }

    render() {
        return (
            <div>
                {this.background}
                {this.scoreboard}
                {this.content}
            </div >
        )
    }
}

export default Game;