import api from '../plugins/axios';

class AssistanceService {
  async getAssistances() {
    const response = await api.get('/assistances/');
    return response.data;
  }

  async addAssistance(assistance) {
    const response = await api.post('/assistances/', assistance);
    return response.data;
  }

  async deleteAssistance(id) {
    await api.delete(`/assistances/${id}/`);
  }

  async updateAssistance(id, updatedAssistance) {
    const response = await api.put(`/assistances/${id}/`, updatedAssistance);
    return response.data;
  }
}

export default new AssistanceService();
