import React from 'react';
import logo from './logo.svg';
import './App.css';
import Alert from './components/Alert';

export default function App() {
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
