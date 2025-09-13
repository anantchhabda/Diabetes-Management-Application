import dbConnect from '../../../../../lib/db';
import GlucoseLog from '../../../../../lib/models/GlucoseLog';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../lib/auth';

export async function POST(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    try {
        const body = await req.json();
        const {type, glucoseLevel, date} = body;
        if (!type || !glucoseLevel || !date) {
            return NextResponse.json(
                {message: 'Type, glucose level and date are required'},
                {status: 400}
            );
        }
        const log = await GlucoseLog.create({
            patientID: roleCheck.payload._id,
            type,
            glucoseLevel,
            date: new Date(date) //automatically stored at midnight of that date
        });
        return NextResponse.json({
            message: 'Glucose log created successfully',
            glucoseLogID: log._id,
            alert: log.flag?'High glucose detected':null
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Logging glucose failed', details: err.message },
            {status: 500}
        );
    }
}

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    try {
        const url = new URL(req.url);
        const date = url.searchParams.get('date');
        if (!date) { return NextResponse.json(
            {message: 'Date is required'},
            {status: 400}
            );
        }
        const startDate = new Date(date);
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate()+1);
        const logs = await GlucoseLog.find({
            patientID: roleCheck.payload._id,
            date: {$gte: startDate, $lt: nextDay} //all documents for a single day (before 00:00 of the next day)
        });
    return NextResponse.json({logs});
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Viewing glucose log failed', details: err.message },
            {status: 500}
        );
    }
}
