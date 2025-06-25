import ChatInterface from './components/ChatInterface';
import ClalitLogo from './assets/logos/white_logo.png';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>עומר העוזר החדש לאיתור שירותים</h1>
          <img src={ClalitLogo} alt="כללית" className="logo" />
        </div>
      </header>
      <main className="app-main">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;