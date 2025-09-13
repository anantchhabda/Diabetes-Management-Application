import dbConnect from '../../../../lib/db';
import User from '../../../../lib/models/User';
import {NextResponse} from 'next/server';
import {signJwt} from '../../../../lib/auth';

export async function POST(req) {
    await dbConnect(); //connect to MongoDB
    const {phoneNumber, password, role} = await req.json(); //read user data
    if (!phoneNumber || !password  || !role) {
        return NextResponse.json({error: "phone, password, confirmPassword, role are required"}, {status: 400});
    }

    const existUser = await User.findOne({phoneNumber});
    if (existUser) {
        return NextResponse.json(
            {message: 'User already exists'},
            {status: 400} //bad request
        );
    }
    try {
        const user = await User.create({phoneNumber, password, role}); //save user data
        const token = signJwt({_id: user._id, phoneNumber: user.phoneNumber, role: user.role, scope: 'onboarding'});
        return NextResponse.json(
            {_id: user._id,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token},
            {status: 201} //created
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: 'Registration failed'}, {status: 500});
    }
    
}
