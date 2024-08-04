import React from 'react';
import './App.css';
import { Weather } from './view/Weather';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Météo</h1>
      </header>
      <main>
        <Weather />
      </main>
    </div>
  );
}

export default App;
