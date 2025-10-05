import dbConnect from '../../../../../lib/db';
import Reminder from '../../../../../lib/models/Reminder';
import Patient from '../../../../../lib/models/Patient';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../lib/auth';

export async function PATCH(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    try {
        const patient = await Patient.findOne({ user: roleCheck.payload.sub }).select('profileId');
        if (!patient) {
            return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
        }
        const {reminderID} = params;
        const updateData = await req.json();

        const reminder = await Reminder.findOne({_id: reminderID, patientID: patient.profileId});
        if (!reminder) {
            return NextResponse.json({error: 'Reminder not found'}, {status: 404});
        }
        Object.keys(updateData).forEach(key => {
            reminder[key] = updateData[key];
        });
        await reminder.save();
        return NextResponse.json({message: 'Reminder updated successfully', reminder}, {status:200}); 
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Updating reminder failed', details: err.message},
            {status: 500}
        );
    }
}

export async function DELETE(req, {params}) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    try {
        const patient = await Patient.findOne({ user: roleCheck.payload.sub }).select('profileId');
        if (!patient) {
            return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
        }
        const {reminderID} = params;
        const deleted = await Reminder.findOneAndDelete({_id: reminderID, patientID: patient.profileId});
        if (!deleted) {
            return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
        }
        return NextResponse.json({message: 'Reminder deleted successfully'}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Deleting reminder failed', details: err.message},
            {status: 500}
        );
    }
}