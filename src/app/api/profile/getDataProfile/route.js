import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Profile from "../../../../../models/profileModel";
import { connectDB } from "../../../../../utils/connect";


export async function POST(req) {
    // const { getUser, isAuthenticated } = getKindeServerSession();
	// const _isAuthenticated = await isAuthenticated();

	// if (!_isAuthenticated) {
	// 	return NextResponse.json(
	// 		{ error: "Wymagane uwierzytelnienie" },
	// 		{ status: 401 }
	// 	);
	// }

    try {
        const { userId } = await req.json()
        await connectDB()
        // const user = await getUser()
        const profile = await Profile.findOne({kindeId: userId}, {email: 0, endedTests: 0 , createdAt: 0, updatedAt: 0, __v: 0, _id: 0, kindeId: 0})
        if(profile) {
            return NextResponse.json({
                profile: {
                    ...profile.toObject(),
                    savedTests: profile.savedTests.length,
                    activeTests: profile.activeTests.length,
                },
                created: true
              }, { status: 201 })
        } else {
            return NextResponse.json({ error: "Brak takiego profilu", profile: null, created: false }, { status: 404 })
        }

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Wystąpił błąd po stronie serwera", profile: null, created: false }, {status: 500})
    }
}