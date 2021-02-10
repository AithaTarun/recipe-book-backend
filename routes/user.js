const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

const shoppingListController = require('../controllers/shoppingList')

const checkAuthentication = require('../middleware/check-auth');

router.post
(
  '/signup',
  userController.createUser,
);


router.post
(
  '/login',
  userController.userLogin
);


router.put
(
  '/activateAccount',
  userController.userAccountActivation
);

// For, shopping list items

router.post
(
  '/addShoppingListItem',
  (request, response, next) =>
  {
    request.body = {...request.body , isNormalOperation : true};

    next();
  },
  //checkAuthentication,
  shoppingListController.addShoppingListItem
);

router.delete
(
  '/removeShoppingListItem/:userId/:item',
  (request, response, next) =>
  {
    request.body = {...request.body , isNormalOperation : true};

    next();
  },
  checkAuthentication,
  shoppingListController.removeShoppingListItem
);

router.get
(
  '/getShoppingListItems/:userId',
  (request, response, next) =>
  {
    request.body = {...request.body , isNormalOperation : true};

    next();
  },
  checkAuthentication,
  shoppingListController.getShoppingListItems
);

module.exports = router;
