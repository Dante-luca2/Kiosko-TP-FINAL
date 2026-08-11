const multer = require('multer');
const path = require('path');
const fs = require('fs');

const carpetaDestino = path.join(__dirname, '../../uploads');

// Crea la carpeta si no existe
if (!fs.existsSync(carpetaDestino)) {
    fs.mkdirSync(carpetaDestino, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaDestino);
    },
    filename: (req, file, cb) => {
        const sufijo = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, sufijo + path.extname(file.originalname));
    }
});

function filtroImagen(req, file, cb) {
    const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (permitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
    }
}

const upload = multer({
    storage,
    fileFilter: filtroImagen,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;