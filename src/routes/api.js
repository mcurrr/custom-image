const express = require('express');
const router = express.Router();
const { every, isEmpty, merge, map, reduce, keys, get, omit } = require('lodash');
const colors = require('colors/safe');

const { Cat } = require('../schema');
const CAT_LIMIT = 5;

function convertQueryValue(key, value) {
    switch (key) {
        case 'name': return new RegExp(value, 'i');
        case 'description': return new RegExp(value, 'i');
        case 'age': return { $gte: get(value.split(','), 0, 0), $lte: get(value.split(','), 1, 30) };
        case 'likes': return { $in: value.split(',') };
        case 'dislikes': return { $in: value.split(',') };
        default: return value;
    }
}

// get all cats
router.get('/all/', (req, res) => {
    const page = +get(req, ['query', 'page'], 1);
    const skip = Math.abs(page - 1) * CAT_LIMIT;

    const query = reduce(omit(req.query, 'page'), (acc, value, key) => {
        if (isEmpty(value)) return acc;
        return { ...acc, [key]: convertQueryValue(key, value) };
    }, {});

    const matches = Cat.find(query);

    let count = 0;
    Cat.count(query, (err, counted) => count = counted );

    Cat
        .find(query)
        .sort({ created_at: -1 })
        .limit(CAT_LIMIT)
        .skip(skip)
        .select(`name created_at ${keys(query).join(' ')}`)
        .exec((err, cats) => {
            if (err) {
                res.status(500).json({ error: err.message }).end();
                return;
            }

            res.json({ result: map(cats, cat => cat.toJSON()), count });
    });
});

// add cat
router.get('/add/', (req, res) => res.sendFile(process.cwd() + '/html/add-form.html'));

router.post('/add/', (req, res) => {
    new Cat(req.body)
        .save()
        .then(cat => res.status(200).json({ result: cat.toJSON() }))
        .catch(err => res.json({ error: err.message }).end());
});

// get cat
router.get('/get/:id/', function (req, res) {
  const id = get(req, ['params', 'id']);

  Cat
    .findById(id)
    .exec((err, cat) => {
        if (err) {
            res.status(500).json({ error: err.message }).end();
            return;
        }

        res.json({ result: cat.toJSON() });
  });
});

// change cat
router.put('change/:id/', (req, res) => {
    const id = get(req, ['params', 'id']);

    Cat.findByIdAndUpdate(id, req.body, (err, cat) => {
        if (err) {
            res.status(500).json({ error: err.message }).end();
            return;
        }

        res.status(200).json({ result: cat.toJSON() });
    });
});

// get cat
router.post('/remove/:id/', (req, res) => {
    const id = get(req, ['params', 'id']);

    Cat
        .remove({ _id: id }, err => {
            if (err) {
                res.status(500).json({ error: err.message }).end();
                return;
            }

            res.json({ result: 'deleted' });
        });
});

router.get('*', (req, res) => {
    res.send('invalid route', 404);
});

module.exports = router;
