import React from 'react';

function Dashboard() {
  return (
    <div>
      <h1>Painel de Controle</h1>
      <ul>
        <li><a href="dashboard/equipments">Equipamentos</a></li>
        <li><a href="dashboard/items">Itens</a></li>
        <li><a href="dashboard/assistances">Assistências</a></li>
        <li><a href="dashboard/users">Usuários</a></li>
      </ul>
    </div>
  );
}

export default Dashboard;
