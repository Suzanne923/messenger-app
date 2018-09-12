import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createMessage } from '../../factories';
import EmojiPicker from './emoji-picker';
import '../../style/message-input.css';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isTyping: false
    };
  }

  componentWillUnmount() {
    this.stopCheckingTyping();
  }

  addEmoji = (emoji) => {
    const { message } = this.state;

    this.setState({ message: message.concat(emoji.colons) });
  }

  sendMessage = () => {
    const { user, sendMessage } = this.props;
    const { message } = this.state;
    const newMessage = createMessage({ message, sender: user });

    sendMessage(newMessage);
  };

  sendTyping = () => {
    const { sendTyping } = this.props;
    const { isTyping } = this.state;

    if (!isTyping) {
      this.setState({ isTyping: true });
      sendTyping(true);
      this.startCheckingTyping();
    }
  };

  startCheckingTyping = () => {
    const { message } = this.state;

    this.typingInterval = setInterval(() => {
      if (message === '') {
        this.setState({ isTyping: false });
        this.stopCheckingTyping();
      }
    }, 300);
  };

  stopCheckingTyping = () => {
    const { sendTyping } = this.props;

    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      sendTyping(false);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.sendMessage();
    this.setState({ message: '' });
  };

  render() {
    const { message } = this.state;

    return (
      <div className="message-input">
        <form
          onSubmit={this.handleSubmit}
          className="input-group"
        >
          <input
            ref="messageinput"
            type="text"
            className="form-control chat-input"
            value={message}
            autoComplete="off"
            placeholder="Type a message"
            onChange={({ target }) => {
              this.setState({ message: target.value });
              this.sendTyping();
            }}
          />
          <EmojiPicker onClick={this.addEmoji} />
          <button disabled={message.length < 1} type="submit" className="send btn btn-success">Send</button>
        </form>
      </div>
    );
  }
}

MessageInput.propTypes = {
  user: PropTypes.string.isRequired,
  sendMessage: PropTypes.func.isRequired,
  sendTyping: PropTypes.func.isRequired
};

export default MessageInput;
