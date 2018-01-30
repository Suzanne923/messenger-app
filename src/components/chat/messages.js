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

  render() {
    const { user, messages, typingUsers } = this.props;

    const MessagesList = messages.map((message, i) => {
      return (
        <div key={i} className={`message-container ${message.sender === user && 'right'}`}>
          <div className="message-data">
            <div className="time">{message.time}</div>
            { message.sender !== user && <div className="message-name">{message.sender}</div> }
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


export default Messages;
