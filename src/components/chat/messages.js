import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from 'emoji-mart';
import '../../style/messages.css';

class Messages extends Component {
  constructor(props) {
    super(props);
    this.scrollDown = this.scrollDown.bind(this);
  }

  componentDidMount() {
    this.scrollDown();
  }

  componentDidUpdate() {
    this.scrollDown();
  }

  scrollDown() {
    const { container } = this.refs;
    container.scrollTop = container.scrollHeight;
  }

  getTime = date => `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;

  render() {
    const {
      user,
      users,
      messages,
      typingUsers
    } = this.props;

    const MessagesList = messages.map((message, i) => {
      const userAvatar = users.find(u => u.name === message.sender).avatar;
      const itemStyle = { backgroundImage: `url(${userAvatar})` };
      const regex = /:[^:]+:/g;
      let messageWithEmojis;

      if (message.message.match(regex)) {
        const emojiNames = message.message.match(regex).map(emoji => emoji.replace(/:/g, ''));
        const messageString = message.message.replace(regex, ' ');
        const emojis = emojiNames.map(em => (
          <span
            className="emoji-message"
            key={message.id}
            dangerouslySetInnerHTML={{
              __html: messageString + Emoji({
                html: true,
                set: 'emojione',
                emoji: em,
                size: 20
              })
            }}
          />
        ));
        messageWithEmojis = emojis.length > 1 ? emojis.reduce((prev, curr) => [prev, ' ', curr]) : emojis[0];
      }

      return (
        <div key={i} className={`message-container ${message.sender === user && 'right'}`}>
          <div className="user-avatar" style={itemStyle} />
          <div className="message-data">
            <div className="time">{this.getTime(new Date(Date.now()))}</div>
            { message.sender !== user && (
              <div className="message-name">
                {message.sender}
              </div>)
            }
            <div className="message">{messageWithEmojis || message.message}</div>
          </div>
        </div>
      );
    });

    return (
      <div ref="container" className="thread-container">
        <div className="thread">
          {MessagesList}
          { typingUsers.length > 0 && (
            <div className="typing-user">
              { typingUsers.length > 1
                ? `${typingUsers.map(u => u.name).join(', ')} are typing...`
                : `${typingUsers[0].name} is typing...` }
            </div>)}
        </div>
      </div>
    );
  }
}

Messages.propTypes = {
  user: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.any).isRequired,
  messages: PropTypes.arrayOf(PropTypes.any).isRequired,
  typingUsers: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default Messages;
