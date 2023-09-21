import React, { useState, useEffect } from 'react';
import EquipmentService from '../../../services/equipments';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import './Equipments.css';

function Equipments() {
    const [equipments, setEquipments] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
        try {
            await EquipmentService.deleteEquipment(id);
            setEquipments(equipments.filter(e => e.id !== id));
        } catch (error) {
            if (error.message && error.message.includes('ProtectedError')) {
                alert('Erro ao deletar equipamento: O equipamento está sendo referenciado por outra tabela (por exemplo, Assistance) e não pode ser deletado.');
            } else {
                alert('Erro ao deletar equipamento.');
            }
        }
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
                        <select 
                            name="brand"
                            value={selectedEquipment.brand || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione uma marca</option>
                            {uniqueBrands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                        <button onClick={handleAddOrUpdateEquipment}>
                            {isEditing ? 'Atualizar' : 'Adicionar'}
                        </button>
                    </div>

                    <div>
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Pesquisar equipamento..."
                        />
                    </div>

                    <ul>
                        {paginatedEquipments.map(equipment => (
                            <li key={equipment.id}>
                                {equipment.name} - {equipment.model} - {equipment.brand}
                                <button onClick={() => handleEditEquipment(equipment)}>Editar</button>
                                <button onClick={() => handleDeleteEquipment(equipment.id)}>Deletar</button>
                            </li>
                        ))}
                    </ul>

                    <div>
                        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Anterior</button>
                        <button onClick={() => setPage(prev => prev + 1)} disabled={paginatedEquipments.length < ITEMS_PER_PAGE}>Próximo</button>
                    </div>

                    <div>
                        <h2>Distribuição de Equipamentos por Marca</h2>
                        <PieChart width={400} height={400}>
                            <Pie dataKey="value" isAnimationActive={false} data={data} outerRadius={80} fill="#8884d8" label>
                                {
                                    data.map((entry, index) => <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]}/>)
                                }
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </>
            )}
        </div>
    );
}

export default Equipments;
