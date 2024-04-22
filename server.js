const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const port = 3000;

const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type. Only .doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png, .gif, .mp4, .avi, .mov files are allowed.'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


mongoose.connect('mongodb://localhost:27017/course_management', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const fileSchema = new mongoose.Schema({
    filename: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);


app.post('/assignments/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const file = new File({
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
        await file.save();
        res.status(200).json({ message: 'File uploaded successfully', file: file });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'An error occurred while uploading the file' });
    }
});


app.use(express.static('public'));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
