const express = require('express');

const fs= require('fs');

const multer = require('multer');

const Tesseract = require('Tesseract.js');

const app = express();

// app.use(bodyParser.urlencoded({extended: true}))

const PORT = process.env.PORT | 5000;   

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'images')
    },
    filename: function (req, file, callback) {
      callback(null, file.orignalname);
    }
});
var upload = multer({
 storage: Storage 
}).array('image', 3);
//route
app.post('/', (req, res) => {});

app.post('/upload', (req, res) => {
    console.log(req.file);
    upload(req, res , err => {
        if (err) {
            console.log(err);
            return res.send('somthing went wrong');
        }
        return res.send('file uploaded successfully');
    });
});

var image = fs.readFileSync(__dirname + '\\adhar.jpg', 
    {
        encoding:null
    });

Tesseract.recognize(image)
    .progress(function(p) {
        console.log('progress', p);
    })
    .then(function(result) {
        res.send('result', result);
    });

app.listen(PORT, () => {
    console.log('Server running on PORT ${PORT}')
});
