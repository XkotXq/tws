import { NextResponse } from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import Profile from "../../../../../models/profileModel";
import { connectDB } from "../../../../../utils/connect";

export async function POST(req) {
    const { getUser, isAuthenticated } = getKindeServerSession()
    const _isAuthenticated = await isAuthenticated()
    let _id = null
    if (_isAuthenticated) {
        const { id } = await getUser()
        _id = id
    }
    const data = await req.json()
    const idForCheck = _id ? _id : data.id
    try {
        await connectDB()
        const profile = await Profile.findOne({kindeId: idForCheck})
        if  (profile) {
            return NextResponse.json({message: "Profile created", created: true, isOwner: profile.isOwner, isManage: profile.isOwner }, {status: 201})
        } else {
            return NextResponse.json({message: "Profile was created", created: false}, {status: 201})
        }
    } catch(e) {
        return NextResponse.json({message: "Profile check error"}, {status: 500})
    }
    // return NextResponse.json({message: "Profile created"}, {status: 201})
}