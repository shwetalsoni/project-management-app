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
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findUniqueOrThrow({
        where: { id: input.taskId },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        title: z.string().max(10),
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

      const task = await ctx.db.task.create({
        data: {
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          tags: input.tags,
          deadline: input.deadline,
          assigneeId: input.assigneeId,
          creatorId: ctx.session.user.id,
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
      const _task = await ctx.db.task.findUniqueOrThrow({
        where: {
          id: input.taskId,
          projectId: input.projectId,
          project: {
            members: { some: { userId: ctx.session.user.id } },
          },
        },
      });

      if (!_task) {
        throw new Error("Task not found or user is invalid");
      }

      const task = await ctx.db.task.update({
        where: {
          id: input.taskId,
          projectId: input.projectId,
        },
        data: {
          title: input.title,
          description: input.description,
          tags: input.tags,
          deadline: input.deadline,
          assigneeId: input.assigneeId,
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
        },
        data: {
          status: input.status,
        },
      });
      return {
        success: true,
        data: {
          message: "Task deleted.",
        },
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        taskId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.project.delete({
        where: {
          id: input.taskId,
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
