export const runtime = 'nodejs';

import {dbConnect} from '../../../../lib/db.js';
import User from '../../../../lib/models/User.js';
import {NextResponse} from "next/server";
import {verifyJWT} from '../../../../lib/auth.js'

export async function GET(req) {
    await dbConnect();
    const payload = verifyJWT(req);
    if (!payload?.sub) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
    
    const user = await User.findById(payload.sub).select('phone role onboardingComplete');
    if (!user) return NextResponse.json({error: 'User not found'}, {status: 404});
    
    return NextResponse.json(
        {userId: String(user._id), role: user.role, phone: user.phone, onboardingComplete: user.onboardingComplete,}
    );
}
