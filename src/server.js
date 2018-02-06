
const express = require('express');
const lodash = require('lodash')
var cors = require('cors');

const { find, random } = lodash;

const PORT = 3000;
const app = express();


const CATS = [
    {id: 101, name: 'Fluffy'},
    {id: 102, name: 'Bill'},
    {id: 103, name: 'John'},
    {id: 104, name: 'Sarah'},
    {id: 105, name: 'Jessica'},
];


app.use(cors());
app.use('/static', express.static('public'));

app.get('/', (req, res) => res.send('Test API for mr.Eagle'));
app.get('/cats/', (req, res) => res.send(CATS));

app.get('/cat/:id/', function (req, res) {
    var id = req.params.id;
    const cat = find(CATS, ['id', +id]);

    if (cat) {
        const fullCat = {
            ...cat,
            image: `static/images/${id}.jpeg`,
            likes: random(3, 99)
        };

        res.send(fullCat);
    }

    res.send({error: `no cat with id ${id} found`});
});

app.listen(PORT);
module.exports = () => 'Hi';