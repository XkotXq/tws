import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default async function middleware(req) {
    return withAuth(req)
}

export const config = {
    matcher: ["/account", "/dashboard", "/createAccount", "/creator/:path*"],
}