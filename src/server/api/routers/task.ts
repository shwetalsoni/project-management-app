// TASK ROUTES
// create task - project_id, description, tags, deadline, assignee
// update task - project_id, task_id, description, tags, deadline, assignee
// status - project_id, task_id, status
// delete task - project_id, task_id
// get task

// get all tasks of a user over all projects - optional

// note
// exists tasks findOrThrow
// - add checks like user is part of project

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Status } from "@prisma/client";

export const taskRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        taskId: z.number(),
        projectId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findUniqueOrThrow({
        where: {
          id: input.taskId,
          projectId: input.projectId,
          project: {
            members: { some: { userId: ctx.session.user.id } },
          },
        },
        include: {
          assignee: { select: { email: true, username: true, id: true } },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        deadline: z.date(),
        assigneeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUniqueOrThrow({
        where: {
          id: input.projectId,
          members: { some: { userId: ctx.session.user.id } },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }
      console.log("Creating task", input, ctx.session.user.id);

      const task = await ctx.db.task.create({
        data: {
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          tags: input.tags,
          deadline: input.deadline,
          creatorId: ctx.session.user.id,
          assigneeId: !!input.assigneeId ? input.assigneeId : undefined,
        },
      });
      return {
        success: true,
        data: {
          task,
          message: "Task created successfully.",
        },
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        taskId: z.number(),
        projectId: z.number(),
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        deadline: z.date(),
        assigneeId: z.string(),
      }),
    )

    .mutation(async ({ ctx, input }) => {
      console.log("Creating task", input, ctx.session.user.id);

      const task = await ctx.db.task.update({
        where: {
          id: input.taskId,
          projectId: input.projectId,
          project: {
            members: { some: { userId: ctx.session.user.id } },
          },
        },

        data: {
          title: input.title,
          description: input.description,
          tags: input.tags,
          deadline: input.deadline,
          assigneeId: !!input.assigneeId ? input.assigneeId : undefined,
        },
      });

      return {
        success: true,
        data: {
          task,
          message: "Task updated.",
        },
      };
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.number(),
        projectId: z.number(),
        status: z.nativeEnum(Status),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.update({
        where: {
          id: input.taskId,
          projectId: input.projectId,
          project: {
            members: { some: { userId: ctx.session.user.id } },
          },
        },
        data: {
          status: input.status,
        },
      });
      return {
        success: true,
        data: {
          message: "Task status updated",
        },
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        taskId: z.number(),
        projectId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.delete({
        where: {
          id: input.taskId,
          projectId: input.projectId,
          project: {
            members: { some: { userId: ctx.session.user.id } },
          },
        },
      });
      return {
        success: true,
        data: {
          message: "Task deleted.",
        },
      };
    }),
});
