import React, { Component } from 'react';

import '../../style/chatroom.css';

class Messages extends Component {
  constructor(props) {
    super(props);

    this.scrollDown = this.scrollDown.bind(this);
  }

  scrollDown() {
    const { container } = this.refs;
    container.scrollTop = container.scrollHeight;
  }

  componentDidMount() {
    this.scrollDown();
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollDown();
  }

  render() {
    const { messages, user, typingUsers } = this.props;

    const MessagesList = messages.map((message, i) => {
      return (
        <div key={i} className={`message-container ${message.sender === user && 'right'}`}>
          <div className="message-data">
            <div className="time">{message.time}</div>
            { message.sender !== user ?
              <div className="name">{message.sender}</div>
              : null
            }
          </div>
          <div className="message">{message.message}</div>
        </div>
      );
    });

    return (
      <div ref="container" className="thread-container">
        <div className="thread">
          {MessagesList}
            {typingUsers.map(name => {
            return (
              <div key={name} className="typing-user">
                {`${name} is typing...`}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}


export default Messages
