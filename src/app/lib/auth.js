import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET;

// Prefer Authorization header. (TEMP: ignore cookies to prove the point)
function getBearerFromHeader(req) {
  const header =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header) return null;
  const m = header.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

// If you want fallback later, re-enable this, but KEEP header first.
// function getTokenFromCookies(req) {
//   try {
//     const priorities = ["authToken", "token", "auth"];
//     for (const name of priorities) {
//       const v = req.cookies?.get?.(name)?.value;
//       if (v) return v;
//     }
//   } catch (_) {}
//   return null;
// }

export function signJwt(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "24h" });
}

export function verifyJwt(req) {
  // HEADER FIRST
  let token = getBearerFromHeader(req);

  // --- TEMP: comment OUT cookie fallback to prove the issue ---
  // if (!token) token = getTokenFromCookies(req);

  if (!token) return null;

  try {
    console.log("[AUTH] using Authorization header token");
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export async function verifyAuth(authHeader) {
  try {
    if (!authHeader) throw new Error("Missing Authorization header");
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) throw new Error("No token found");
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error("[verifyAuth] failed:", err.message);
    return null;
  }
}

export function requireAuth(req) {
  const payload = verifyJwt(req);
  if (!payload) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { payload };
}

export function requireRole(req, roles) {
  const out = requireAuth(req);
  if (out.error) return out;
  if (
    Array.isArray(roles) &&
    roles.length &&
    !roles.includes(out.payload.role)
  ) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return out;
}

export function generateProfileId(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
