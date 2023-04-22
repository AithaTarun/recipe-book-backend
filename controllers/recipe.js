const Recipe = require('../models/recipe');

exports.newOrUpdateRecipe = async (request, response, next)=>
{
  try
  {
    let buffers = [];
    for (const file of request.files)
    {
     buffers.push(file.buffer);
    }
    request.files=buffers;

    request.body.ingredients = JSON.parse(request.body.ingredients);

    request.body.videoURLs = JSON.parse(request.body.videoURLs);


    if (request.params.id)
    {

      const recipe = {
        recipeName : request.body.recipeName,
        description : request.body.description,
        procedureSteps : request.body.procedureSteps,
        imageData : request.files,
        ingredients : request.body.ingredients,
        categories : request.body.categories,
        videoURLs : request.body.videoURLs
      };

      const result = await Recipe.updateOne
      (
        {
          _id : request.params.id,
        },
        recipe
      );

      response.status(200).send
      (
        {
          message : 'Recipe updated',
          updatedData : result
        }
      );
    }
    else
    {
      const recipe = new Recipe
      (
        {
          recipeName : request.body.recipeName,
          description : request.body.description,
          procedureSteps : request.body.procedureSteps,
          imageData : request.files,
          ingredients : request.body.ingredients,
          categories : request.body.categories,
          videoURLs : request.body.videoURLs
        }
      );

      const result = await recipe.save();

      response.status(201).send
      (
        {
          message : 'Recipe created',
          savedData : result
        }
      );
    }
  }
  catch (error)
  {
    console.log("Occurred Error : ",error);

    response.status(500).send
    (
      {
        message : 'Recipe creation/updating failed',
        error
      }
    );
  }
}

exports.getRecipes = async (request,response,next)=>
{
  console.log(process.env);
  const recipeQuery = Recipe.find();

  let fetchedRecipes;

  recipeQuery.then
  (
    (recipes) =>
    {
      fetchedRecipes = recipes;
      return Recipe.countDocuments();
    }
  )
    .then
    (
      (count) =>
      {
        response.status(200).send
        (
          {
            message: 'Fetched recipes successfully',
            recipes: fetchedRecipes,
            maxRecipes: count
          }
        );
      }
    )
    .catch
    (
      (error) =>
      {
        console.log(error);
        response.status(500).send
        (
          {
            message: "Fetching recipes failed"
          }
        )
      }
    )
  };

exports.deleteRecipe= async (request,response,next)=>
{
  try
  {
    const deletedRecipe = await Recipe.deleteOne
    (
      {
        _id : request.params.id
      }
    );

    response.status(200).send
    (
      {
        message : "Recipe deleted successfully",
        deletedRecipe
      }
    )
  }
  catch(error)
  {
    console.log(error);
    response.status(500).send
    (
      {
        message: "Deleting recipe failed"
      }
    )
  }
}
