import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// for development purposes

let TOKEN_KEY = "areallylonggoodkey";
// for JWT expiration
const today = new Date();
const exp = new Date(today);
exp.setDate(today.getDate() + 30);

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, avatar } = req.body;
  let user;

  try {
    // check if user already exists
    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      avatar,
      friendRequest: [],
      isOnline: false,
      friends: [],
      conversations: [],
    });

    const savedUser = await user.save();

    // Emit the event //
    req.io.emit("new user", JSON.stringify(savedUser));

    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // select() is used to explicitly select which field will be returned
    const user = await User.findOne({ email }).select(
      "firstName lastName email avatar password friendRequest isOnline friends conversations "
    );
    if (!user) {
      return res.status(404).json({ message: "Invalid Email or Password" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        friendRequest: user.friendRequest,
        isOnline: user.isOnline,
        friends: user.friends,
        conversations: user.conversations,

        exp: parseInt(exp.getTime() / 1000),
      };

      const token = jwt.sign(payload, TOKEN_KEY);
      res.status(201).json({ token });
    } else {
      res.status(401).json({
        message: "User registered successfully",
        error: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    let users = await User.find();

    res.json(users);
  } catch {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
