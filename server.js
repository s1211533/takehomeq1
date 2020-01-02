const fs = require('fs');
const formidable = require('formidable');
const express = require('express');
const app = express();
const ExifImage = require('exif').ExifImage;

app.set('view engine','ejs');


app.get('/', (req,res) => {
	res.redirect('/filetoupload');
});

app.get('/filetoupload', (req,res) => {
	res.status(200).render('filetoupload');
});

app.post('/filetoupload' , (req,res) => {
	const form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		let title = null;
		let description = null;
		let image = null;
		let make = null;
		let model = null;
		let createTime = null;
		let latitude0 = null;
		let latitude1 = null;
		let latitude2 = null;
		let longitude0 = null;
		let longitude1 = null;
		let longitude2 = null;
		let latitude = null;
		let longitude = null;
		title = fields.title;
        	description = fields.description;
		fs.readFile(files.filetoupload.path, (err,data) => {
			image = new Buffer.from(data).toString('base64');
			try {
    				new ExifImage({ image : files.filetoupload.path }, function (error, exifData) {
        				if (error)
            					console.log('Error: '+error.message);
        				else
						make = exifData.image.Make; 
						model = exifData.image.Model;
						createTime = exifData.exif.CreateDate;
					        latitude0 = exifData.gps.GPSLatitude[0];
						latitude1 = exifData.gps.GPSLatitude[1];
						latitude2 = exifData.gps.GPSLatitude[2];
						latitude = latitude0 + latitude1/60 + latitude2/3600;
						longitude0 = exifData.gps.GPSLongitude[0];
						longitude1 = exifData.gps.GPSLongitude[1];
						longitude2 = exifData.gps.GPSLongitude[2];
						longitude = longitude0 + longitude1/60 + longitude2/3600;
						res.status(200).render('display', {t :title, d :description, i: image, ma: make, mo: model, c: createTime la: latitude, lo: longitude});	
    				});
			} catch (error) {
   				 console.log('Error: ' + error.message);
			}
			
		});
	});
});

app.listen(process.env.PORT || 8099);
