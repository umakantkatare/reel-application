import { NextRequest } from "next/server";
import { connectToDb } from "@/lib/db";
import User from "@/models/User";
import { response } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return response(
      {
        error: "email or password required!",
      },
      400,
    );
  }

  await connectToDb();

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response(
        {
          message: "email already exists",
        },
        400,
      );
    }

    const user = await User.create({
      email,
      password,
    });

    return response(
      {
        message: "User registered succesfully!",
        user,
      },
      201,
    );
  } catch (error) {
    return response(
      {
        error: "Failed to register user",
      },
      500,
    );
  }
}
