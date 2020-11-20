const express = require('express');
const router = express.Router();
const Ofertauno = require('../models/ofertauno');
const Ofertados = require('../models/ofertados');
const Ofertatres = require('../models/ofertatres');

const Cart = require('../models/cart');
const Order = require('../models/order');

//router.get('/', async (req, res) => {
 // res.render('index');
//});

router.get('/', async (req, res) => {

  
  const ofertauno = await Ofertauno.find();
  const ofertados = await Ofertados.find();
  const ofertatres = await Ofertatres.find();


  res.render('index', { ofertauno, ofertados, ofertatres
  });
});




router.get('/contacto', async (req, res) => {
  res.render('contact');
});

router.get('/sobrenosotros', async (req, res) => {
  res.render('about');
});


module.exports = router;
