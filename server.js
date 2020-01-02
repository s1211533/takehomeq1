const fs = require('fs');
const formidable = require('formidable');
const express = require('express');
const app = express();

app.set('view engine','ejs');

var title = null;
var description = null;

app.get('/', (req,res) => {
	res.redirect('/filetoupload');
});

app.get('/filetoupload', (req,res) => {
	res.status(200).render('filetoupload');
});

app.post('/filetoupload' , (req,res) => {
	const form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		console.log(filename);
      		if (fields.title && fields.title.length > 0) {
        		title = fields.title;
      		}
		if (fields.description && fields.description.length > 0) {
        		description = fields.description;
      		}
		console.log("1");
		fs.readFile(files.filetoupload.path, (err,data) => {
			image = new Buffer.from(data).toString('base64');
			res.status(200).render('filetoupload', {t :title, d :description});
		});
	});
});

app.listen(process.env.PORT || 8099);
