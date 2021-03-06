const express = require('express');
const router = express.Router();
const { every, isEmpty, merge, map, reduce, keys, get, omit, filter } = require('lodash');
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
    const page = +req.query.page || 1;
    const skip = Math.abs(page - 1) * CAT_LIMIT;

    const query = reduce(omit(req.query, 'page'), (acc, value, key) => {
        if (isEmpty(value)) return acc;
        return { ...acc, [key]: convertQueryValue(key, value) };
    }, {});

    Cat
        .find(query)
        .sort({ created_at: -1 })
        .limit(CAT_LIMIT)
        .skip(skip)
        .select(`name created_at ${keys(query).join(' ')}`)
        .exec((err, cats) => {
        if (err) res.render('error', { error: err.message });
        res.render('list', { cats: map(cats, cat => cat.toJSON()) });
    });
});

// add cat
router.get('/add/', (req, res) => res.sendFile(process.cwd() + '/html/add-form.html'));

// get cat
router.get('/get/:id/', function (req, res) {
  const id = req.params.id;
  Cat
    .findById(id)
    .exec((err, cat) => {
        if (err) res.render('error', { error: err.message });
        res.render('cat', { cat: cat.toJSON() });
  });
});

module.exports = router;
