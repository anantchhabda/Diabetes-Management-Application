import dbConnect from '../../../../../lib/db';
import GeneralLog from '../../../../../lib/models/GeneralLog';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../../lib/auth';

export async function POST(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    try {
        const body = await req.json();
        const {comment, date} = body;
        if (!comment || !date) {
            return NextResponse.json(
                {message: 'Comment and date are required'},
                {status: 400}
            );
        }
        const log = await GeneralLog.create({
            patientID: roleCheck.payload._id,
            comment,
            date: new Date(date) //automatically stored at midnight of that date
        });
        return NextResponse.json({
            message: 'General log created successfully',
            generalLogID: log._id
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Logging general comment failed', details: err.message },
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
        const logs = await GeneralLog.find({
            patientID: roleCheck.payload._id,
            date: {$gte: startDate, $lt: nextDay} //all documents for a single day (before 00:00 of the next day)
        });
    return NextResponse.json({logs});
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Viewing general comment log failed', details: err.message },
            {status: 500}
        );
    }
}
