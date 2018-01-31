import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../style/chatroom.css';

class Messages extends Component {
  static propTypes = {
    user: PropTypes.string,
    messages: PropTypes.array,
    typingUsers: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.scrollDown = this.scrollDown.bind(this);
  }

  componentDidMount() {
    this.scrollDown();
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollDown();
  }

  scrollDown() {
    const { container } = this.refs;
    container.scrollTop = container.scrollHeight;
  }

  getTime = (date) => {
    return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
  };

  render() {
    const { user, messages, typingUsers } = this.props;

    const MessagesList = messages.map((message, i) => {
      return (
        <div key={i} className={`message-container ${message.sender === user && 'right'}`}>
          <div className="time">{this.getTime(new Date(Date.now()))}</div>
          { message.sender !== user &&
            <div className="message-name">
              {message.sender}
            </div>
          }
          <div className="message">{message.message}</div>
        </div>
      );
    });

    return (
      <div ref="container" className="thread-container">
        <div className="thread">
          {MessagesList}
          { typingUsers.length > 0 &&
            <div className="typing-user">
              { typingUsers.length > 1 ?
                `${typingUsers.join(', ')} are typing...`
              : `${typingUsers[0]} is typing...` }
            </div> }
        </div>
      </div>
    );
  }
}


export default Messages;
