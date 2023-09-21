import api from '../plugins/axios';

class UserService {
  async getAllUsers() {
    const response = await api.get('/users/');
    return response.data;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const numericUserId = parseInt(userId, 10);
    const response = await api.patch(`/users/${numericUserId}/change_password/`, {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  }


  async saveUser(user) {
    const response = await api.post('/users/', user);
    return response.data;
  }

  async deleteUser(user) {
    const response = await api.delete(`/users/${user.id}/`);
    return response.data;
  }

  async login(email, password) {
    const response = await api.post('/api/login/', { email, password });
    console.log(response.data);
    if (response.data && response.data?.user && response.data?.user?.id) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('userId', String(response.data.user.id));
    }
    return response.data;
  }

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
  }

  async getUserInfo() {
    const accessToken = localStorage.getItem('accessToken');
    const response = await api.get('/users/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  }

  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    console.log('User data:', response.data);
    return response.data;
  }

  async updateUserImage(userId, imageResponse) {
    const data = new FormData();
    const fileName = imageResponse.fileName || 'uploaded_image.jpg';
    const imageUri = imageResponse.uri;

    if (!imageUri) {
      throw new Error('No image URI provided.');
    }

    data.append('file', {
      name: fileName,
      type: imageResponse.type || 'image/jpeg',
      uri: imageUri,
    });

    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await api.patch(`/users/${userId}/`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Axios error:", error);
      throw error;
    }
  }
}

export default new UserService();
