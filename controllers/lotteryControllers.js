const db = require('../models');
const { Lottery } = db;

const lotteryControllers = {
  getAllPrizes: async (req, res, next) => {
    const prizes = await Lottery.findAll();
    res.locals.prizes = prizes;
    next();
  },

  add: async (req, res, next) => {
    const {prize, description, rate, image} = req.body;
    const prizes = await Lottery.create(
      {
        prize, 
        description,
        image,
        rate,
      }
    )
    next();
  },

  edit: async (req, res, next) => {
    const { id } = req.query;
    const { prize, description, rate, image } = req.body;
    const values = {};
    const valuesArray = [{prize}, {description}, {rate}, {image}];
    valuesArray.forEach( value => {
      const entry = Object.entries(value)[0];
      if (entry[1]) {
        values[entry[0]] = entry[1];
      }
    })
    try {
      const prizes = await Lottery.update(values,
        {
          where: {
            id,
          }
        }
      );
    } catch(error) {
      console.log(error);
    }
    next();
  },

  delete: async (req, res, next) => {
    const {id} = req.query;
    const prize = await Lottery.destroy(
      {
        where: {
          id
        }
      }
    );
    next();
  },

  getRateSum: async (req, res, next) => {
    const rateSum = await Lottery.sum('rate');
    res.app.locals.rateSum = rateSum;
    next();
  },

  checkSum: async (req, res, next) => {
    const { id } = req.query;
    const { rateSum } = req.app.locals;
    const { rate } = req.body;
    const prize = await Lottery.findOne({
      where: {
        id,
      }
    });
    let oldRate = prize.rate;
    if (Math.floor(rateSum * 10000) + Math.floor(rate * 10000) - Math.floor(oldRate * 10000)> 10000) {
      res.locals.error = true;
      res.locals.errorMessage = 'sum of rate exeeded 1';
      return res.send(res.locals);
    }
    next();
  },

  lottery: async (req, res, next) => {
    const { prizes } = res.locals;
    const luckNumber = Math.random();
    let probability = 1;
    for (const prize of prizes) {
      probability -= prize.rate;
      if (luckNumber > probability) {
        res.locals = {}
        res.locals.prize = prize;
        return next();
      }
    }
    res.locals = {};
    res.locals.prize = {};
    return next();
  }
}

module.exports = lotteryControllers;
