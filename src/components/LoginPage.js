import React, { useState } from 'react';
import '../styles/loginpage.css'
import { redirect } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Username:', username);
    console.log('Password:', password);
    if(username != "test" && password != "test") {
        setShowError(true);
        return;
    }
    // Reset form
    setUsername('');
    setPassword('');
    sessionStorage.setItem("loggedIn", true)
    redirect('/');
    
  };

  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        {showError && <p style={{"color": "red"}}>Incorrect username and password</p> }
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;