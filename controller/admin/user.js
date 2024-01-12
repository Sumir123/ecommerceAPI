const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

exports.signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (user) {
      return res.status(400).json({ message: "Admin already register" });
    }

    const { firstName, lastName, username, email, password } = req.body;

    const _user = new User({
      firstName,
      lastName,
      email,
      password,
      username,
      role: "admin",
    });
    _user.save();
    return res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (user.authenticate(req.body.password)) {
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const { _id, firstName, lastName, email, role, fullName } = user;
      res.status(200).json({
        token,
        user: { _id, firstName, lastName, email, role, fullName },
      });
    } else {
      return res.status(400).json({ message: "Invalid Password" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Something went wrong", error: error.message });
  }
};
