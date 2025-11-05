import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AISummary from './components/AISummary';
import Signup from './pages/Authpage/Signup';
import Login from './pages/Authpage/Login';
import SummeriseArticle from './components/SummeriseArticle';
import Header from './ui/Header';
import HomePage from './pages/Homepage/Home';
import { AuthProvider } from './context/AuthContext';
import MySummary from './pages/dashboard/MySummeries';
import Dashboard from './pages/dashboard/Dashboard';
import { useEffect } from 'react';

function App() {
  useEffect(()=>{
    document.title = "AI Summariser" ;
  },[]) ;
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/summary" element={<AISummary/>} />
        <Route path='/summaries' element={<Dashboard/>} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
