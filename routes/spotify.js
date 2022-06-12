const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('ACCESS TOKEN: ' + req.query.access_token);
    res.render('map');
});

module.exports = router;
