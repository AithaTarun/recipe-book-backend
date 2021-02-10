const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const shoppingListSchema = mongoose.Schema
(
  {
    userId:
      {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true,
        unique : true
      },
    items:
      {
        type :
          [
            {
              type : String,
              required : true
            }
          ],
        default : []
      }
  }
);

shoppingListSchema.plugin(uniqueValidator);

module.exports = mongoose.model
(
  'ShoppingList',
  shoppingListSchema
);
