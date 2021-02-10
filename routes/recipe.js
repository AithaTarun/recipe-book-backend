const express = require('express');

const router = express.Router();

const recipeController = require('../controllers/recipe');

const validateImagesAndUpload = require('../middleware/images-data');

const checkAuthentication = require('../middleware/check-auth');

const ratingController = require('../controllers/rating');

const favouriteRecipesController = require('../controllers/favouriteRecipes');


router.post
(
  '/newRating/:id',
  (request, response, next) =>
  {
    request.body = {...request.body , isNormalOperation : true};

    next();
  },
  checkAuthentication,
  ratingController.newRating
);

router.get
(
  '/getRatings/:id',
  ratingController.getRatings
);

router.post
(
  '/addFavRecipe',
  (request, response, next) =>
  {
    request.body = {...request.body , isNormalOperation : true};

    next();
  },
  checkAuthentication,
  favouriteRecipesController.addOrNewFavRecipe
);

router.delete
(
  '/removeFavRecipe/:recipeId/:userId',
  (request, response, next) =>
  {
    request.body = {...request.body , isNormalOperation : true};

    next();
  },
  checkAuthentication,
  favouriteRecipesController.removeFavRecipe
);

router.get
(
  '/getFavRecipes/:userId',
  (request, response, next) =>
  {
    request.body = {...request.body , isNormalOperation : true};

    next();
  },
  checkAuthentication,
  favouriteRecipesController.getFavRecipes
);

router.post
(
  '/new',
  checkAuthentication,
  validateImagesAndUpload.array('imageData'),
  recipeController.newOrUpdateRecipe,
);

router.get
(
  '',
  recipeController.getRecipes
);

router.patch
(
  '/update/:id',
  checkAuthentication,
  validateImagesAndUpload.array('imageData'),
  recipeController.newOrUpdateRecipe
);

router.delete
(
  '/:id',
  checkAuthentication,
  recipeController.deleteRecipe
);

module.exports = router;
