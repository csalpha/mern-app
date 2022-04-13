import jwt from 'jsonwebtoken';

// export generateToken function
export const generateToken =(user) => {
    // jwt object from json web token and call sign function
    return jwt.sign( {  // pass user information
                        _id: user._id, 
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        isSeller: user.isSeller  
                     }, 
                        // pass secret string to encrypt data
                        process.env.JWT_SECRET || 'somethingsecret', 
                        // pass expires date ( 30 days )
                        { 
                            expiresIn: '30d'
                        } 
                    ); 
                                                    
};
 // middleware function
//
export const isAuth = (req, res, next) => {
    // get the authorization from req.headers
    const authorization = req.headers.authorization;

    // check if authorization does exist
    if (authorization) {
      // if we have authorization get the token by using a slice
      // read 7 caracteres and get the token part
      const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
      
      // use jwt.verify function
      jwt.verify(
        token,
        process.env.JWT_SECRET || 'somethingsecret',
        //call back function
        (err, decode) => {
          if (err) {
            // error
            res.status(401).send({ message: 'Invalid Token' });
          } else {
            // decrypted version of the token that includes user information
            req.user = decode;
            next();
          }
        }
      );
    } else {
      res.status(401).send({ message: 'No Token' });
    }
  };



