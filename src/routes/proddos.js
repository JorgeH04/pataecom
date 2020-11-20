const express = require('express');
const router = express.Router();

// Stripe
//const stripe = require('stripe')('sk_test_rCp23dn4fDasEqfGiVkhHvii00SyEkd4GS');


// Models
const Proddos = require('../models/proddos');
const Cart = require('../models/cart');
const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');




//router.get('/proddosindex', async (req, res) => {
//    const proddos = await Proddos.find();
//    res.render('proddos/proddos', { proddos });
//  });

  router.get('/proddosindex/:page', async (req, res) => {
    let perPage = 8;
    let page = req.params.page || 1;
  
    Proddos
    .find({}) // finding all documents
    .sort({ timestamp: -1 })
    .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
    .limit(perPage) // output just 9 items
    .exec((err, proddos) => {
      Proddos.countDocuments((err, count) => { // count to calculate the number of pages
        if (err) return next(err);
        res.render('proddos/proddos', {
          proddos,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
  });
  
  



  router.post('/proddos/new-proddos',  async (req, res) => {
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
      const newNote = new Proddos({ name, title, image, imagedos, imagetres, description, price });
      //newNote.user = req.user.id;
      await newNote.save();
      req.flash('success_msg', 'Note Added Successfully');
      res.redirect('/proddosback/:1');
    }
  });
  






router.get('/proddosredirect/:id', async (req, res) => {
  const { id } = req.params;
  const proddos = await Proddos.findById(id);
  res.render('proddos/proddosredirect', {proddos});
});




router.get('/proddosindex/:page', async (req, res) => {
  let perPage = 8;
  let page = req.params.page || 1;

  Proddos
  .find({}) // finding all documents
  .sort({ timestamp: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, proddos) => {
    Proddos.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('proddos/new-proddos', {
        proddos,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});





// New product
router.get('/proddos/add',  async (req, res) => {
  const proddos = await Proddos.find();
  res.render('proddos/new-proddos',  { proddos });
});


router.get('/proddosbackend/:id', async (req, res) => {
  const { id } = req.params;
  const proddos = await Proddos.findById(id);
   res.render('proddos/proddosbackend', {proddos});
});




// talle y color
router.get('/proddos/tallecolor/:id',  async (req, res) => {
  const proddos = await Proddos.findById(req.params.id);
  res.render('proddos/tallecolor-proddos', { proddos });
});

router.post('/proddos/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Proddos.updateOne({_id: id}, req.body);

  res.redirect('/proddosredirect/' + id);
});




//editar


router.get('/proddos/edit/:id',  async (req, res) => {
  const proddos = await Proddos.findById(req.params.id);
  res.render('proddos/edit-proddos', { proddos });
});

router.post('/proddos/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Proddos.updateOne({_id: id}, req.body);
  res.redirect('/proddosbackend/' + id);
});




// Delete 
router.get('/proddos/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Proddos.deleteOne({_id: id});
  res.redirect('/proddos/add');
});






router.get('/addtocardproddos/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Proddos.findById(productId, function(err, product){
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
