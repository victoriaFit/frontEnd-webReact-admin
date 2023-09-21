import React, { useState } from 'react';
import UserService from '../../../services/users';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = async () => {
    if (password !== passwordConfirmation) {
      alert("As senhas não coincidem.");
      return;
    }

    const newUser = {
      email,
      password
      // Você pode adicionar outros campos aqui conforme necessário.
    };

    try {
      const data = await UserService.saveUser(newUser);
      alert("Usuário registrado com sucesso!");
      // Aqui, você pode redirecionar o usuário para a página de login ou diretamente para o dashboard.
    } catch (error) {
      alert("Erro ao registrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div>
      <h1>Registro</h1>
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
      <input 
        type="password" 
        placeholder="Confirmar Senha" 
        value={passwordConfirmation}
        onChange={e => setPasswordConfirmation(e.target.value)}
      />
      <button onClick={handleSubmit}>Registrar</button>
    </div>
  );
}

export default Register;
