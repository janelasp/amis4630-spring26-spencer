import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Call .NET API when component loads
    fetch('http://localhost:5000/api/hello')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to connect to .NET API');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <div className="app">Loading...</div>;
  if (error) return <div className="app error">{error}</div>;

  return (
    <div className="app">
      <h1>🚀 Full-Stack Hello World</h1>
      <div className="card">
        <h2>Message from .NET:</h2>
        <p className="message">{message}</p>
      </div>
    </div>
  );
}

export default App;