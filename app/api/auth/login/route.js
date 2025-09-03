import dbConnect from '../../../../lib/db';
import User from '../../../../lib/models/User';
import bcrypt from 'bcryptjs';
import {NextResponse} from 'next/server';

export async function POST(req) {
    await dbConnect()
    const {phoneNumber, password} = await req.json();
    const user = User.findOne({phoneNumber});
    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
        return NextResponse.json({error: 'Incorrect password'}, {status: 401});
    }
    return NextResponse.json(
        {_id: user._id, role: user.role},
        {status: 200}
    );
}