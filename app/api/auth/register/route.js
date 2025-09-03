import dbConnect from '../../../../lib/db';
import User from '../../../../lib/models/User';
import {NextResponse} from 'next/server';

export async function POST(req) {
    await dbConnect(); //connect to MongoDB
    const {phoneNumber, password, role} = await req.json(); //read user data
    const existUser = await User.findOne({phoneNumber});
    if (existUser) {
        return NextResponse.json(
            {message: 'User already exists'},
            {status: 400} //bad request
        );
    }
    const user = await User.create({phoneNumber, password, role}); //save uder data
    return NextResponse.json(
        {_id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role},
        {status: 201} //created
    );
}
