'use strict';

const express = require('express');
const path = require('path');

// Constants
const PORT = 3000;

// App
const app = express();
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(PORT);
console.log(`Running on localhost:${PORT}`);
