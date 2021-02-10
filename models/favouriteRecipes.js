const mongoose = require('mongoose');

const favouriteRecipesSchema = mongoose.Schema
(
  {
    userId:
      {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true,
        unique : true
      },
    recipes:
      {
        type :
          [
            {
              type : mongoose.Schema.ObjectId,
              ref : 'Recipe',
              required : true
            }
          ],
        default : []
      }
  }
);

module.exports = mongoose.model
(
  'FavouriteRecipes',
  favouriteRecipesSchema
)
