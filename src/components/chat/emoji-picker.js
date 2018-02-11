import React, { Component } from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { FaSmileO } from 'react-icons/lib/fa';
import '../../style/emoji-picker.css';

class EmojiPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      emoji: { id: 'santa', skin: 3 }
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  toggle = () => {
    const { dropdownOpen } = this.state;
    this.setState({
      dropdownOpen: !dropdownOpen
    });
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleClickOutside = (e) => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.toggle()
    }
  };

  handleClick = () => {
    const { onLeaveChat } = this.props;
    onLeaveChat();
  };


  render() {
    const { dropdownOpen } = this.state;
    const { onClick } = this.props;

    return (
      <div className="emoji-picker">
        {dropdownOpen && (
          <div ref={this.setWrapperRef} className="emoji-list">
            <Picker
              set="emojione"
              emojiSize={26}
              emojiTooltip={true}
              onClick={onClick}
              exclude={['flags', 'symbols']}
              perLine={8}
              sheetSize={32}
              showPreview={false}
            />
          </div>
        )}
        <i onClick={this.toggle} className="emoji-icon"><FaSmileO /></i>
      </div>
    )
  }
}

export default EmojiPicker;
