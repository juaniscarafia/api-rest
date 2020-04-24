const jwt = require('jsonwebtoken');
const config = require('../libs/configJWT');

async function verifyToken (req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(200).send({ err: err, decoded: decoded });
        }
        req.userId = decoded.id;
        next();
      });

    // const decoded = jwt.verify(token, config.secret, (err, result) => { 
    //     return res.status(200).send({ err: err, result: result, }); 
    // });

    // if (decoded){
    //     req.userId = decoded.id;
    //     next();
    // }
}

module.exports = verifyToken;