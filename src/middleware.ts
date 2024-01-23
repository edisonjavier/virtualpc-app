import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const session = req.nextauth.token;
    if (session && req.nextUrl.pathname === "/login") {
      const firstRole = session?.roles[0].roleName.toLowerCase();
      return NextResponse.redirect(new URL(`/${firstRole}`, req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname === "/login") return true;
        if (!token) return false;
        const roles = token?.roles.map((rol) => rol.roleName.toUpperCase());
        const currentPathRole = req.nextUrl.pathname.split("/")[1].toLocaleUpperCase();
        const isRolMatch = roles?.includes(currentPathRole);
        return isRolMatch ?? false;
      }
    }
  }
);

export const config = {
  matcher: ["/login", "/admin/:path*"]
};
