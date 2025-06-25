import ChatInterface from './components/ChatInterface';
import ClalitLogo from './assets/logos/Clalit_logo_2.png';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img src={ClalitLogo} alt="כללית" className="logo" />
          <h1>צ'אט מידע על שירותי כללית</h1>
        </div>
      </header>
      <main className="app-main">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;