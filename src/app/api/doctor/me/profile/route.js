import dbConnect from '../../../../lib/db';
import Doctor from '../../../../lib/models/Doctor';
import User from '../../../../lib/models/User';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../lib/auth';

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Doctor']);
    if (roleCheck.error) return roleCheck.error;

    const doctor = await Doctor.findOne({ user: roleCheck.payload.sub }).select('profileId name dob clinicName clinicAddress');
    const user = await User.findById(roleCheck.payload.sub).select('phoneNumber');
    if (!doctor) return NextResponse.json(
        {message: 'Profile not found'},
        {status: 404}
    );
    return NextResponse.json({profile: doctor, phoneNumber: user.phoneNumber});
}

export async function PUT(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Doctor']);
    if (roleCheck.error) return roleCheck.error;

    try {
        const body = await req.json();
        const doctor = await Doctor.findOne({ user: roleCheck.payload.sub });
        if (!doctor) return NextResponse.json(
        {message: 'Profile not found'},
        {status: 404}
        );
        doctor.name = body.name || doctor.name;
        doctor.dob = body.dob || doctor.dob;
        doctor.clinicName = body.clinicName || doctor.clinicName;
        doctor.clinicAddress = body.clinicAddress || doctor.clinicAddress;
        await doctor.save();
        return NextResponse.json({message: 'Profile updated successfully'}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Updating profile failed', details: err.message},
            {status: 500}
        );
    }
}