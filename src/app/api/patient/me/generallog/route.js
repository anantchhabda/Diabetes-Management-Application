import dbConnect from '../../../../lib/db';
import GeneralLog from '../../../../lib/models/GeneralLog';
import Patient from '../../../../lib/models/Patient';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../lib/auth';

export async function POST(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    try {
        const patient = await Patient.findOne({ user: roleCheck.payload.sub }).select('profileId');
        if (!patient) {
            return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
        }
        const {comment, date} = await req.json();
        if (!comment || !date) {
            return NextResponse.json(
                {message: 'Comment and date are required'}, {status: 400}
            );
        }

        const log = await GeneralLog.create({
            patient: patient.profileId,
            comment,
            date: new Date(date) //automatically stored at midnight of that date
        });

        return NextResponse.json({
            message: 'General log created successfully',
            generalLogID: log._id
        }, {status: 200});

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Logging general comment failed', details: err.message},
            {status: 500}
        );
    }
}

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    try {
        const patient = await Patient.findOne({ user: roleCheck.payload.sub }).select('profileId');
        if (!patient) {
            return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
        }
        const url = new URL(req.url);
        const date = url.searchParams.get('date');

        if (!date) return NextResponse.json(
            {message: 'Date is required'}, {status: 400}
        );
        
        const startDate = new Date(date);
        const nextDate = new Date(startDate);
        nextDate.setDate(nextDate.getDate()+1);

        const logs = await GeneralLog.find({
            patient: patient.profileId,
            date: {$gte: startDate, $lt: nextDate} //all documents for a single day (before 00:00 of the next day)
        });

        return NextResponse.json({logs}, {status: 200});

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Viewing general comment log failed', details: err.message},
            {status: 500}
        );
    }
}

export async function PATCH(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;

    try {
        const patient = await Patient.findOne({user: roleCheck.payload.sub}).select('profileId');
        if (!patient) {
            return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
        }

        const url = new URL(req.url);
        const date = url.searchParams.get('date');
        if (!date) {
            return NextResponse.json({error: 'Date is required'}, {status: 400});
        }

        const startDate = new Date(date);
        const nextDate = new Date(startDate);
        nextDate.setDate(nextDate.getDate()+1);

        const {comment} = await req.json();
        if (comment == null || comment == "") { //treat as delete if no comment provided
            await GeneralLog.deleteOne({
                patient: patient.profileId, 
                date: {$gte: startDate, $lt: nextDate}});
            return NextResponse.json({message: 'Log cleared'}, {status : 200});
        }

        const updated = await GeneralLog.findOneAndUpdate(
            {patient: patient.profileId, date: {$gte: startDate, $lt: nextDate}},
            {$set: {comment}},
            {new: true}
        );

        if (!updated) {
            return NextResponse.json({error: 'Log not found'}, {status: 404});
        }
        return NextResponse.json({message: 'General log updated', log: updated}, {status: 200});

    } catch (err) {
        return NextResponse.json(
            {error: 'Updating general comment failed', details: err.message},
            {status: 500}
        );
    }
}
