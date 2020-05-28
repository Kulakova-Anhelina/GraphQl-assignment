import React from 'react';
import './App.css';
import Statistics from "./components/Statistics"

function App() {
 
  return ( // When there is data
    <div className="container">
    <h1 className="App-header">Number of projects by company</h1>
    <Statistics/>
    </div>
  );
}

export default App;