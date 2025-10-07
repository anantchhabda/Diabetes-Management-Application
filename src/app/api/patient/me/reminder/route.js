import dbConnect from '../../../../lib/db';
import Reminder from '../../../../lib/models/Reminder';
import Patient from '../../../../lib/models/Patient';
import {NextResponse} from "next/server";
import {requireRole} from '../../../../lib/auth';

export async function GET(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    try {
        const patient = await Patient.findOne({ user: roleCheck.payload.sub }).select('profileId');
        if (!patient) {
            return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
        }
        let reminders = await Reminder.find({patientID: patient.profileId});
        if (!reminders || reminders.length == 0) {
            return NextResponse.json({ message: 'No reminder yet' });
        }
        const now = new Date();
        for (let reminder of reminders) {
            if (reminder.interval == 'Monthly') {
                const [hours, minutes] = reminder.time.split(':').map(Number);
                let [year, month, day] = reminder.startDate.split('-').map(Number);
                let reminderDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0); //for comparison only
                //increase the month unitl the reminderDateTime is in the future
                while (reminderDateTime <= now) {
                    month = month + 1;
                    if (month > 12) {
                        month = 1;
                        year = year + 1
                    } //reset to Jan
                    reminderDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0); //keep compare
                }
                //store 
                reminder.startDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                await reminder.save()
            }
        }
        return NextResponse.json({reminders}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Viewing reminders failed', details: err.message},
            {status: 500}
        );
    }
}

export async function POST(req) {
    await dbConnect();
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    try {
        const patient = await Patient.findOne({ user: roleCheck.payload.sub }).select('profileId');
        if (!patient) {
            return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
        }
        const {name, date, time, interval} = await req.json();
            if (!name || !date || !time || !interval) {
                return NextResponse.json(
                    {message: 'All fields are required'},
                    {status: 400}
                );
            }
        const reminder = await Reminder.create({
            patientID: patient.profileId,
            name: name,
            startDate: date,
            time: time,
            interval: interval
        });
        return NextResponse.json({
            message: 'Reminder created successfully',
            reminderID: reminder._id
        }, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {error: 'Creating reminder failed', details: err.message},
            {status: 500}
        );
    }
}
