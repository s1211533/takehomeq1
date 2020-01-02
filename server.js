const fs = require('fs');
const formidable = require('formidable');
const express = require('express');
const app = express();
const ExifImage = require('exif').ExifImage;

app.set('view engine','ejs');

app.get('/', (req,res) => {
	res.redirect('/fileupload');
});

app.get('/fileupload', (req,res) => {
	res.status(200).render('fileupload');
});

app.post('/fileupload' , (req,res) => {
	const form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		let title = null;
		let description = null;
		let image = null;
		let make = null;
		let model = null;
		let createTime = null;
		let latitude1 = null;
		let latitude2 = null;
		let latitude3 = null;
		let longitude1 = null;
		let longitude2 = null;
		let longitude3 = null;
		let latitude = null;
		let longitude = null;
		let latitudeRef = null;
		let longitudeRef = null;
		title = fields.title;
        	description = fields.description;
		fs.readFile(files.fileupload.path, (err,data) => {
			image = new Buffer.from(data).toString('base64');
			try {
    				new ExifImage({ image : files.fileupload.path }, function (error, exifData) {
        				if (error){
            					console.log('Error: '+error.message);
						res.redirect('/error');
					}else{
						make = exifData.image.Make; 
						model = exifData.image.Model;
						createTime = exifData.exif.CreateDate;
						latitude1 = exifData.gps.GPSLatitude[0];
						latitude2 = exifData.gps.GPSLatitude[1];
						latitude3 = exifData.gps.GPSLatitude[2];
						latitudeRef = exifData.gps.GPSLatitudeRef;
						latitude = (latitude1 + latitude2/60 + latitude3/3600) * (latitudeRef == "N" ? 1 : -1);
						longitude1 = exifData.gps.GPSLongitude[0];
						longitude2 = exifData.gps.GPSLongitude[1];
						longitude3 = exifData.gps.GPSLongitude[2];
						longitude = (longitude1 + longitude2/60 + longitude3/3600) * (longitudeRef == "W" ? -1 : 1);
						res.status(200).render('display', {t :title, d :description, i: image, ma: make, mo: model, c: createTime});
						app.get('/map', (req,res) => {
							res.status(200).render('map' ,{la: latitude, lo: longitude});
						}); 
					}
    				});
			} catch (error) {
   				console.log('Error: ' + error.message);
				res.redirect('/error');
			}
		});
	});
});

app.get('/error', (req,res) => {
	res.status(200).render('error');
});

app.listen(process.env.PORT || 8099);
