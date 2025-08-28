export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import {NextResponse} from 'next/server';
export async function POST(req) {
    await dbConnect();
    const {phoneNumber, password, role} = await req.json();
}
