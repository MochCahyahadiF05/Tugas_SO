const http = require('http');
const fs = require('fs');
const path = require('path');
const { addMetadata, getAllFiles, deleteFileMetadata,updateMetadata } = require('./fileStore');

const uploadDir = path.join(__dirname, 'uploads');

// Pastikan folder "uploads" ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        const htmlPath = path.join(__dirname, 'index.html');
        fs.readFile(htmlPath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading index.html');
                return;
            }
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url === '/style.css') {
        const cssPath = path.join(__dirname, 'style.css');
        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading style.css');
                return;
            }
            res.setHeader('Content-Type', 'text/css');
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/upload') {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            const fileBuffer = Buffer.concat(body);
            const fileName = 'file_' + Date.now();
            const filePath = path.join(uploadDir, fileName);

            fs.writeFile(filePath, fileBuffer, err => {
                if (err) {
                    res.statusCode = 500;
                    res.end('Failed to upload file');
                    return;
                }

                const metadata = {
                    name: fileName,
                    size: fileBuffer.length,
                    uploadTime: new Date().toISOString()
                };
                addMetadata(metadata);

                res.statusCode = 200;
                res.end('File uploaded successfully');
            });
        });
    } else if (req.method === 'GET' && req.url === '/files') {
        const files = getAllFiles();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(files));
    } else if (req.method === 'POST' && req.url.startsWith('/delete/')) {
        const fileName = req.url.split('/').pop();
        const filePath = path.join(uploadDir, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            deleteFileMetadata(fileName);
            res.statusCode = 200;
            res.end('File deleted successfully');
        } else {
            res.statusCode = 404;
            res.end('File not found');
        }
    } else if (req.method === 'POST' && req.url === '/rename') { // Mengecek apakah request adalah POST dengan URL '/rename'
        let body = [];
        req.on('data', chunk => body.push(chunk)); // Mengumpulkan data body dari request
        req.on('end', () => {
            // Menggabungkan data body dan parsing ke dalam bentuk JSON
            const parsedBody = JSON.parse(Buffer.concat(body).toString());
            const oldName = parsedBody.oldName; // Nama file lama yang akan diubah
            const newName = parsedBody.newName; // Nama file baru yang diinginkan

            // Validasi apakah 'oldName' dan 'newName' disediakan
            if (!oldName || !newName) {
                res.statusCode = 400; // Bad Request
                res.end('Both oldName and newName must be provided');
                return;
            }

            // Membuat path file lama dan file baru berdasarkan nama file
            const oldPath = path.join(uploadDir, oldName);
            const newPath = path.join(uploadDir, newName);

            // Mengecek apakah file lama ada di direktori
            if (!fs.existsSync(oldPath)) {
                res.statusCode = 404;
                res.end('File not found');
                return;
            }

            // Melakukan proses rename file
            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    res.statusCode = 500; // Server Error
                    res.end('Failed to rename file');
                    return;
                }

                // Memperbarui metadata setelah file di-rename
                updateMetadata(oldName, newName);
                res.statusCode = 200; //Ok
                res.end('File renamed successfully');
            });
        });

    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});