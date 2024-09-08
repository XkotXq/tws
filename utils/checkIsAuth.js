import { NextResponse } from "next/server";

export default async function checkIsAuth(isAuthenticated) {
    const _isAuthenticated = await isAuthenticated()
    if (!_isAuthenticated) {
        return NextResponse.json(
            { error: "Wymagane uwierzytelnienie" },
			{ status: 401 }
		);
	}
}