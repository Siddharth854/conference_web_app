const UserModel = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ================= SIGNUP =================
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Signup successful"
    });

  } catch (err) {
    console.error("SIGNUP ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ✅ CREATE JWT
    const jwtToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // ✅ RETURN jwtToken (NOT token)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      jwtToken,              // 🔥 CORRECT VARIABLE
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { login };

module.exports = {
  signup,
  login
};
