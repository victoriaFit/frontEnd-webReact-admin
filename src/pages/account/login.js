import React, { useState } from 'react';
import { useRouter } from 'next/router';

import UserService from '../../../services/users';

function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const data = await UserService.login(email, password);
    if (data.access) {
      router.push('/dashboard');
    } else {
      alert("Credenciais inválidas ou problema na conexão.");
    }
  };  

  return (
    <div>
      <h1>Login</h1>
      <input 
        placeholder="Email" 
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Senha" 
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Entrar</button>
    </div>
  );
}

export default Login;
