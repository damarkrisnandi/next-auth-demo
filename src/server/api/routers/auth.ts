import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import * as trpc from "@trpc/server";
import { signUpSchema } from "@/lib/auth.form";
import { hash } from "bcrypt";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;

      const { name, email, password } = input;

      const exists = await db.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const hashedPassword = await hash(password, 10);

      const result = await db.user.create({
        data: { name, email, password: hashedPassword },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),
    // signIn sudah dihandle next-auth
    // signOut sudah dihandle next-auth
});
