const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Order = require('../models/order');
const Cart = require('../models/cart');

const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
//const {SENDGRID_API,EMAIL} = require('../config/keys')
const userController=require('../config/controllers');



// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth:{
//       api_key:'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'
//   }
// }))

router.get('/pedidos/:page', async (req, res) => {

  let perPage = 8;
  let page = req.params.page || 1;

  Order 
  .find({}) // finding all documents
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, orders) => {
    var user;
    var cart;
    orders
    .forEach(function(order){
      cart=new Cart(order.cart);
      user=new User(order.user);
      order.items = cart.generateArray();  
    });
    Order.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('cart/pedidos', {
        orders,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});





router.get('/perfil/:page', async (req, res) => {

  let perPage = 8;
  let page = req.params.page || 1;

  Order 
  .find({}) // finding all documents
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, orders) => {
    var cart;
    orders
    .forEach(function(order){
      cart=new Cart(order.cart);
      order.items = cart.generateArray();
    });
    Order.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('users/profile', {
        orders,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});






//router.get('/pedidos', async (req, res) => {
  //const orders = await Order
    //.find()
    //.sort({ _id: -1 });
      // var user;
       //var cart;
       //orders
       //.forEach(function(order){
         //cart=new Cart(order.cart);
        // user=new User(order.user);
       //  order.items = cart.generateArray();  
      // });
    //res.render('cart/pedidos', {orders});
  //});
  

 

  router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  router.get('/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect : '/perfil/1',
        failureRedirect : '/'
      }));


      router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

      router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/perfil/1');
      }
    );
   




router.get('/users/profile', async(req, res) => {
  const orders = await Order
  .find({user: req.user})
  .sort({ _id: -1 });

    var cart;
    orders.forEach(function(order){
      cart=new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('users/profile', {orders});
});





router.get('/users/signup', (req, res) => {
  res.render('users/signup');
});






router.post('/users/signup', async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password, number, fecha, address, telefono, direccion, localidad, piso} = req.body;
  if(password != confirm_password) {
    errors.push({text: 'Passwords do not match.'});
    req.flash('error', 'Passwords do not match.');

  }
  if(password.length < 4) {
    errors.push({text: 'Passwords must be at least 4 characters.'})
    req.flash('error', 'Passwords must be at least 4 characters.');

  }
  if(errors.length > 0){
    res.render('users/signup', {name, email, password, confirm_password, number, telefono, direccion, fecha, address, localidad, piso });
  } else {

    const emailUser = await User.findOne({email: email});
    if(emailUser) {
      req.flash('error', 'The Email is already in use.');
      res.redirect('/users/signup');
    } else {


      const newUser = new User({name, email, password, confirm_password, number, fecha, telefono, direccion, address, localidad, piso});
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      await transporter.sendMail({
        to:newUser.email,
        from:"lehj09@gmail.com",
        subject:"signup success",
        html:"<h1>welcome to instagram</h1>"
    })
   
      req.flash('success', 'You are registered.');
      res.redirect('/users/signin');
    }
  }
});

////////////////////////////////////////////////////////////////////

router.get('/forgot',userController.forgot);


//after submit the email it will generate the accesstoken
router.post('/forgotPassword',userController.forgotPassword);

//it will render the reset page where user fill emai
router.get('/userpasswordForgot/:token',userController.renderResetPage);

//router for when password will successfully change using reset link mail
router.post('/passwordForgot/:token',userController.forgotSuccess);

//it wiil redirect to the reset page
router.get('/reset',userController.resetPage);



//it is route for normal password update when user login
router.post('/passwordReset',userController.resetPassword);




router.get('/users/signin', (req, res) => {
  res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
  failureRedirect: '/users/signin',
  failureFlash: true
}), function (req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    req.flash('success', 'Loggeado exitosamente');
   res.redirect('/');
  }
});


router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out now.');
  res.redirect('/users/signin');
});




router.get('/users/backend', async (req, res) => {
  const users = await User.find();
  res.render('users/usersback', { users});
  
});

module.exports = router;


