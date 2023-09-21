import React, { useState, useEffect } from 'react';
import EquipmentService from '../../../services/equipments';

function Equipments() {
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await EquipmentService.getEquipments();
      setEquipments(data);
    }

    fetchData();
  }, []);

  const handleAddOrUpdateEquipment = async () => {
    if (isEditing) {
      const updatedEquipment = await EquipmentService.updateEquipment(selectedEquipment.id, selectedEquipment);
      setEquipments(equipments.map(e => e.id === updatedEquipment.id ? updatedEquipment : e));
      setIsEditing(false);
    } else {
      const newEquipment = await EquipmentService.addEquipment(selectedEquipment);
      setEquipments([...equipments, newEquipment]);
    }
    setSelectedEquipment({});
  };

  const handleDeleteEquipment = async (id) => {
    await EquipmentService.deleteEquipment(id);
    setEquipments(equipments.filter(e => e.id !== id));
  };

  const handleEditEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEquipment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>Equipamentos</h1>

      <div>
        <input 
          name="name"
          value={selectedEquipment.name || ''}
          onChange={handleInputChange}
          placeholder="Nome"
        />
        <input 
          name="model"
          value={selectedEquipment.model || ''}
          onChange={handleInputChange}
          placeholder="Modelo"
        />
        <button onClick={handleAddOrUpdateEquipment}>
          {isEditing ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>

      <ul>
        {equipments.map(equipment => (
          <li key={equipment.id}>
            {equipment.name} - {equipment.model} - {equipment.location}
            <button onClick={() => handleEditEquipment(equipment)}>Editar</button>
            <button onClick={() => handleDeleteEquipment(equipment.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Equipments;
