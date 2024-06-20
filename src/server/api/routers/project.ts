// create project - title, description, creator
// add member
// delete project - project_id

// get project
// get user's all projects

// note - add check that user is member of project

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUniqueOrThrow({
        where: { id: input.id },
        include: { tasks: true },
      });
    }),

  getUserAllProjects: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        members: { some: { userId: ctx.session.user.id } },
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().max(10),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          title: input.title,
          description: input.description,
          creatorId: ctx.session.user.id,
          members: {
            create: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
      return {
        success: true,
        data: {
          project,
          message: "Project created successfully.",
        },
      };
    }),

  addMember: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        memberId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUniqueOrThrow({
        where: { id: input.id },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      await ctx.db.project.update({
        where: { id: input.id },
        data: {
          members: {
            create: {
              userId: input.memberId,
            },
          },
        },
      });

      return {
        success: true,
        data: {
          message: "Member added successfully.",
        },
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUniqueOrThrow({
        where: {
          id: input.id,
          members: { some: { userId: ctx.session.user.id } },
        },
      });

      if (!project) {
        throw new Error("Only members can delete project");
      }

      await ctx.db.project.delete({
        where: {
          id: input.id,
        },
      });
      return {
        success: true,
        data: {
          message: "Project deleted.",
        },
      };
    }),
});
