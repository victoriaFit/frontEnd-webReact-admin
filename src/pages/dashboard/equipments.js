import React, { useState, useEffect } from 'react';
import EquipmentService from '../../../services/equipments';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import './Equipments.css';

function Equipments() {
    const [equipments, setEquipments] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const data = await EquipmentService.getEquipments();
            setEquipments(data);
            setIsLoading(false);
        }

        fetchData();
    }, []);

    const handleAddOrUpdateEquipment = async () => {
      try {
          if (isEditing) {
              const updatedEquipment = await EquipmentService.updateEquipment(selectedEquipment.id, selectedEquipment);
              setEquipments(equipments.map(e => e.id === updatedEquipment.id ? updatedEquipment : e));
              setIsEditing(false);
          } else {
              const newEquipment = await EquipmentService.addEquipment(selectedEquipment);
              setEquipments([...equipments, newEquipment]);
          }
          setSelectedEquipment({});
          setShowModal(false);
      } catch (error) {
          console.error("Erro ao atualizar ou adicionar equipamento:", error.response ? error.response.data : error.message);
          alert('Erro ao atualizar ou adicionar equipamento. Veja o console para mais detalhes.');
      }
  };
  

    const handleDeleteEquipment = async (id) => {
        try {
            await EquipmentService.deleteEquipment(id);
            setEquipments(equipments.filter(e => e.id !== id));
        } catch (error) {
            alert('Erro ao deletar equipamento.');
        }
    };
  
    const handleEditEquipment = (equipment) => {
        setSelectedEquipment(equipment);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedEquipment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setSelectedEquipment({});
    };

    const openModal = () => {
        setShowModal(true);
    };

    const filteredEquipments = equipments.filter(equipment => 
        equipment.name.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedEquipments = filteredEquipments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const equipmentCounts = equipments.reduce((acc, equipment) => {
        acc[equipment.brand] = (acc[equipment.brand] || 0) + 1;
        return acc;
    }, {});

    const data = Object.keys(equipmentCounts)
    .filter(brand => brand) // remove entradas indefinidas
    .map(brand => ({
        name: brand,
        value: equipmentCounts[brand]
    }));

    const uniqueBrands = [...new Set(equipments.map(equipment => equipment.brand))];

    return (
      <div className="equipmentDashboard">
          <h1>Dashboard de Equipamentos</h1>

          {isLoading ? <div>Carregando...</div> : (
              <>
                  <button className="button add" onClick={openModal}>
                      <img src="https://cdn.discordapp.com/attachments/1091506792900595863/1154298014580617256/add-new.png" alt="Add New" />
                      Adicionar Equipamento
                  </button>
                  <div>
                      <input 
                          className="inputField"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Pesquisar equipamento..."
                      />
                  </div>

                  <h2>Listagem de Equipamentos</h2>
                  <ul className="listing">
                      {paginatedEquipments.map(equipment => (
                          <li className="listItem" key={equipment.id}>
                              {equipment.name} - {equipment.model} - {equipment.brand}
                              <button className="button edit" onClick={() => handleEditEquipment(equipment)}>
                                  <img src="https://cdn.discordapp.com/attachments/1091506792900595863/1154298098043060225/edit.png" alt="Edit" />
                              </button>
                              <button className="button delete" onClick={() => handleDeleteEquipment(equipment.id)}>
                                  <img src="https://cdn.discordapp.com/attachments/1091506792900595863/1154297902827577354/trash.png" alt="Delete" />
                              </button>
                          </li>
                      ))}
                  </ul>

                  <div>
                      <button className="button" onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Anterior</button>
                      <button className="button" onClick={() => setPage(prev => prev + 1)} disabled={paginatedEquipments.length < ITEMS_PER_PAGE}>Próximo</button>
                  </div>

                  {showModal && (
    <div className="modal">
        <div className="modalContent">
            <h2 className="modalTitle">Editar Equipamento</h2>
            <p className="modalDescription">Atualize as informações do equipamento abaixo:</p>
            
            <input 
                className="inputField"
                name="name"
                value={selectedEquipment.name || ''}
                onChange={handleInputChange}
                placeholder="Nome"
            />
            <input 
                className="inputField"
                name="model"
                value={selectedEquipment.model || ''}
                onChange={handleInputChange}
                placeholder="Modelo"
            />
            <select 
                className="selectField"
                name="brand"
                value={selectedEquipment.brand || ''}
                onChange={handleInputChange}
            >
                <option value="">Selecione uma marca</option>
                {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>
            
            <button className="modalButton apply" onClick={handleAddOrUpdateEquipment}>
                {isEditing ? 'Atualizar' : 'Adicionar'}
            </button>
            <button className="modalButton cancel" onClick={closeModal}>
                Cancelar
            </button>
        </div>
    </div>
)}
              </>
          )}
      </div>
  );
}

export default Equipments;
