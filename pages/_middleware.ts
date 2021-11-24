import { NextRequest, NextResponse } from "next/server";
import { verifyTokenAndSetCookie } from "./../utils/jwt";

/**
 * Toma token JWT de la URL, lo valida y guarda los datos en una cookie
 */
export function middleware(req: NextRequest, res: NextResponse) {
  const validRoutes = ["/"];
  if (validRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return verifyTokenAndSetCookie(req, NextResponse.redirect("/"));
}
