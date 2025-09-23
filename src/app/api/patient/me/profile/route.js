import dbConnect from '../../../../lib/db';
import Patient from '../../../../lib/models/Patient';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../lib/auth';

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    const patient = await Patient.findOne({ user: roleCheck.payload.sub }).select('profileId name dob sex address yearOfDiag typeOfDiag');
    if (!patient) return NextResponse.json(
        {message: 'Profile not found'},
        {status: 404}
    );
    return NextResponse.json({profile: patient}, {status: 200});
}

export async function PUT(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    try {
        const body = await req.json();
        const patient = await Patient.findOne({ user: roleCheck.payload.sub });
        if (!patient) return NextResponse.json(
        {message: 'Profile not found'},
        {status: 404}
        );
        patient.name = body.name || patient.name;
        patient.dob = body.dob || patient.dob;
        patient.sex = body.sex || patient.sex;
        patient.address = body.address || patient.address;
        patient.yearOfDiag = body.yearOfDiag || patient.yearOfDiag;
        patient.typeOfDiag = body.typeOfDiag || patient.typeOfDiag;
        await patient.save();
        return NextResponse.json({message: 'Profile updated successfully'}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Updating profile failed', details: err.message},
            {status: 500}
        );
    }
}