import jwt from 'jsonwebtoken';
import {NextResponse} from 'next/server';
const SECRET = process.env.JWT_SECRET;
export function signJwt(payload, expiresIn='1d') {
    return jwt.sign(payload, SECRET, {expiresIn});
}
export function verifyJwt(req) {
    const header = req.headers.get('authorization');
    if (!header) return null;
    const token = header.replace(/^Bearer\s+/i, '');
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}
export function requireAuth(req) {
    const payload = verifyJwt(req);
    if (!payload) {
        return {error: NextResponse.json({error: 'Unauthorized'}, {status: 401})};
    };
    return {payload};
}
export function requireRole(req, roles) {
    const {payload, error} = requireAuth(req);
    if (error) return {error};
    if (!roles.includes(payload.role)) {
        return {error: NextResponse.json({error: 'Forbidden'}, {status: 403})};
    }
    return {payload};
}