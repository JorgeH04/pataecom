const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Prodseis = require('../models/prodseis');
const Cart = require('../models/cart');
//const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');





router.post('/prodseis/new-prodseis',  async (req, res) => {
  const { imagePath, product, color, talle, colorstock, tallestock, price } = req.body;
  const errors = [];
  if (!imagePath) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!product) {
    errors.push({text: 'Please Write a Description'});
  }
  if (!price) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      imagePath,
      product,
      price
    });
  } else {
    const newNote = new Prodseis({ imagePath, product, color, talle, colorstock, tallestock, price });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/prodseis/add');
  }
});






router.get('/prodseisredirect/:id', async (req, res) => {
  const { id } = req.params;
  const prodseis = await Prodseis.findById(id);
  res.render('prodseis/prodseisredirect', {prodseis});
});








// New product
router.get('/prodseis/add',  async (req, res) => {
  const prodseis = await Prodseis.find();
  res.render('prodseis/new-prodseis',  { prodseis });
});


router.get('/prodseisbackend/:id', async (req, res) => {
  const { id } = req.params;
  const prodseis = await Prodseis.findById(id);
   res.render('prodseis/prodseisbackend', {prodseis});
});




// talle y color
router.get('/prodseis/tallecolor/:id',  async (req, res) => {
  const prodseis = await Prodseis.findById(req.params.id);
  res.render('prodseis/tallecolor-prodseis', { prodseis });
});

router.post('/prodseis/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodseis.updateOne({_id: id}, req.body);

  res.redirect('/prodseisredirect/' + id);
});




//editar


router.get('/prodseis/edit/:id',  async (req, res) => {
  const prodseis = await Prodseis.findById(req.params.id);
  res.render('prodseis/edit-prodseis', { prodseis });
});

router.post('/prodseis/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Prodseis.updateOne({_id: id}, req.body);
  res.redirect('/prodseisbackend/' + id);
});




// Delete 
router.get('/prodseis/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Prodseis.deleteOne({_id: id});
  res.redirect('/prodseis/add');
});






router.get('/addtocardprodseis/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Prodseis.findById(productId, function(err, product){
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
