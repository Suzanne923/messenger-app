import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaCog } from 'react-icons/lib/fa';
import '../../style/dropdown.css';

class SettingsDropdown extends Component {
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

  handleLeaveChat = () => {
    const { onLeaveChat } = this.props;

    onLeaveChat();
    this.toggle();
  };

  render() {
    const { dropdownOpen } = this.state;

    return (
      <div className="settings-dropdown">
        {dropdownOpen && (
          <ul ref={this.setWrapperRef} className="dropdown-list">
            <li>
              <button type="button" onClick={this.handleLeaveChat}>Leave Chat</button>
            </li>
          </ul>
        )}
        <button className="icon-btn" type="button" onClick={this.toggle}>
          <i><FaCog /></i>
        </button>
      </div>
    );
  }
}

SettingsDropdown.propTypes = { onLeaveChat: PropTypes.func.isRequired };

export default SettingsDropdown;
