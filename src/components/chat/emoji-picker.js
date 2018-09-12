import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { FaSmileO } from 'react-icons/lib/fa';
import '../../style/emoji-picker.css';

class EmojiPicker extends Component {
  constructor(props) {
    super(props);
    this.state = { dropdownOpen: false };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  toggle = () => {
    const { dropdownOpen } = this.state;

    this.setState({ dropdownOpen: !dropdownOpen });
  };

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleClickOutside = (e) => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.toggle();
    }
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
              emojiTooltip
              onClick={onClick}
              exclude={['flags', 'symbols']}
              perLine={8}
              sheetSize={32}
              showPreview={false}
            />
          </div>
        )}
        <button type="button" onClick={this.toggle}>
          <i className="emoji-icon"><FaSmileO /></i>
        </button>
      </div>
    );
  }
}

EmojiPicker.propTypes = { onClick: PropTypes.func.isRequired };

export default EmojiPicker;
