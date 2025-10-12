import dbConnect from '../../../../lib/db';
import FamilyMember from '../../../../lib/models/FamilyMember';
import User from '../../../../lib/models/User';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../lib/auth';

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Family Member']);
    if (roleCheck.error) return roleCheck.error;

    const family = await FamilyMember.findOne({ user: roleCheck.payload.sub }).select('profileId name dob address');
    const user = await User.findById(roleCheck.payload.sub).select('phoneNumber');
    if (!family) return NextResponse.json(
        {message: 'Profile not found'},
        {status: 404}
    );
    return NextResponse.json({profile: family, phoneNumber: user.phoneNumber});
}

export async function PUT(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Family Member']);
    if (roleCheck.error) return roleCheck.error;

    try {
        const body = await req.json();
        const family = await FamilyMember.findOne({ user: roleCheck.payload.sub });
        if (!family) return NextResponse.json(
        {message: 'Profile not found'},
        {status: 404}
        );
        family.name = body.name || family.name;
        family.dob = body.dob || family.dob;
        family.address = body.address || family.address;
        await family.save();
        return NextResponse.json({message: 'Profile updated successfully'}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Updating profile failed', details: err.message},
            {status: 500}
        );
    }
}