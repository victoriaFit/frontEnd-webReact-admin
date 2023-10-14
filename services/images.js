import api from '../plugins/axios';

class ImageService {
    async uploadImage(file, description) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description); 
        const response = await api.post('/api/media/images/', formData);
        return response.data;
    }
    

    async deleteImage(attachmentKey) {
        await api.delete(`/api/media/images/${attachmentKey}/`);
    }
    
    async getImages() {
        const response = await api.get('/api/media/images');
        return response.data;
    }
    
}

export default new ImageService();
