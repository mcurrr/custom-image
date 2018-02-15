
const express = require('express');
const lodash = require('lodash')
const cors = require('cors');
const mongoose = require('mongoose');
 
const { find, random } = lodash;

mongoose.connect('mongodb://mongo:27017', function (err) {
   if (err) throw err;
   console.log('Successfully connected');
});

const Cat = mongoose.model('Cat', {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
});

const kitty = new Cat({
    name: 'Zildjian',
});

kitty.save().then(() => console.log('meow'));

const app = express();


const CATS = [
    {id: 101, name: 'Fluffy'},
    {id: 102, name: 'Bill'},
    {id: 103, name: 'John'},
    {id: 104, name: 'Sarah'},
    {id: 105, name: 'Jessica'},
];

// app.use(cors());
app.use('/static', express.static('public'));

app.get('/', (req, res) => res.send('Test API for mr.Eagle'));

app.get('/new-cats/', (req, res) => {
    Cat.find({}, function(err, cats) {
        if (err) throw err;
        // object of all the users
        console.log(cats);
        res.send(cats)
    });
});

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

app.listen(process.env.PORT || 5000);
