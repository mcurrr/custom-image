const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const api = require('./routes/api');
const view = require('./routes/view');


const PORT = process.env.PORT || 5000;

const app = express();
app.get('/', (req, res) => res.send('Test API for mr. Eagle'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/static', express.static('public'));

app.set('views', process.cwd() + '/views')
app.set('view engine', 'pug')

// routing
app.use('/api', api);
app.use('/view', view);

app.listen(PORT);
