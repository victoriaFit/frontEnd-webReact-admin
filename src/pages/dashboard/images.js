import React, { useState } from 'react';
import ImageService from '../../../services/images';

const ManageEquipmentImage = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await ImageService.uploadImage(file, description);
            setMessage('Image uploaded successfully!');
        } catch (error) {
            console.error("Error uploading image:", error);
            setMessage('Error uploading image. Check the console for more details.');
        }
    };

    return (
        <div>
            <h2>Manage Equipment Image</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <input
                    type="text"
                    placeholder="Descrição da imagem"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ManageEquipmentImage;
