import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.css';
import Alert from './components/Alert';

class App extends Component {
  render() {
    return (
      <section className="app">
        <header>
          <img src={logo} className="logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <Alert className="alert" />
      </section>
    );
  }
}

export default App;
