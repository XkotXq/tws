import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Profile from "../../../../../models/profileModel";
import Organization from "../../../../../models/organizationModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "../../../../../utils/connect";

export async function POST(req) {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const _isAuthenticated = await isAuthenticated();

	if (!_isAuthenticated) {
		return NextResponse.json(
			{ error: "Wymagane uwierzytelnienie" },
			{ status: 401 }
		);
	}

	try {
		await connectDB();
        const user = await getUser();
        const profile = await Profile.find({kindeId: user.id})
        if  (profile.length > 0) {
            return NextResponse.json({error: "Profile was created", created: true}, {status: 409})
        }
		const {
			firstName,
			lastName,
			organizationId,
			isOwner,
			organizationName = null,
		} = await req.json();

		if (isOwner && !organizationName) {
			return NextResponse.json(
				{ error: "Niewystarczające dane" },
				{ status: 400 }
			);
		}

		const organization = await Organization.find({ organizationId });
		if (!firstName.trim() && !lastName.trim() && !organizationId.trim()) {
			return NextResponse.json(
				{ error: "Niewystarczające dane" },
				{ status: 400 }
			);
		}

		if (isOwner && organization.length === 0) {
			
			const newProfile = new Profile({
				kindeId: user.id,
				email: user.email,
				firstName,
				lastName,
				organizationId,
				isOwner,
			});
			await newProfile.save();
			const newOrganization = new Organization({
				organizationName,
				ownerId: newProfile._id,
				members: [newProfile._id],
				organizationId,
			});
			await newOrganization.save();
			return NextResponse.json(
				{ message: "Stworzono profil i dodano do organizacji", created: true },
				{ status: 201 }
			);
		} else if (isOwner && organization.length > 0) {
			return NextResponse.json(
				{ error: "Organizacja z takim id już istnieje", created: false },
				{ status: 409 }
			);
		} else if (!isOwner && organization.length > 0) {
            const organization = await Organization.findOne({organizationId})
            const newProfile = new Profile({
				kindeId: user.id,
				email: user.email,
				firstName,
				lastName,
				organizationId,
				isOwner,
			});
            await newProfile.save()
            organization.members.push(newProfile._id)
            await organization.save()

			return NextResponse.json(
				{ message: "Stworzono profil i dodano do organizacji", created: true },
				{ status: 201 }
			);
		} else if (!isOwner && organization.length === 0) {
			return NextResponse.json(
				{ error: "Organizacja z takim id nie istnieje", created: false },
				{ status: 404 }
			);
		}
	} catch (err) {
        console.error(err)
        return NextResponse.json({error: "Wystąpił błąd po stronie serwera"}, {status: 500})
    }
}
