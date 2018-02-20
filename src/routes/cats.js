const express = require('express');
const router = express.Router();
const { every, isEmpty, merge, map, reduce, keys } = require('lodash');
const colors = require('colors/safe');

const { Cat } = require('../schema');
const CAT_LIMIT = 10;

function convertQueryValue(key, value) {
    switch (key) {
        case 'name': return new RegExp(value, 'i');
        case 'description': return new RegExp(value, 'i');
        // case 'age': return { $gte: value.from, $lte: value.to };
        case 'likes': return { $in: value.split(',') };
        default: return value;
    }
}

// get all cats
router.get('/all/', (req, res) => {
    const query = reduce(req.query, (acc, value, key) => {
        if (isEmpty(value)) return acc;
        return { ...acc, [key]: convertQueryValue(key, value) };
    }, {});

    Cat
        .find(query)
        .sort({ created_at: -1 })
        // .limit(CAT_LIMIT)
        .select(`name created_at ${keys(query).join(' ')}`)
        .exec((err, cats) => {
        if (err) res.status(500).json({ error: err.message }).end();
        res.json({ result: map(cats, cat => cat.toJSON()) });
    });
});

// add cat
router.post('/add/', (req, res) => {
    new Cat(req.body)
        .save()
        .then(cat => res.status(200).json({ result: cat.toJSON() }))
        .catch(err => res.json({ error: err.message }));
});

// get cat
router.get('/get/:id/', function (req, res) {
  const id = req.params.id;
  Cat
    .findById(id)
    .exec((err, cat) => {
        if (err) res.status(500).json({ error: err.message }).end();
        res.json({ result: cat.toJSON() });
  });
});

// change cat
router.put('change/:id/', (req, res) => {
    const id = req.params.id;

    Cat.findByIdAndUpdate(id, req.body, (err, cat) => {
        if (err) throw err;
        res.status(200).json({ result: cat.toJSON() });
    });
});

// get cat
router.post('/remove/:id/', (req, res) => {
    const id = req.params.id;
    Cat
        .remove({ _id: id }, err => {
            if (err) res.status(500).json({ error: err.message }).end();
            res.json({ result: 'deleted' });
        });
});

router.get('*', (req, res) => {
    res.send('invalid route', 404);
});

module.exports = router;
