import React from 'react';
import '../App.css';
import io from "socket.io-client";
import ReactEmoji from 'react-emoji';

export default class HomeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            channel: '',
            message: '',
            messages: [],
            users: [],
            channels: []
        };

        this.socket = io('localhost:4242');

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        const addMessage = data => {
            this.setState({messages: [...this.state.messages, data]});
        };

        this.socket.on('userData', function (users) {
            addUsers(users);
        });

        const addUsers = users => {
            this.setState({users: [users]});
        };

        this.socket.on('channelData', function (channels) {
            addChannel(channels);
        });

        const addChannel = channels => {
            this.setState({channels: [channels]});
        };

        this.enterMessage = ev => {
            if (ev.key === 'Enter') {
                this.sendMessage(ev);
            }
        };

        this.sendMessage = ev => {
            ev.preventDefault();
            const message = this.state.message;

            if (message.substr(0, 5) === "/nick" && message.length > 8) {
                this.setState({
                    username: message.substr(5, 30),
                });
            } else if (message.substr(0, 5) === "/join" && message.length > 8) {
                this.socket.emit('join', {username: this.state.username, channel: message.substr(6, 30)});
                this.setState({
                    channel: message.substr(6, 30),
                });
            } else if (message.substr(0, 7) === "/create") {
                this.socket.emit('join', {username: this.state.username, channel: message.substr(8, 30)});
                this.setState({
                    channel: message.substr(8, 30),
                });
            } else if (message.substr(0, 5) === "/part") {
                this.socket.emit('disconnect');
                this.setState({
                    channel: "",
                });
            } else if (this.state.message.length > 0) {
                this.socket.emit('SEND_MESSAGE', {
                    username: this.state.username,
                    message: this.state.message
                });
            }
            this.setState({message: ''});
        };

        this.handleSubmit = ev => {
            ev.preventDefault();
            const user = ev.target.user.value;
            const channel = ev.target.channel.value;

            if (user.length >= 3 && channel.length >= 3) {
                this.setState({
                    username: ev.target.user.value,
                    channel: ev.target.channel.value,
                    dialogStyle: {display: "none"}
                });
                this.socket.emit('join', {username: ev.target.user.value, channel: ev.target.channel.value});
            }
        }
    }

    handleDisconnect() {
        document.location.reload();
    }

    render() {
        return (
            <div>
                <nav>
                    <h1>Chattyyy</h1>
                </nav>
                <div className="bg-dialog" style={this.state.dialogStyle}>
                    <form className="dialog" onSubmit={this.handleSubmit}>
                        <h1>Welcome back !</h1>
                        <input type="text" name="user" placeholder="Username"/>
                        <input type="text" name="channel" placeholder="Channel"/>
                        <button type="submit">Let me in !</button>
                    </form>
                </div>
                <div className="interface">
                    <div className="contacts">
                        <div className="profile">
                            <img src={require('../img/profile_picture.png')} alt=""/>
                            <div>
                                <h2>{this.state.username}</h2>
                                <div>
                                    {/*<button><i className="fas fa-cog"></i></button>*/}
                                    <button onClick={this.handleDisconnect}><i className="fas fa-sign-out-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="channels_list">
                            <h4>Channel list</h4>
                            {this.state.channels.map((data, index) => {
                                return (
                                    <div key={index}>
                                        {data.channels.map((channel, index) =>
                                            <div key={index} className="channel">
                                                {channel}
                                                <div>
                                                    <button><i className="fas fa-times"></i></button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {/* <div className="channels_list">
                            <div className="channel">
                                <p>{this.state.channel}</p>
                                <div>
                                    <button><i className="fas fa-cog"></i></button>
                                    <button><i className="fas fa-times"></i></button>
                                </div>
                            </div>
                            <button className="channel_create">
                                <p>Create a channel</p>
                                <i className="fas fa-plus"></i>
                            </button>
                        </div> */}
                    </div>
                    <div className="chat">
                        <h1><i className="fas fa-icons"></i>{this.state.channel}</h1>
                        <div className="chatarea">
                            <div>
                                {this.state.messages.map((message, index) => {
                                    return (
                                        <div key={index} className="message">
                                            <p className="message_username">{message.username}</p>
                                            <p className="message_content">{ReactEmoji.emojify(message.message)}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="send_message">
                            <textarea name="message" placeholder="Envoyer un message..." id="message"
                                      value={this.state.message}
                                      onChange={ev => this.setState({message: ev.target.value})}
                                      onKeyDown={this.enterMessage}></textarea>
                            <button onClick={this.sendMessage}>Send</button>
                        </div>
                    </div>
                    <div className="members_list">
                        <h4>Members</h4>
                        {this.state.users.map((data, index) => {
                            return (
                                <div key={index}>
                                    {data.users.map((user, index) =>
                                        <div key={index} className="member">
                                            <p>{user.username}</p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}