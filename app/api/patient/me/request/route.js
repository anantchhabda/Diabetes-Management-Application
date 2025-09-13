import dbConnect from '../../../../../lib/db';
import LinkRequest from '../../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireAuth} from '../../../../../lib/auth';
import {requireRole} from '../../../../../lib/auth';

export async function GET(req) {
    await dbConnect()
    const {payload, error} = requireAuth(req);
    if (error) return error;
    const roleCheck = requireRole(req, ['Patient']);
    if (roleCheck.error) return roleCheck.error;
    const requests = await LinkRequest.find({patientID: payload._id});
    return NextResponse.json({requests});
}