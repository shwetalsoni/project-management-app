import { z } from "zod";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const signUpRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(input.password, salt);
      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          passwordHash,
        },
      });
      return {
        success: true,
        data: {
          message: "Account created successfully. Now sign in to continue.",
        },
      };
    }),
});

/**
 *
 * pass + salt = hash
 * bcrypt.hash(password, salt) => hash + salt
 * bcrypt.compare(password, hash) => true/false
 * password, passwordHash -> hash + salt
 *
 */
