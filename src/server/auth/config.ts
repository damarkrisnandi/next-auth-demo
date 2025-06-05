import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/server/db";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/auth.form";
import { compare, hash } from "bcrypt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    id: string;
    user: {
      id: string;
      name: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const creds = await loginSchema.parseAsync(credentials);

        const user = await db.user.findFirst({
          where: { email: creds.email },
        });

        console.log(user);

        if (!user) {
          return null;
        }

        console.log(creds)

        const isValidPassword = await compare(creds.password, user.password);

        console.log(isValidPassword)
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    // DiscordProvider,
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    // credentials: {
    //   name: { label: "name", type: "text", placeholder: "jsmith" },
    //   password: { label: "Password", type: "password" }
    // }
  ],
  
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      console.log('cek-token', token)

      return token;
    },
    session: async ({ session, token, user }) => {
      if (token) {
        session.id = token.id;
      }

      return session;
    },
  },
  pages: {
    signIn: "/signin",
    newUser: "/register",
  },
  session: {
    strategy: "jwt"
  }

} satisfies NextAuthConfig;
