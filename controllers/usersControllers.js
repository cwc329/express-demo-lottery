//const { Article, Category, CategoryTag, User } = require('../models/db');
const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userControllers = {
  login: async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash('errorMessage', 'wrong username or password');
      //res.locals.errorMessage = req.flash('errorMessage');
      return res.redirect(req.originalUrl);
    }
    const user = await User.findOne(
      {
        where: {
          username
        }
      }
    )
    if (!user) {
      req.flash('errorMessage', 'user do not exist');
      res.locals.errorMessage = req.flash('errorMessge');
      console.log('userControllers: ',res.locals)
      return next();
    }
    bcrypt.compare(password, user.dataValues.password, (err, result) => {
      if (result) {
        req.session.userId = user.dataValues.id;
        req.session.nickname = user.dataValues.nickname;
        return next();
      } else {
        req.flash('errorMessage', 'wrong password');
        return next();
      }
    })
  },

  register: async (req, res, next) => {
    const { username, password, nickname, groupNo } = req.body;
    if (!username || !password || !nickname || !groupNo) {
      req.flash('errorMessage', 'invalid inputs');
      return res.redirect(req.originalUrl);
    }
    const hash = await bcrypt.hash(password, saltRounds);
    try{
      const newUser = await User.create(
        {
          username,
          password: hash,
          nickname,
          groupNo
        }
      );
    } catch(err) {
      req.flash('errorMessage', 'something went wrong, you may try another username or nickname');
    }
    next();
  },

  checkPermission: async (req, res, next) => {
    if(!req.session.userId) {
      return res.redirect('/');
    }
    next();
  }
}

module.exports = userControllers;