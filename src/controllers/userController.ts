import { db } from "../db/db";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      phone,
      dob,
      gender,
      image,
      role,
    } = req.body;

    if (
      !email ||
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !gender
    ) {
      return res.status(400).json({
        message: "Please all fields are required",
      });
    }
    // Ckeck if the User already exists ( email, username, phone )
    const [existingUserByEmail, existingUserByPhone, existingUserByUsername] =
      await Promise.all([
        db.user.findUnique({ where: { email } }),
        db.user.findUnique({ where: { phone } }),
        db.user.findUnique({ where: { username } }),
      ]);

    if (existingUserByEmail) {
      res.status(409).json({
        message: "Email already exists",
        data: null,
      });
      return;
    }
    if (existingUserByPhone) {
      res.status(409).json({
        message: "Phone number already exists",
        data: null,
      });
      return;
    }
    if (existingUserByUsername) {
      res.status(409).json({
        // message: `Username (${username}) already exists`,
        message: "Username already exists",
        data: null,
      });
      return;
    }
    // Hash the Password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the User
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        image: image
          ? image
          : "https://d4r1notk17.ufs.sh/f/ajZEQyxNnEuWKbPJ9yPD45GDtfHPjMyeBnsgS2F0Xua8Nmrv",
        role: role || "ATTENDANT",
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: "Created user successfully",
      data: userWithoutPassword,
      error: null,
    });
  } catch (error) {
    console.log("Error created user", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknow error",
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    const filteredUsers = users.map((user) => {
      const { password, role, ...others } = user;
      return others;
    });
    res.status(200).json({
      data: filteredUsers,
      error: null,
    });
  } catch (error) {
    console.log("Error fetching users", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknow error",
    });
  }
};

export const getAttendants = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        role: "ATTENDANT",
      },
    });

    const filteredUsers = users.map((user) => {
      const { password, role, ...others } = user;
      return others;
    });
    res.status(200).json({
      data: filteredUsers,
      error: null,
    });
  } catch (error) {
    console.log("Error fetching users", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknow error",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    const { password: _, ...result } = user;
    res.status(200).json({
      data: result,
      error: null,
    });
  } catch (error) {
    console.log("Error fetching user", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      email,
      username,
      firstName,
      lastName,
      password,
      phone,
      dob,
      gender,
      image,
      
    } = req.body;

    // ກວດສອບວ່າມີຂໍ້ມູນທີ່ຈະອັບເດດບໍ່
    if (
      !email &&
      !username &&
      !firstName &&
      !lastName &&
      !password &&
      !phone &&
      !dob &&
      !gender &&
      !image
    ) {
      return res.status(400).json({
        message: "No fields to update",
        data: null,
      });
    }

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    // ກວດສອບ email ຊ້ຳ (ຖ້າມີການປ່ຽນ email)
    if (email && email !== user.email) {
      const existingEmail = await db.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return res.status(409).json({
          message: `Email (${email}) already exists`,
          data: null,
        });
      }
    }

    // ກວດສອບ username ຊ້ຳ (ຖ້າມີການປ່ຽນ username)
    if (username && username !== user.username) {
      const existingUsername = await db.user.findUnique({
        where: { username },
      });
      if (existingUsername) {
        return res.status(409).json({
          message: `Username (${username}) already exists`,
          data: null,
        });
      }
    }

    // ກວດສອບ phone ຊ້ຳ (ຖ້າມີການປ່ຽນ phone)
    if (phone && phone !== user.phone) {
      const existingPhone = await db.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        return res.status(409).json({
          message: `Phone number (${phone}) already exists`,
          data: null,
        });
      }
    }

    let hashedPassword = user.password;
     if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
     }

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        email,
        username,
        firstName,
        lastName,
        password: hashedPassword,
        phone,
        dob,
        gender,
        image,
      },
    });

    const { password: _, ...others } = updatedUser;

    return res.status(200).json({
      message: "Updated user successfully",
      data: others,
      error: null,
    });
  } catch (error) {
    console.log("Error updating user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateUserPasswordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, currentPassword } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
        data: null,
      });
    }

    // ກວດສອບຄວາມຍາວຂອງ password
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        data: null,
      });
    }

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    // (Optional) ກວດສອບ current password ກ່ອນປ່ຽນ
    if (currentPassword) {
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({
          message: "Current password is incorrect",
          data: null,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    const { password: _, ...rest } = updatedUser;

    return res.status(200).json({
      message: "Password updated successfully",
      data: rest,
      error: null,
    });
  } catch (error) {
    console.log("Error updating password:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    await db.user.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
      error: null,
    });
  } catch (error) {
    console.log("Error deleting user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
