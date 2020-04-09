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
            mode: 'connecting',
            signinError: null,
            question: {},
            answerStatus: '',
            correctAnswer: '',
            score: 0,
            scoreList: [],
            responses: []
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

        this.props.socket.on('right', (points, answer) => this.setState({
            responses: [...this.state.responses, { points, answer }],
            question: {},
            feedback: 'right',
            mode: 'answering',
            correctAnswer: '',
            timeout: false
        }));

        this.props.socket.on('wrong', (correctAnswer, answer) => this.setState({
            responses: [...this.state.responses, { points: 0, answer }],
            question: {},
            feedback: 'wrong',
            mode: 'answering',
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

    get responses() {
        let responses = this.state.responses.map((response, index) => (
            <div key={index}>
                <div className='number'>{index + 1}</div>
                <div className='answer'>{decodeEntities(response.answer)}</div>
                <div className='points'>{response.points}</div>
            </div>
        ))
        return (
            <div className='responses'>
                <div className='title'>Response History</div>
                <div key='header' className='header'>
                    <div className='number'>#</div>
                    <div className='answer'>Your Answer</div>
                    <div className='points'>Points</div>
                </div>
                {responses}
            </div>
        )
    }

    get scoreboard() {
        let scoreList = [...this.state.scoreList];
        let place = 1;
        let prevPlayer = null;
        let scoreboard = scoreList.sort((a, b) => (b.score - a.score)).map((player, index) => {
            if (prevPlayer && player.score < prevPlayer.score) place++;
            let isCurrentUser = player.username === this.props.username ? 'active' : '';
            prevPlayer = player;
            let playerElement =
                <div key={index} className={`playerElement ${isCurrentUser}`}>
                    <div className='playerRank'>{place}</div>
                    <div className='playerUserName'>{player.username}</div>
                    <div className='playerScore'>{player.score}</div>
                </div>
            return playerElement;
        })

        return (
            <div className='scoreboard'>
                <div className='title'>Scores</div>
                <div key='header' className='header'>
                    <div className='playerRank'>Place</div>
                    <div className='playerUserName'>Name</div>
                    <div className='playerScore'>Score</div>
                </div>
                {scoreboard}
            </div>
        );
    }

    get content() {
        const feedback = () => {
            if (this.state.feedback === 'right') return (
                <div>
                    <div className='question'> You are Right!</div>
                </div>
            )
            else if (this.state.feedback === 'wrong') return (<div>
                <div className='question'> You are Wrong! the correct answer is "{decodeEntities(this.state.correctAnswer)}"</div>
            </div>)
            else return null;
        }
        let currentQuestion = this.state.question
        let answers = currentQuestion.answers;
        const { score } = this.state
        let content = <div>
            Invalid state {this.state.mode}
        </div>

        switch (this.state.mode) {
            case 'connecting': {
                content = <div className='category'>
                    Connecting to game {this.props.gameId}...
            </div>
            }
            case 'waiting':
                content =
                    <div>
                        <div className='category' id='waiting'>You'll be in the game for the next question, hold tight</div>
                    </div>
                break;
            case 'getready':
                content =
                    <div>
                        {feedback()}
                        <div className='category' id='waiting'>Ok, here comes the next question</div>
                    </div>
                break;
            case 'answering':
                content =
                    <div>
                        {feedback()}
                        <div className='category' id='waiting'>Waiting for all answers to come in</div>
                    </div>
                break;
            case 'question':
                content =
                    <div>
                        <div className='category'>{currentQuestion.category} - {currentQuestion.points} points </div>
                        <div className='question'>
                            <div>
                                Question #{currentQuestion.number}
                            </div>
                            <div>
                                {decodeEntities(currentQuestion.question)}
                            </div> </div>
                        <div className="answer-container">
                            {answers.map((a) => {
                                return <div className="answer-button" key={a} onClick={this.answerClick.bind(this, a)}> {decodeEntities(a)} </div>
                            })}
                        </div>
                    </div>
                break;
            case 'timeout':
                content =
                    <div >
                        Sorry, time is up.
                    </div>
                break;
        }

        return <div className='content'>
            {content}
        </div>;
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
                <div className="gameContainer">
                    {this.responses}
                    {this.scoreboard}
                    {this.content}
                </div>

            </div >
        )
    }
}

export default Game;