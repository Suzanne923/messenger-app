import React from 'react';
import '../style/footer.css';
import { FaGithub } from 'react-icons/lib/fa';

const Footer = () => (
  <footer>
    <span>® 2018 Suzanne Corporaal</span>
    <a href="https://github.com/Suzanne923/messenger-app">
      <FaGithub />
    </a>
  </footer>
);

export default Footer;
