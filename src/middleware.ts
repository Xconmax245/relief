import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Must be logged in
      return !!token;
    },
  },
  pages: {
    signIn: '/admin/login',
  }
});

export const config = {
  // NOTE: `/admin/login` must be excluded, otherwise unauthenticated visitors are
  // redirected from the login page to itself (ERR_TOO_MANY_REDIRECTS).
  matcher: ['/admin', '/admin/((?!login).*)', '/api/admin/:path*'],
};
