// Middlewares/Auth.js
const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({
        message: 'Unauthorized, JWT token is required'
      });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      return res.status(403).json({
        message: 'Unauthorized, token missing'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ NORMALIZED USER OBJECT (VERY IMPORTANT)
    req.user = {
      _id: decoded._id || decoded.id,
      name: decoded.name,
      email: decoded.email
    };

    console.log('✅ AUTH USER:', req.user);

    next();
  } catch (error) {
    return res.status(403).json({
      message: 'Unauthorized, JWT token wrong or expired'
    });
  }
};

module.exports = ensureAuthenticated;

// // const jwt = require('jsonwebtoken');

// // function ensureAuthenticated(req, res, next) {
// //   const authHeader = req.headers['authorization'];

// //   if (!authHeader) {
// //     return res.status(403).json({
// //       message: 'Unauthorized, JWT token is required'
// //     });
// //   }

// //   const token = authHeader.startsWith('Bearer ')
// //     ? authHeader.split(' ')[1]
// //     : authHeader;

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded;
// //     return next();   // 👈 VERY IMPORTANT
// //   } catch (err) {
// //     return res.status(403).json({
// //       message: 'Unauthorized, JWT token wrong or expired'
// //     });
// //   }
// // }

// // module.exports = ensureAuthenticated;
// // Middlewares/Auth.js
// const jwt = require('jsonwebtoken');

// const ensureAuthenticated = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(403).json({
//         message: 'Unauthorized, JWT token is required'
//       });
//     }

//     const token = authHeader.split(' ')[1]; // Bearer <token>

//     if (!token) {
//       return res.status(403).json({
//         message: 'Unauthorized, token missing'
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;

//     console.log('USER FROM JWT:', decoded);

//     next(); // ✅ MUST EXIST
//   } catch (error) {
//     return res.status(403).json({
//       message: 'Unauthorized, JWT token wrong or expired'
//     });
//   }
// };

// module.exports = ensureAuthenticated;
