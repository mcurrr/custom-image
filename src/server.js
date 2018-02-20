const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const cats = require('./routes/cats');


const PORT = process.env.PORT || 5000;

const app = express();
app.get('/', (req, res) => res.send('Test API for mr. Eagle'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/static', express.static('public'));

// routing
app.use('/cats', cats);

app.listen(PORT);
