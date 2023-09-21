import api from '../plugins/axios';

class ItemService {
  async getItems() {
    const response = await api.get('/items/');
    return response.data;
  }

  async addItem(item) {
    const response = await api.post('/items/', item);
    return response.data;
  }

  async deleteItem(id) {
    await api.delete(`/items/${id}/`);
  }

  async updateItem(id, updatedItem) {
    const response = await api.put(`/items/${id}/`, updatedItem);
    return response.data;
  }
}

export default new ItemService();
