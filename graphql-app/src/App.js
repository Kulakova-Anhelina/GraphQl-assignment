import React from 'react';
import './App.css';
import Statistics from "./components/Statistics"

function App() {
 
  return ( // When there is data
    <div className="App">
    <h1 className="container">Projects count by company</h1>
    <Statistics/>
    </div>
  );
}

export default App;