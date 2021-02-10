const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');


const recipeSchema = mongoose.Schema
(
  {
    recipeName :
      {
        type : String,
        required : true,
        unique : true
      },

    description :
      {
        type : String,
        required : true
      },

    procedureSteps :
      {
        type : [String],
      },


    imageData :
      {

        type : [Buffer],
      },

    ingredients :
      {
        type :
          [
            {
              ingredientName : String,
              quantity : String
            }
          ],
      },

    categories :
      {
        type : [String],
      },

    videoURLs :
      {
        type :
        [
          {
            language : String,
            url : String
          }
        ],
      }
  }
);

recipeSchema.plugin(uniqueValidator);

module.exports = mongoose.model
(
  'Recipe',
  recipeSchema
);
