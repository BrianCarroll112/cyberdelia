import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ActionCable from 'action-cable-react-jwt';
import { getToken } from './services/axios'

class App extends Component {
  constructor() {
    super()

    this.state = {
      msg: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()

    // send message to websocket for chat channels based on current channel
    // get current channel id to state?
  }

  handleChange(e) {
    const { name, value } = e.target

    this.setState({
      [name]: value
    })
  }

  loginScript() {

  }

  openSockets() {
    let jwt = localStorage.getItem('jwt')
    let socket = {};
    socket.cable = ActionCable.createConsumer("ws://localhost:3000/cable", jwt)

    this.roomSubscription = socket.cable.subscriptions.create({channel: "RoomsChannel"}, {
      connected: function() { console.log("rooms: connected") },             // onConnect
      disconnected: function() { console.log("rooms: disconnected") },       // onDisconnect
      received: (data) => { console.log("room transmit received: ", data); } // OnReceive
    })
    this.messageSubscription = socket.cable.subscriptions.create({channel: "MessagesChannel"}, {
      connected: function() { console.log("messages: connected") },             // onConnect
      disconnected: function() { console.log("messages: disconnected") },       // onDisconnect
      received: (data) => { console.log("message transmit received: ", data); } // OnReceive
    })
  }

  async componentDidMount() {
    await getToken('test@test.com', 'test')
    this.openSockets();
    console.log('AFNEIONFLDKSNFAEFNKLEWAFN')
  }

  render() {
    return (
      <div className="App">
        <div className="chat-box">
          <p>Messages:</p>
        </div>
        <form onSubmit={this.handleSubmit}>
          <input  onChange={this.handleChange} value={this.state.msg} name="msg" />
          <input type="submit"/>
        </form>
      </div>
    );
  }
}

export default App;
