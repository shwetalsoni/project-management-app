import { describe, expect, test } from "vitest";
import type { Session } from "next-auth";
import { createInnerTRPCContext } from "../trpc";
import { appRouter } from "../root";

// our tests
describe("testing", () => {
  test("should tests project and task protected procedures", async () => {
    let ctx = createInnerTRPCContext({ session: null });
    let caller = appRouter.createCaller({ ...ctx });

    // create our user
    const user = await caller.signUp.create({
      email: "shwetal2@mail.com",
      password: "12345",
    });

    // session mocked
    const session: Session = {
      expires: "1000",
      user: {
        id: user.data.userId,
      },
    };

    // create project
    const input = {
      title: "Project 1",
      description: "project 1 details",
    };

    // unathorized
    await expect(caller.projects.create(input)).rejects.toThrowError(
      /UNAUTHORIZED/,
    );

    // re-create context with user session
    ctx = createInnerTRPCContext({ session: session });
    caller = appRouter.createCaller({ ...ctx });

    // project created
    const res = await caller.projects.create(input);
    expect(res.data.project.title).toEqual("Project 1");

    // signing up new user
    const secUser = await caller.signUp.create({
      email: "shwetal@mail.com",
      password: "1234njrg",
    });

    // creating new user session
    const secSession: Session = {
      expires: "1000",
      user: {
        id: secUser.data.userId,
      },
    };

    // re-create context with new user session
    ctx = createInnerTRPCContext({ session: secSession });
    caller = appRouter.createCaller({ ...ctx });

    // create task
    const taskInput = {
      projectId: res.data.project.id,
      title: "task 1",
      description: "task 1 details",
      tags: [],
      deadline: new Date(),
      assigneeId: "",
    };

    // creating task with non member user
    await expect(caller.tasks.create(taskInput)).rejects.toThrowError(
      /No Project found/,
    );

    // re-create context with member user session
    ctx = createInnerTRPCContext({ session: session });
    caller = appRouter.createCaller({ ...ctx });

    const task = await caller.tasks.create(taskInput);
    expect(task.data.task.title).toEqual("task 1");

    // delete task

    // re-create context with new user session
    ctx = createInnerTRPCContext({ session: secSession });
    caller = appRouter.createCaller({ ...ctx });

    // deleting task by non member
    await expect(
      caller.tasks.delete({
        taskId: task.data.task.id,
        projectId: res.data.project.id,
      }),
    ).rejects.toThrowError(/does not exist/);

    // re-create context with member user session
    ctx = createInnerTRPCContext({ session: session });
    caller = appRouter.createCaller({ ...ctx });

    const deleteTask = await caller.tasks.delete({
      taskId: task.data.task.id,
      projectId: res.data.project.id,
    });

    expect(deleteTask.data.message).toEqual("Task deleted.");
  });
});
