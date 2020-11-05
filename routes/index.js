const express = require('express');
const router = express.Router();
const lotteryControllers = require('../controllers/lotteryControllers');
const userControllers = require('../controllers/usersControllers');

/* GET home page. */

router.get('/', (req, res, next) => {
  res.render('index', res.app.locals.viewsVariables);
});

router.get('/lottery', lotteryControllers.getAllPrizes, lotteryControllers.lottery, (req, res, next) => {
  res.send(res.locals);
})

router.get('/prizes', lotteryControllers.getAllPrizes, function(req, res, next) {
  res.send(res.locals.prizes);
});

router.post('/prizes', userControllers.checkPermission, lotteryControllers.checkSum, lotteryControllers.add, (req, res, next) => {
  res.send(res.locals);
});

router.patch('/prizes', userControllers.checkPermission, lotteryControllers.checkSum, lotteryControllers.edit, (req, res, next) => {
  res.send(res.locals);
});

router.delete('/prizes', userControllers.checkPermission, lotteryControllers.delete, (req, res, next) => {
  res.send(res.locals);
});

router.post('/login', userControllers.login, (req, res, next) => {
  res.redirect('/');
})

router.get('/admin',  (req, res, next) => {
  res.render('admin', res.app.locals.viewsVariables);
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
