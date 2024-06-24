import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          username: input.username,
        },
      });
      const _user = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
      return {
        success: true,
        data: {
          _user,
          message: "User updated successfully.",
        },
      };
    }),
});
