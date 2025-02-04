const fs = require('fs');
const path = require('path');

const metadataFilePath = path.join(__dirname, 'fileMetadata.json');

function readMetadata() {
    if (!fs.existsSync(metadataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(metadataFilePath, 'utf8');
    return JSON.parse(data);
}

function writeMetadata(metadata) {
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
}

function addMetadata(file) {
    const metadata = readMetadata();
    metadata.push(file);
    writeMetadata(metadata);
}

function getAllFiles() {
    return readMetadata();
}

function deleteFileMetadata(fileName) {
    const metadata = readMetadata();
    const updatedMetadata = metadata.filter(file => file.name !== fileName);
    writeMetadata(updatedMetadata);
}

function updateMetadata(oldName, newName) {
    const metadata = readMetadata(); // Membaca metadata dari sumber penyimpanan
    const file = metadata.find(file => file.name === oldName); // Mencari file di metadata berdasarkan nama file lama (oldName)
    // Jika file ditemukan di metadata
    if (file) {
        file.name = newName; // Memperbarui nama file dengan nama baru (newName)
        writeMetadata(metadata); // Menyimpan kembali metadata yang telah diperbarui
    }
}

module.exports = { addMetadata, getAllFiles, deleteFileMetadata, updateMetadata };