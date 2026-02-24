import { Request, Response, NextFunction } from "express";
import { tokenService } from "@/services/tokenService";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const payload = tokenService.verifyToken(token) as {
      userId: string;
      email: string;
    };

    if (await tokenService.isTokenRevoked(token)) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

    (req as any).user = {
      id: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: (error as Error).message,
    });
  }
};
