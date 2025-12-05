import { Request, Response } from "express";
import { db } from "../db/db";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/generateJWT";
import { generateToken } from "../utils/generateToken";
import { addMinutes } from "date-fns";
import { Resend } from "resend";
import { generateEmailHTML } from "../utils/generateTemplate";
const resend = new Resend(process.env.RESEND_API_KEY);

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
        message: "Invalid username or password",
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
        message: "Invalid email or password",
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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    const resetToken = generateToken().toString();
    const resetTokenExpiry = addMinutes(new Date(), 10);

    const updatedUser = await db.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // ✅ Generate Email HTML (must return string)
    const emailHTML = generateEmailHTML(resetToken);

    // ✅ Send Email
    const { data, error } = await resend.emails.send({
      from: "IPOS <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request",
      html: emailHTML,
    });
    if (error) {
      return res.status(400).json(error);
    }

    const result = {
      userId: updatedUser.id,
      emailId: data,
    };
    // ✅ Only ONE response
    return res.status(200).json({
      message: `Password reset email sent to ${email}`,
      data: result,
    });
  } catch (error) {
    console.log("Failed forgot password error", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const existingUser = await db.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: {gte: new Date() } },
    });

    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid or Expired token",
        data: null,
      });
    }

    
    return res.status(200).json({
      message: "Token is valid",
    });
  } catch (error) {
    console.log("Failed to verify token error", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await db.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: {gte: new Date() } },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or Expired token",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: {id: user.id},
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Failed to change password error", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
