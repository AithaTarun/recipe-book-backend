const bcrypt = require("bcryptjs");
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const request = require('request');

exports.createUser = async (request,response,next)=>
{
  try
  {
    const hash = await bcrypt.hash(request.body.password,10);

    const user = new User
    (
      {
        username : request.body.username,
        email : request.body.email,
        password : hash
      }
    );

    const result = await user.save();

    await sendWelcomeMail(request.body.email,request.body.username,result._id);

    response.status(201).send
    (
      {
        message : 'User created',
        result :
          {
            id : result._id,
            username : result.username,
          }
      }
    );

  }
  catch (error)
  {
    response.status(500).send
    (
      {
        message : 'Username or e-mail already taken'
      }
    );
  }
};

exports.userLogin = async (request,response,next)=>
{
  try
  {
    let fetchedUser;

    const user = await User.findOne
    (
      {
        email: request.body.email
      }
    );

    //Found the user

    if (!user || !user.isActivated) //User not found or account not yet activated.
    {
      return response.status(401).send
      (
        {
          message: 'User not found or not activated'
        }
      )
    }
    fetchedUser = user;

    //Valid password
    const result = await bcrypt.compare(request.body.password, user.password);

    if (!result)
    {
      return response.status(401).send
      (
        {
          message: 'Authentication failed'
        }
      )
    }

    const token = jwt.sign
    (
      {
        username : fetchedUser.username,
        email: fetchedUser.email,
        userId: fetchedUser._id
      },
      process.env.JWT_KEY,
      {
        //To configure token.
        expiresIn: '1h'
      }
    );

    return response.status(200).send
    (
      {
        token: token,
        expiresIn: 3600 //This token expires in 3600 seconds = 1 hour
      }
    );
  }
  catch(error)
  {
    response.status(401).send
    (
      {
        message : 'Authentication failed',
        error
      }
    );
  }

};


exports.userAccountActivation = async (request,response,next)=>
{
  try
  {
    await User.updateOne
    (
      {
        _id : request.body.id
      },
      {
        isActivated : true
      }
    );
  }
  catch (error)
  {
    return response.status(404).send
    (
      {
        message : "Invalid activation ID"
      }
    )
  }

  response.status(200).send
  (
    {
      message:"Account activated"
    }
  );
};


const sendWelcomeMail = (toMail,username,activationId)=>
{
  let options =
    {
      method: 'POST',
      url: 'https://api.sendgrid.com/v3/mail/send',
      headers:
        {
          'content-type': 'application/json',
          authorization: 'Bearer '+ process.env.SENDGRID_API_KEY
        },
      body:
        {
          personalizations :
            [
              {
                to :
                  [
                    {
                      email: toMail,
                      name : username
                    }
                  ],
                dynamic_template_data:
                  {
                    activationLink : process.env.FRONT_END_URL + `/auth/activateAccount/${activationId}`
                  },

                subject: 'Welcome to recipe book'
              }
            ],
          from :
            {
              email: 'webrecipebook@gmail.com', name: 'Recipe Book'
            },
          reply_to:
            {
              email: 'webrecipebook@gmail.com', name: 'Recipe Book'
            },
          template_id: 'd-01527137d0cf4475a73f28e0707f3582'
        },
      json: true
    };

  request(options, function (error, response, body)
    {
      if (error) throw new Error(error);
    }
  );
}
