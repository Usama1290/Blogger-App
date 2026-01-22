const jwt = require('jsonwebtoken');
const JWT_SECRET = 'MySecretKey';

async function authentication(req, res, next) {

   try {

      const header = req.headers['authorization'];

    if (!header) {
      return res.status(401).json({
        success: false,
        message: "Access denied."
      });
    }
   
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    console.log("AUTH USER:", req.user);

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Access denied."
    });
  }
}



module.exports = {authentication};
