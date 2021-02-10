const Rating = require('../models/rating');

const Recipe = require('../models/recipe');
const User = require('../models/user');

exports.newRating = async (request,response,next)=>
{
  try
  {
    const recipeCount = await Recipe.countDocuments
    (
      {
        _id : request.params['id']
      }
    );

    const userCount = await User.countDocuments
    (
      {
        username : request.body.username,
      }
    );

    if (recipeCount === 1 && userCount === 1)
    {
      const rating = new Rating
      (
        {
          username : request.body.username,
          recipeId : request.params['id'],
          ratingValue : request.body.ratingValue,
          comment : request.body.comment
        }
      );

      const result = await rating.save();

      response.status(200).send
      (
        {
          message : 'Rating added successfully',
          updatedData : result
        }
      );
    }
    else
    {
      throw new Error("Recipe or User not found");
    }
  }
  catch (error)
  {
    console.log(error);
    response.status(500).send
    (
      {
        message: "Add rating failed"
      }
    )
  }
}

exports.getRatings = async (request,response,next)=>
{
  try
  {
    const ratings = await Rating.find
    (
      {
        'recipeId' : request.params['id']
      }
    );

    response.status(200).send
    (
      {
        message : 'Rating fetched successfully',
        ratings : ratings
      }
    );
  }
  catch (error)
  {
    console.log(error);
    response.status(500).send
    (
      {
        message: "Fetch ratings failed"
      }
    )
  }
}
