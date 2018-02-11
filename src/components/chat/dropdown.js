import React, { Component } from 'react';
import { FaCog } from 'react-icons/lib/fa';
import '../../style/dropdown.css';

class SettingsDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };
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
    this.props.onLeaveChat();
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
            <li onClick={this.handleLeaveChat}>Leave Chat</li>
          </ul>
        )}
        <i onClick={this.toggle}><FaCog /></i>
      </div>
    );
  }
}

export default SettingsDropdown;
