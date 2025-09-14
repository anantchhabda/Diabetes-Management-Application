import dbConnect from '../../../lib/db';
import User from '../../../lib/models/User';
import Patient from '../../../lib/models/Patient';
import Doctor from '../../../lib/models/Doctor';
import FamilyMember from '../../../lib/models/FamilyMember';
import {NextResponse} from "next/server";
import {requireAuth} from '../../../lib/auth';

export async function GET(req) {
    await dbConnect();
    const {payload, error} = requireAuth(req);
    if (error) return error;

    const user = await User.findById(payload.sub).select('role phoneNumber onboardingComplete');
    if (!user) return NextResponse.json({error: 'User not found'}, {status: 404});
    
    let name = null;
    let profile = null;

    switch(user.role) {
        case 'Patient': {
            const patient = await Patient.findOne({user: user._id})
                .select('_id name dob sex');
            if (patient) {
                name = patient.name;
                profile = {
                    patientId: patient._id,
                    name: patient.name,
                    dob: patient.dob,
                    sex: patient.sex
                };
            }
            break;
        }
        case 'Doctor': {
            const doctor = await Doctor.findOne({user: user._id})
                .select('_id name clinicName clinicAddress');
            if (doctor) {
                name = doctor.name;
                profile = {
                    doctorId: doctor._id,
                    name: doctor.name,
                    clinicName: doctor.clinicName,
                    clinicAddress: doctor.clinicAddress
                };
            }
            break;
        }
        case 'Family Member': {
            const familyMember = await FamilyMember.findOne({user: user._id})
                .select('_id name address');
            if (familyMember) {
                name = familyMember.name;
                profile = {
                    familyMemberId: familyMember._id,
                    name: familyMember.name
                };
            }
            break;
        }
    }

    return NextResponse.json({
        userId: user._id, 
        role: user.role, 
        phone: user.phoneNumber, 
        onboardingComplete: user.onboardingComplete,
        profile
    });
}
