import React, { useState, useEffect } from 'react';
import AssistanceService from '../../../services/assistances';
import EquipmentService from '../../../services/equipments';

function Assistances() {
  const [assistances, setAssistances] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [selectedAssistance, setSelectedAssistance] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const assistanceData = await AssistanceService.getAssistances();
      const equipmentData = await EquipmentService.getEquipments();
      setAssistances(assistanceData);
      setEquipments(equipmentData);
    }

    fetchData();
  }, []);

  const handleAddOrUpdateAssistance = async () => {
    if (isEditing) {
      const updatedAssistance = await AssistanceService.updateAssistance(selectedAssistance.id, selectedAssistance);
      setAssistances(assistances.map(a => a.id === updatedAssistance.id ? updatedAssistance : a));
      setIsEditing(false);
    } else {
      const newAssistance = await AssistanceService.addAssistance(selectedAssistance);
      setAssistances([...assistances, newAssistance]);
    }
    setSelectedAssistance({});
  };

  const handleDeleteAssistance = async (id) => {
    await AssistanceService.deleteAssistance(id);
    setAssistances(assistances.filter(a => a.id !== id));
  };

  const handleEditAssistance = (assistance) => {
    setSelectedAssistance(assistance);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAssistance(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const TYPE_CHOICES = [
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'repair', label: 'Conserto' }
  ];

  return (
    <div>
      <h1>Assistências</h1>

      <div>
        <select
          name="equipments"
          value={selectedAssistance.equipments || ''}
          onChange={handleInputChange}
        >
          {equipments.map(equipment => (
            <option key={equipment.id} value={equipment.id}>
              {equipment.name} - {equipment.model}
            </option>
          ))}
        </select>
        
        <select
          name="type"
          value={selectedAssistance.type || ''}
          onChange={handleInputChange}
        >
          {TYPE_CHOICES.map(choice => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
        
        <button onClick={handleAddOrUpdateAssistance}>
          {isEditing ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>

      <ul>
        {assistances.map(assistance => (
          <li key={assistance.id}>
            Tipo: {assistance.type} - Equipamento ID: {assistance.equipments}
            <button onClick={() => handleEditAssistance(assistance)}>Editar</button>
            <button onClick={() => handleDeleteAssistance(assistance.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Assistances;
