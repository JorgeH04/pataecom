const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Prodcinco = require('../models/prodcinco');
const Cart = require('../models/cart');
//const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');







router.get('/prodcincoindex', async (req, res) => {
  const prodcinco = await Prodcinco.find();
  res.render('prodcinco/prodcinco', { prodcinco });
});



router.post('/prodcinco/new-prodcinco',  async (req, res) => {
  const { name, title, image, imagedos, imagetres, description, price } = req.body;
  const errors = [];
  if (!image) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!title) {
    errors.push({text: 'Please Write a Description'});
  }
  if (!price) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      image,
      title,
      price
    });
  } else {
    const newNote = new Prodcinco({ name, title, image, imagedos, imagetres, description, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/prodcinco/add');
  }
});







router.get('/prodcincoredirect/:id', async (req, res) => {
  const { id } = req.params;
  const prodcinco = await Prodcinco.findById(id);
  res.render('prodcinco/prodcincoredirect', {prodcinco});
});








// New product
router.get('/prodcinco/add',  async (req, res) => {
  const prodcinco = await Prodcinco.find();
  res.render('prodcinco/new-prodcinco',  { prodcinco });
});


router.get('/prodcincobackend/:id', async (req, res) => {
  const { id } = req.params;
  const prodcinco = await Prodcinco.findById(id);
   res.render('prodcinco/prodcincobackend', {prodcinco});
});




// talle y color
router.get('/prodcinco/tallecolor/:id',  async (req, res) => {
  const prodcinco = await Prodcinco.findById(req.params.id);
  res.render('prodcinco/tallecolor-prodcinco', { prodcinco });
});

router.post('/prodcinco/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodcinco.updateOne({_id: id}, req.body);
  res.redirect('/prodcincoredirect/' + id);
});




//editar


router.get('/prodcinco/edit/:id',  async (req, res) => {
  const prodcinco = await Prodcinco.findById(req.params.id);
  res.render('prodcinco/edit-prodcinco', { prodcinco });
});

router.post('/prodcinco/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodcinco.updateOne({_id: id}, req.body);
  res.redirect('/prodcincobackend/' + id);
});




// Delete 
router.get('/prodcinco/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Prodcinco.deleteOne({_id: id});
  res.redirect('/prodcinco/add');
});






router.get('/addtocardprodcinco/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Prodcinco.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shopcart');

  });
});



module.exports = router;
