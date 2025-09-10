import jwt from 'jsonwebtoken';
import {NextResponse} from 'next/server';
const SECRET = process.env.JWT_SECRET;

export function signJWT(payload) {
    return jwt.sign(payload, SECRET, {expiresIn: '24h'});
}

export function verifyJWT(req) {
    const header = req.headers.get('authorization');
    if (!header) return null;
    const token = header.replace(/^Bearer\s+/i, '');
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}

//Check if the request has a valid token
export function requireAuth(req) {
    const payload = verifyJWT(req);
    if (!payload) {
        return {error: NextResponse.json({error: 'Unauthorized'}, {status: 401})};
    };
    return {payload};
}

//Check if authenticated, then check if the role is in the allowed list
export function requireRole(req, roles) {
    const {payload, error} = requireAuth(req);
    if (error) return {error};
    if (!roles.includes(payload.role)) {
        return {error: NextResponse.json({error: 'Forbidden'}, {status: 403})};
    }
    return {payload};
}
