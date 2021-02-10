const FavouriteRecipes = require('../models/favouriteRecipes');

const Recipe = require('../models/recipe');
const User = require('../models/user');

exports.addOrNewFavRecipe = async (request,response,next)=>
{
  try
  {
    const recipeCount = await Recipe.countDocuments
    (
      {
        _id : request.body.recipeId
      }
    );

    const userCount = await User.countDocuments
    (
      {
        _id : request.body.userId
      }
    );

    if (recipeCount === 1 && userCount === 1)
    {
      const result = await FavouriteRecipes.updateOne
      (
        {
          userId : request.body.userId
        },
        {
          $addToSet:
            {
              recipes : request.body.recipeId
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
          message : 'Favourite recipe added successfully',
          updatedData : result
        }
      );
    }
    else
    {
      throw new Error("Recipe or User with given ID not found");
    }
  }
  catch (error)
  {
    console.log(error);
    response.status(500).send
    (
      {
        message: "Adding favourite recipe failed"
      }
    );
  }
}

exports.removeFavRecipe = async (request,response,next)=>
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
      const result = await FavouriteRecipes.updateOne
      (
        {
          userId : request.params['userId']
        },
        {
          $pull:
            {
              recipes : request.params['recipeId']
            }
        }
      );

      response.status(200).send
      (
        {
          message : 'Favourite recipe removed successfully',
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
        message: "Removing favourite recipe failed"
      }
    );
  }
}

exports.getFavRecipes = async (request, response, next)=>
{
  try
  {
    const count = await  FavouriteRecipes.countDocuments
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
      const favRecipe = new FavouriteRecipes
      (
        {
          userId: request.params['userId']
        }
      );
      await favRecipe.save();
    }

    const result = await FavouriteRecipes.findOne
    (
      {
        userId : request.params['userId']
      }
    );

    response.status(200).send
    (
      {
        message : 'Fetched favourite recipes successfully',
        data : {userId : result.userId, recipes : result.recipes}
      }
    );
  }
  catch (error)
  {
    console.log(error);
    response.status(500).send
    (
      {
        message: "Fetching favourite recipes failed"
      }
    );
  }
}
