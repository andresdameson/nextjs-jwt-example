import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Este tipo describe la estructura de nuestro JWT real
interface JwtCustomPayload {
  URLOK: string;
  URLError: string;
  IdentificadorTrx: string;
  SesionId: string;
  Comercio: string;
  Monto: string;
  IdPasarela: string;
  Guid: string;
  NombreComercio: string;
  nbf: number;
  exp: number;
  iat: number;
}

/**
 * Verifica el token JWT y devuelve el payload si es válido
 */
export async function verifyToken(token): Promise<JwtCustomPayload> {
  if (!token) {
    throw new Error("Missing user token");
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );

    return verified.payload as unknown as JwtCustomPayload;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Agrega a la respuesta cookie con payload del token validado
 */
export async function verifyTokenAndSetCookie(
  req: NextRequest,
  res: NextResponse
) {
  const { pathname } = req.nextUrl;
  const token = pathname.substr(1);

  if (!token) return res;
  try {
    const data: JwtCustomPayload = await verifyToken(token);
    const exp = new Date(data.exp*1000)
    console.log(exp)
    res.cookie(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME, data, {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      sameSite: "Strict",
      expires: exp,
    });
  } catch (e) {
    console.error(e);
  }
  return res;
}
