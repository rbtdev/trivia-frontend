import React, { Component } from 'react';
import io from "socket.io-client";
import './chat.css';
import moment from 'moment';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.addMessage = this.addMessage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.showTyping = this.showTyping.bind(this);

        this.state = {
            messages: [],
            users: {},
            input: '',
            isTyping: ''
        }
        this.socket = io('/chat');
        this.socket.on('connect', () => {
            this.socket.emit('signin', this.props.username);
            this.socket.on('new-message', this.addMessage);
            this.socket.on('typing', this.showTyping);
            this.socket.on('userlist', this.updateUsers);
        })
    }

    updateUsers = (userList) => {
        this.setState({ users: userList })
    }

    userList = (users) => {
        let _this = this;
        let userElements = [];
        Object.keys(this.state.users).forEach(userId => {
            let user = _this.state.users[userId];
            let isTyping = user.isTyping ? 'active':'';
            userElements.push(
                <div>
                    <span className='chat-userlist-username' key={user.userId}>{user.username}</span>
                    <span className={'chat-typing-indicator ' + isTyping}></span>
                </div>
            )
        })
        return (userElements);
    }

    showTyping = (user) => {
        let users = this.state.users;
        users[user.userId].isTyping = true;
        this.setState({ users: users, isTyping: 'active' })
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(this.stopTyping.bind(this, user), 2000)
        console.log("typing...");
    }

    stopTyping = (user) => {
        let users = this.state.users;
        users[user.userId].isTyping = false;
        this.setState({ users: users, isTyping: '' })
    }

    addMessage = (message) => {
        clearTimeout(this.typingTimer);
        this.stopTyping(this.state.users[message.userId])
        let owner = '';
        if (message.owner === this.socket.id) {
            owner = 'owner'
        }
        let messageElement =
            <div>
                <div className={'chat-message ' + owner} key={message.id}>
                    <div className='chat-message-username'>{message.username}</div>
                    <div className='chat-message-text' dangerouslySetInnerHTML = {linkify(message.text)}></div>
                    <div className='chat-message-timeStamp'>{moment(message.timeStamp).format('LLL')}</div>
                </div>
                <div className='chat-clear'></div>
            </div>

        var messages = this.state.messages;
        messages.push(messageElement);
        this.setState({ messages: messages });
        function linkify(text){
          return({
            __html:text.replace(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gi, "<a href = '$&' target='_blank'>$&</a>")
        })
      }
    }

    onKeyPress = (e) => {
        if (e.charCode === 13) {
            this.sendMessage(e);
        }
    }

    onChange = (e) => {
        this.setState({ input: e.target.value })
        this.socket.emit('typing');
    }

    sendMessage = (e) => {
        let messageText = this.state.input.trim();
        if (messageText) {
            let message = {
                username: this.props.username,
                owner: this.socket.id,
                text: messageText
            }
            console.log("Sending " + JSON.stringify(message))
            this.socket.emit('send', message);
            this.setState({ input: '' });
        }
    }

    scrollToBottom() {
        const scrollHeight = this.messageList.scrollHeight;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }
    render() {
        return (
            <div className='chat'>
                <div className='chat-content'>
                    <div className='chat-userlist'>
                        <div className='chat-userlist-title'>Active Users</div>
                        {this.userList()}
                    </div>
                    <div ref={(div) => {
                        this.messageList = div;
                    }} className='chat-messages'>
                        <div>
                            {this.state.messages}
                        </div>
                        <div className={'chat-typing-indicator ' + this.state.isTyping}>
                        </div>
                    </div>

                </div>
                <div className='chat-input'>
                    <input className='chat-input-text' onKeyPress={this.onKeyPress} onChange={this.onChange} value={this.state.input} />
                    <button className='chat-input-send' onClick={this.sendMessage}>Send</button>
                    <div className='chat-clear'></div>
                </div>
            </div>
        )
    }
}

export default Chat;
