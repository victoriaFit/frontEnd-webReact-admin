import React, { useState, useEffect } from 'react';
import ItemService from '../../../services/items';

function Items() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await ItemService.getItems();
      setItems(data);
    }

    fetchData();
  }, []);

  const handleAddOrUpdateItem = async () => {
    if (isEditing) {
      const updatedItem = await ItemService.updateItem(selectedItem.id, selectedItem);
      setItems(items.map(i => i.id === updatedItem.id ? updatedItem : i));
      setIsEditing(false);
    } else {
      const newItem = await ItemService.addItem(selectedItem);
      setItems([...items, newItem]);
    }
    setSelectedItem({});
  };

  const handleDeleteItem = async (id) => {
    await ItemService.deleteItem(id);
    setItems(items.filter(i => i.id !== id));
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>Itens</h1>

      <div>
        <input 
          name="name"
          value={selectedItem.name || ''}
          onChange={handleInputChange}
          placeholder="Nome"
        />
        <input 
          name="description"
          value={selectedItem.description || ''}
          onChange={handleInputChange}
          placeholder="Descrição"
        />
        <input 
          name="price"
          value={selectedItem.price || ''}
          onChange={handleInputChange}
          placeholder="Preço"
        />
        <input 
          name="quantity_in_stock"
          value={selectedItem.quantity_in_stock || ''}
          onChange={handleInputChange}
          placeholder="Quantidade em Estoque"
        />
        <input 
          name="category"
          value={selectedItem.category || ''}
          onChange={handleInputChange}
          placeholder="Categoria"
        />
        {/* Para a imagem, você pode usar um campo de input tipo "file" ou outro método conforme sua implementação */}
        <button onClick={handleAddOrUpdateItem}>
          {isEditing ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            Nome: {item.name} - Descrição: {item.description} - Preço: {item.price} - Quantidade em Estoque: {item.quantity_in_stock} - Categoria: {item.category}
            <button onClick={() => handleEditItem(item)}>Editar</button>
            <button onClick={() => handleDeleteItem(item.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Items;
