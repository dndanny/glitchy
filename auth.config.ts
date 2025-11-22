import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/editor');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; 
      }
      return true;
    },
    async session({ session, token }: any) {
        if (token.sub && session.user) {
            session.user.id = token.sub;
            session.user.name = token.name; 
        }
        return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token.sub = user.id;
            token.name = user.name;
        }
        return token;
    }
  },
  providers: [],
} satisfies NextAuthConfig;