import { Request, Response } from "express";
import { db } from "../db/db";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/generateJWT";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    // Require at least email OR username, and password
    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: "Email or username and password are required",
      });
    }

    let existingUser = null;

    // Try to find by email first
    if (email) {
      existingUser = await db.user.findUnique({
        where: { email },
      });
    }

    // If not found by email, try username
    if (!existingUser && username) {
      existingUser = await db.user.findUnique({
        where: { username },
      });
    }

    // Check if user exists
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: null,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: null,
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = existingUser;

    // Generate access token
    const accessToken = generateAccessToken({
      userId: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    });

    // const refreshToken = generateAccessToken(
    //   {
    //     userId: existingUser.id,
    //   },
    //   { expiresIn: "7d" }
    // );

    res.status(200).json({
      message: "Login successfully",
      data: {
        user: userWithoutPassword,
        accessToken,
        // refreshToken,
      },
      error: null,
    });
  } catch (error) {
    console.log("Error logging in user", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
