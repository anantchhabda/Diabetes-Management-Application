import dbConnect from '../../../lib/db';
import User from '../../../lib/models/User';
import {NextResponse} from 'next/server';
import {signJwt} from '../../../lib/auth';
import { generateProfileId } from '../../../lib/auth';

export async function POST(req) {
    await dbConnect(); //connect to MongoDB
    const {phoneNumber, password, role} = await req.json(); //read user data
    
    if (!phoneNumber) {
        return NextResponse.json(
            {error: "phone is required"}, 
            {status: 400}
        );
    }
    if (!password) {
        return NextResponse.json(
            {error: "password is required"}, 
            {status: 400}
        );
    }
    if (!role) {
        return NextResponse.json(
            {error: "role is required"}, 
            {status: 400}
        );
    }

    const existUser = await User.findOne({phoneNumber});
    if (existUser) {
        return NextResponse.json(
            {message: 'User already exists'},
            {status: 400} //bad request
        );
    }

    try {
        let profileId;
        let exists = true;
        while (exists) {
            profileId = generateProfileId(6);
            exists = await User.exists({profileId});
        }

        const user = await User.create({
            phoneNumber,
            password,
            role,
            profileId: profileId
        }); //save user data
        const token = signJwt({
            sub: String(user._id), 
            phoneNumber: user.phoneNumber, 
            role: user.role, 
            scope: 'onboarding',
            profileId: user.profileId
        });

        return NextResponse.json(
            {userId: user._id,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profileId: user.profileId,
            token},
            {status: 201} //created
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: 'Registration failed'}, {status: 500});
    }
    
}
