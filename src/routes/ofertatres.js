const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Ofertatres = require('../models/ofertatres');
const Cart = require('../models/cart');

// Helpers
const { isAuthenticated } = require('../helpers/auth');




router.post('/ofertatres/new-ofertatres',  async (req, res) => {
  const { name, title, image, imagedos, imagetres, description, oldprice, price, filtroprice, color, colorstock  } = req.body;
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
    const newNote = new Ofertatres({ name, title, image, imagedos, imagetres, description, oldprice, price, filtroprice, color, colorstock  });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/ofertatres/add');
  }
});






router.get('/ofertatresredirect/:id', async (req, res) => {
  const { id } = req.params;
  const ofertatres = await Ofertatres.findById(id);
  //console.log(post);
  //res.send('recibido');
   res.render('ofertatres/ofertatresredirect', {ofertatres});
});








// New producto
router.get('/ofertatres/add',  async (req, res) => {
  const ofertatres = await Ofertatres.find();
  res.render('ofertatres/new-ofertatres',  { ofertatres });
});



router.get('/ofertatresbackend/:id', async (req, res) => {
  const { id } = req.params;
  const ofertatres = await Ofertatres.findById(id);
   res.render('ofertatres/ofertatresbackend', {ofertatres});
});




////////////////////////////////////////crud////////////////////////////////////////////////7





//editar


router.get('/ofertatres/edit/:id',  async (req, res) => {
  const ofertatres = await Ofertatres.findById(req.params.id);
  res.render('ofertados/edit-ofertados', { ofertados });
});

router.post('/ofertatres/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Ofertatres.updateOne({_id: id}, req.body);
  res.redirect('/ofertatres/add');
});


// Delete 
router.get('/ofertatres/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Ofertatres.deleteOne({_id: id});
  res.redirect('/ofertatres/add');
});




////////////////////////////////////////cart////////////////////////////////////////////////7





router.get('/addtocardofertatres/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Ofertatres.findById(productId, function(err, product){
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
