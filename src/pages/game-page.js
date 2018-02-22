import React, {
  Component
} from "react"
import "../App.css"
import io from "socket.io-client";

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

const waitingImg = {
  "Celebrities": "./images/hollywood.jpg"
}


class TriviaQuestions extends Component {
  constructor(props) {
    super(props);
    this.username = props.username;

    this.state = {
      question: {},
      answerStatus: '',
      correctAnswer: '',
      score: 0,
      timeout: false,
      playerList: []
    };

    this.socket = io('/trivia');
    this.socket.on('connect', () => {
      this.socket.emit('signin', this.username); //sends a "sign in" event to the server
      this.socket.on('question', this.newQuestion.bind(this));
      this.socket.on('timeout', this.onTimeout.bind(this));
      this.socket.on('right', this.rightAnswer.bind(this));
      this.socket.on('wrong', this.wrongAnswer.bind(this));
      this.socket.on('player-list', this.playerList.bind(this));
    })
  }

  componentWillMount() {

  }

  playerList(players) {
    this.setState({
      playerList: players
    })
  }

  newQuestion(question) {
    this.setState({
      question: question,
      answerStatus: '',
      correctAnswer: '',
      timeout: false,
    })
  }

  onTimeout() {
    this.setState({
      question: {},
      answerStatus: '',
      correctAnswer: '',
      timeout: true
    });
  }

  rightAnswer(score) {
    this.setState({
      question: {},
      answerStatus: 'right',
      score: score,
      correctAnswer: '',
      timeout: false
    })
  }

  wrongAnswer(correctAnswer) {
    this.setState({
      question: {},
      answerStatus: 'wrong',
      correctAnswer: correctAnswer,
      timeout: false
    })
  }

  answerClick(answer) {
    this.socket.emit('answer', answer);
  }

  renderPlayerList() {
    let playerList = this.state.playerList.map(player => {
      let playerElement =
        <div className='playerElement'>
          <div className='playerUserName'>{player.username}</div>
          <div className='playerScore'>{player.score}</div>
        </div>
      return playerElement;
    })
    return playerList;
  }

  render() {
    let currentQuestion = this.state.question
    let categoryImage = categoryImages[currentQuestion.category]

    let answers = currentQuestion.answers;
    const { score } = this.state
    let questionBlock = 
    <div>
      <div id="waiting"> Waiting for question </div>
    </div>


      if (this.state.question.question && this.state.question.answers) {
        questionBlock =
          <div>
            <div className = 'scoreBoard'>{this.renderPlayerList()}</div>
              <h3 className= 'score'> Score: {score} </h3>
              <p className = 'category'>{currentQuestion.category} </p>
              <p className = 'question'> {decodeEntities(currentQuestion.question)} </p>
            <div className="answer-container">
              {answers.map((a) => {
              return <div className="answer-button" key = {a} onClick = {this.answerClick.bind(this, a)}> {decodeEntities(a)} </div>
            })}
          </div>
      </div>

    } else if (this.state.answerStatus === 'right') {
      questionBlock =
        <div>
          <div className = 'scoreBoard'>{this.renderPlayerList()}</div>
              <h3 className= 'score'> Score: {score} </h3>
              <p className = 'category'>{currentQuestion.category} </p>
              <p className = 'question'> You are Right!</p>
        </div>
    } else
      if (this.state.answerStatus === 'wrong') {
        questionBlock =
          <div>
            <div className = 'scoreBoard'>{this.renderPlayerList()}</div>
              <h3 className= 'score'> Score: {score} </h3>
              <p className = 'category'>{currentQuestion.category} </p>
              <p className = 'question'> You are Wrong! the correct answer is "{this.state.correctAnswer}"</p>
          </div>
      } else if (this.state.timeout) {
        questionBlock =
          <div >
            <p> Sorry, time is up.</p>
          </div>
      }
    return (
      <div>
        <img id="background" src={categoryImage} alt="category" />
        <h1 className="welcome"> Welcome to Trivia!</h1> {questionBlock} 
      </div>
    )
  }
}

export default TriviaQuestions

function decodeEntities(encodedString) {


  var textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;

}
