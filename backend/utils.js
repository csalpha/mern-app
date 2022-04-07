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



