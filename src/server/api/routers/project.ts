// create project - title, description, creator
// add member
// delete project - project_id

// get project
// get user's all projects

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
        where: {
          id: input.id,
          members: { some: { userId: ctx.session.user.id } },
        },
        include: {
          tasks: {
            include: {
              assignee: {
                select: {
                  id: true,
                  email: true,
                  username: true,
                },
              },
            },
          },
        },
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
        title: z.string(),
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

  update: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.update({
        where: {
          id: input.projectId,
          members: { some: { userId: ctx.session.user.id } },
        },
        data: {
          title: input.title,
          description: input.description,
        },
      });
      return {
        success: true,
        data: {
          project,
          message: "Project updated successfully.",
        },
      };
    }),

  getMember: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUniqueOrThrow({
        where: {
          id: input.id,
          members: { some: { userId: ctx.session.user.id } },
        },
        select: {
          members: {
            select: {
              user: { select: { email: true, id: true, username: true } },
            },
          },
        },
      });
      return project.members.map((member) => member.user);
    }),

  addMember: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.project.update({
        where: {
          id: input.projectId,
          members: { some: { userId: ctx.session.user.id } },
        },
        data: {
          members: {
            create: {
              user: {
                connectOrCreate: {
                  where: { email: input.email },
                  create: {
                    email: input.email,
                    username: input.email.split("@")[0],
                  },
                },
              },
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
      await ctx.db.project.delete({
        where: {
          id: input.id,
          members: { some: { userId: ctx.session.user.id } },
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
