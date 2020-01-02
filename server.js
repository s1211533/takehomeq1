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
		let location = null;
		let dla = null;
		let mla = null;
		let sla = null;
		let dlo = null;
		let mlo = null;
		let slo = null;
		let lat = null;
		let lon = null;;
		title = fields.title;
        	description = fields.description;
		console.log("1");
		fs.readFile(files.filetoupload.path, (err,data) => {
			image = new Buffer.from(data).toString('base64');
			try {
    				new ExifImage({ image : files.filetoupload.path }, function (error, exifData) {
        				if (error){
            					console.log('Error: '+error.message);
						res.redirect('/filetoupload');
					}else{
						make = exifData.image.Make; 
						model = exifData.image.Model;
						createTime = exifData.exif.CreateDate;
						dla = exifData.gps.GPSLatitude[0];
						mla = exifData.gps.GPSLatitude[1];
						sla = exifData.gps.GPSLatitude[2];
						lat = dla + mla/60 + sla/3600;
						dlo = exifData.gps.GPSLongitude[0];
						mlo = exifData.gps.GPSLongitude[1];
						slo = exifData.gps.GPSLongitude[2];
						lon = dlo + mlo/60 + slo/3600;
						res.status(200).render('display', {t :title, d :description, i: image, ma: make, mo: model, c: createTime});
						app.get('/map', (req,res) => {
							res.status(200).render('map' ,{la: lat, lo: lon});
						}); 
					}
    				});
			} catch (error) {
   				console.log('Error: ' + error.message);
				res.redirect('/filetoupload')
			}
		});
	});
});

app.listen(process.env.PORT || 8099);
