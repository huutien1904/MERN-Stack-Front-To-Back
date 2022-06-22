import './App.css';
import React,{Fragment} from 'react'
import Navbar from './components/Navbar';
import Landing from './components/Landing';

function App() {
  return (
    <Fragment>
      <Navbar></Navbar>
      <Landing></Landing>
    </Fragment>
    
  );
}

export default App;
