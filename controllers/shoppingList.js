const ShoppingList = require('../models/shoppingList');

const User = require('../models/user');

exports.addShoppingListItem = async (request,response,next)=>
{
  try
  {
    const userCount = await User.countDocuments
    (
      {
        _id : request.body.userId
      }
    );

    if (userCount === 1)
    {
      const result = await ShoppingList.updateOne
      (
        {
          userId : request.body.userId
        },
        {
          $addToSet:
            {
              items : request.body.item.toLowerCase()
            }
        },
        {
          upsert : true,
          new : true
        }
      );

      response.status(200).send
      (
        {
          message : 'Item added successfully to the shopping list',
          updatedData : result
        }
      );
    }
    else
    {
      throw new Error("User with given ID not found");
    }
  }
  catch (error)
  {
    console.log(error);
    response.status(500).send
    (
      {
        message: "Adding to the list failed"
      }
    );
  }
}

exports.removeShoppingListItem = async (request,response,next)=>
{
  try
  {
    const userCount = await User.countDocuments
    (
      {
        _id : request.params['userId']
      }
    );

    if (userCount === 1)
    {
      const result = await ShoppingList.updateOne
      (
        {
          userId : request.params['userId']
        },
        {
          $pull:
            {
              items : request.params['item'].split("+").join(" ").toLowerCase()
            }
        }
      );

      response.status(200).send
      (
        {
          message : 'Item removed successfully',
          updatedData : result
        }
      );
    }
    else
    {
      throw new Error("User not found");
    }
  }
  catch (error)
  {
    console.log(error);
    response.status(500).send
    (
      {
        message: "Removing Item failed"
      }
    );
  }
}

exports.getShoppingListItems = async (request,response,next)=>
{
  try
  {
    const count = await  ShoppingList.countDocuments
    (
      {
        userId : request.params['userId']
      }
    );

    const userCount = await User.countDocuments
    (
      {
        _id : request.params['userId']
      }
    );

    if (count === 0 && userCount === 1)
    {
      const shoppingList = new ShoppingList
      (
        {
          userId: request.params['userId']
        }
      );
      await shoppingList.save();
    }

    const result = await ShoppingList.findOne
    (
      {
        userId : request.params['userId']
      }
    );

    response.status(200).send
    (
      {
        message : 'Fetched shopping list items successfully',
        data : {userId : result.userId, items : result.items}
      }
    );
  }
  catch (error)
  {
    console.log(error);
    response.status(500).send
    (
      {
        message: "Fetching shopping list items failed"
      }
    );
  }
}
