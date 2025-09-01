import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department_id,
      national_id,
      date_of_birth,
      contact_info,
      job_title,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await UserModel.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      department_id,
      national_id,
      date_of_birth,
      contact_info,
      job_title,
    });

    const { password: _, ...userToReturn } = newUser;
    res
      .status(201)
      .json({ message: "User registered successfully.", user: userToReturn });
  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === "23505" && error.constraint === "unique_national_id") {
      return res
        .status(409)
        .json({ message: "A user with this national ID already exists." });
    }
    res.status(500).json({ message: "Server error during registration." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    const { password: _, ...userToReturn } = user;

    res.status(200).json({ message: "Login successful.", user: userToReturn });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully." });
};

export const getMe = async (req, res) => {
  try {
    // req.user is attached by the 'protect' middleware
    const user = await UserModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
