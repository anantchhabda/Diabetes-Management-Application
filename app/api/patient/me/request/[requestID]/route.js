import dbConnect from '../../../../lib/db';
import Doctor from '../../../../lib/models/Doctor';
import FamilyMember from '../../../../lib/models/FamilyMember';
import LinkRequest from '../../../../lib/models/LinkRequest';
import {NextResponse} from "next/server";
import {requireAuth} from '../../../../lib/auth';
import {requireRole} from '../../../../lib/auth';