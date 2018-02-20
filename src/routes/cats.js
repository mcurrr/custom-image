const express = require('express');
const router = express.Router();
const { every, isEmpty, merge } = require('lodash');
const colors = require('colors/safe');

const { Cat } = require('../schema');
const CAT_LIMIT = 10;

// get all cats
router.get('/all/', (req, res) => {
    // const search = req.param('search');
    // const skip = req.param('skip');
    // console.log(colors.green(search, skip));

    Cat
        .find({})
        .sort({ created: -1 })
        // .limit(CAT_LIMIT)
        .select('name')
        .exec((err, cats) => {
        if (err) res.status(500).json({ error: err.message }).end();
        res.json(cats);
    });
});

// add cat
router.post('/add/', (req, res) => {
    new Cat(req.body)
        .save()
        .then(cat => res.status(200).json({ cat }))
        .catch(err => res.json({ error: err.message }));
});

// get cat
router.get('/get/:id/', function (req, res) {
  const id = req.params.id;
  Cat
    .findById(id)
    .exec((err, cat) => {
        if (err) res.status(500).json({ error: err.message }).end();
        res.json(cat);
  });
});

// change cat
router.put('change/:id/', function (req, res) {
    const id = req.params.id;

    Cat.findByIdAndUpdate(id, req.body, function(err, cat) {
        if (err) throw err;
        res.status(200).json({ cat });
    });
});

router.get('*', function(req, res){
    res.send('invalid route', 404);
});

module.exports = router;
