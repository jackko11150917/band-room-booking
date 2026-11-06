import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sql } from "@vercel/postgres";
import { configuredAdminEmails, ensureSchema } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await ensureSchema();
      const email = user.email.toLowerCase();
      const isAdmin = configuredAdminEmails().includes(email);
      await sql`
        INSERT INTO app_users (email, name, image, is_admin)
        VALUES (${email}, ${user.name ?? null}, ${user.image ?? null}, ${isAdmin})
        ON CONFLICT (email) DO UPDATE
        SET name = EXCLUDED.name, image = EXCLUDED.image,
            is_admin = app_users.is_admin OR EXCLUDED.is_admin
      `;
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        await ensureSchema();
        const result = await sql<{ is_admin: boolean }>`
          SELECT is_admin FROM app_users WHERE email = ${user.email.toLowerCase()}
        `;
        token.isAdmin = result.rows[0]?.is_admin === true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.isAdmin = token.isAdmin === true;
      return session;
    },
  },
};
