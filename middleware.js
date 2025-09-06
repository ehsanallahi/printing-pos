export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    '/dashboard',
    '/orders/:path*',
    '/customers/:path*',
    '/settings/:path*',
    '/track-customer/:path*',
  ],
};