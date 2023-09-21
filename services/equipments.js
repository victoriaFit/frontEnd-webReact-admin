import api from '../plugins/axios';

class EquipmentService {
  async getEquipments() {
    const response = await api.get('/equipments/');
    return response.data;
  }

  async addEquipment(equipment) {
    const response = await api.post('/equipments/', equipment);
    return response.data;
  }

  async deleteEquipment(id) {
    await api.delete(`/equipments/${id}/`);
  }

  async updateEquipment(id, updatedEquipment) {
    const response = await api.put(`/equipments/${id}/`, updatedEquipment);
    return response.data;
  }
}

export default new EquipmentService();
