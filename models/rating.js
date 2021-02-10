const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema
(
  {
    username :
      {
        type : String,
        ref : 'User'
      },
    recipeId :
      {
        type : mongoose.Schema.ObjectId,
        ref : 'Recipe'
      },
    ratingValue :
      {
        type : Number,
        min : 0,
        max : 5,
        required : true
      },
    comment : String
  }
);

module.exports = mongoose.model
(
  'Rating',
  ratingSchema
)
