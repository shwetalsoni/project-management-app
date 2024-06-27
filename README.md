# Task Management and Collaboration Tool 

## Deployed link
https://d1xsfqpmaij5qi.cloudfront.net/

## Table of content
- [Project Setup](#project-setup)
- [Architecture](#architecture)
- [Testing](#testing)
- [Deployment instructions](#deployment-instructions)

<img width="740" alt="Screenshot 2024-06-24 at 4 24 16 PM" src="https://github.com/shwetalsoni/project-management-app/assets/57187745/9cb3981e-c1c8-4896-a1b3-09534a5d661c">
<img width="724" alt="Screenshot 2024-06-24 at 4 20 58 PM" src="https://github.com/shwetalsoni/project-management-app/assets/57187745/ef77169b-b2d2-42e1-aaa8-6fb8036d8c74">
<img width="738" alt="Screenshot 2024-06-24 at 4 22 29 PM" src="https://github.com/shwetalsoni/project-management-app/assets/57187745/d808b0f9-cb8f-47a6-8c68-0d4ec4b58edc">
<img width="286" alt="Screenshot 2024-06-24 at 4 21 43 PM" src="https://github.com/shwetalsoni/project-management-app/assets/57187745/4dcb5f56-da57-480a-91f2-e55bb4b44caa">

## Project setup
1. Project created using ```pnpm create t3-app@latest```
2. Created database on [Supabase](https://supabase.com/)
3. Connected with database using ```DATBASE_URL```
4. Created Prisma models
5. Pushed prisma schema to the database using ```pnpm prisma db push```
6. Installed few other libraries:
   - *bcrypt* - to hash passwords
   - *clsx* - to render css conditionally
   - *formik* - to manage form's state
   - *react-icons* - for icons
   - *react-toastify* - to show messages after an api call
   - *tailwind-merge* - to enable clsx to be used with tailwind 


## Architecture

### Tech stack
- Next.js
- tRPC
- Tailwind CSS
- Typescript
- Prisma
- NextAuth.js

### App flow
**Home** - ```/```

**SignUp** - ```/signUp```
- Once signed up, user need to sign in. Sign in route is built in within NextAuth.
- Once signed in, user will be redirected to ```/projects```. Here all of the user's projects will be displayed.
  
**Projects**
- **Create project** - From ```/projects```, user can go to ```/projects/create``` to create a project.
- Once project is created, user will be redirected to ```/projects/<projectId>```
  
**Project settings** 
- Go to ```/projects/<projectId>/update``` by clicking on settings icon beside project title on top.
- Here user can view and update project's title and description.
- User can **add members** to project using email id. To know more about inviting members to project, go to [Invite Members Flow](#invite-members-flow)
  
**Create Tasks**
- Go to ```/projects/<projectId>/tasks/create``` by clicking on *Add task* button.
- Here user can add task to project by filling in required details.
- Once the task is created, user will be redirected to task details page ```/projects/<projectId>/tasks/<taskId>```.

**Update Task**
- Go to ```/projects/<projectId>/tasks/<taskId>/update``` by clicking on *Update Task* button on task details page.
- Here user can update tasks info(*title*, *description*, *assignee*, *tags*), assign task to any project member.
- User can change task status by clicking on pencil icon beside task status.

### API architecture
The app contains 4 api routes in total among which 3 are protectedProcedures(for authenticated users only), and one publicProcedure for un-authenticated users.

**Protected Procedures**
#### project router
- ```get```
   - Params - `projecId`
   - Condition - User calling api should be member of the project.
   - Returns - Project details, including all its tasks assigneeId(to filter tasks assigned to signed in user).
     
- ```getUserAllProjects```
   - Params - None
   - Condition - User calling api should be member of the project.
   - Returns - All projects that satisfies above condition.

- ```create```
   - Params - `title` `description`
   - Condition - None
   - Returns - The generated project

- ```update```
   - Params - `projectId` `title` `description`
   - Condition - User calling api should be member of the project.
   - Returns - Updated project.

- ```delete```
   - Params - `projectId`
   - Condition - User calling api should be member of the project.
   - Returns - Confirm message

- ```getMember```
   - Params - `projectId`
   - Condition - User calling api should be member of the project.
   - Returns - Members `email` `id` `username`.

- ```addMember```
   - Params - `projectId` `email`
   - Condition - User calling api should be member of the project.
   - Returns -  Confirm message


#### task router
- ```get```
   - Params - `projecId` `taskId`
   - Condition - User calling api should be member of the project.
   - Returns - Task details, including assignee(to show all assignees while updating task).
 
- ```create```
   - Params - `projecId` `title` `description` `tags` `deadline` `assigneeId`
   - Condition - User calling api should be member of the project.
   - Returns - Created task

- ```update```
   - Params - `taskId` `projecId` `title` `description` `tags` `deadline` `assigneeId`
   - Condition - User calling API should be member of the project.
   - Returns - Updated task

- ```updateStatus```
   - Params - `taskId` `projecId` `status`
   - Condition - User calling api should be member of the project.
   - Returns - Confirm message
 
- ```delete```
   - Params - `taskId` `projecId`
   - Condition - User calling api should be member of the project.
   - Returns - Confirm message

#### user router
- ```update```
   - Params - `username`
   - Condition - Signed in user's id should match user id in db
   - Returns - Updated user's `id` `email` `username`

**Public Procedures**
#### signUp router
- ```create```
   - Params - `email` `password`
   - Condition - user with a `passwordHash` should not already exist.
   - Flow:
        - For an existing user with empty `passwordHash` field, `update` user with `passwordHash`.
        - For new user, `create` user
   - Returns - `userId`

### Invite Members Flow
For adding member to project, `email-id` is used. It creates new user with the given `email`, while `password` and `username` are set to null.
Therefore the added user can sign up with their `email`, and create a password, which will lead to user `update`. After signing in, user can set their `username` from the dashboard.

## Testing
For testing [vitest](https://vitest.dev/) is being used.
- Added `vitest.config.ts`. Refer to [https://vitest.dev/config/](https://vitest.dev/config/) for configuring vitest.
- Configured path in vitest config file, to use test environment.
- Spinned up a local database by running `start-database.sh` which is generated while creating our t3 stack app.
- Created a `unit.test.ts` file.
- Using `createInnerTRPCContext` so we don't have to mock Next.js' req/res.
- For creating user session, `Session` type is being imported from `next-auth`.
- Now for tests:
   - For creating test user, `signUp` api need to be called, which is a publicProcedure.
      - Before calling API, context and caller are created without session.
      - Once test user is signed up, session can be generated using user id.
        
Following are the tests done on API:
1. Creating a project when user is not signed in. (Throws error)
2. Creating project when user is signed in. (Return project object)
3. Creating a task by a user who is not a member of project. (Throws error)
4. Creating a task by member of project. (Return task object)
5. Deleting a task by a user who is not a member of project. (Throws error)
6. Deleting a task by a member of project (Returns success message)

  
## Deployment instructions
1. Installed sst [https://ion.sst.dev/docs/](https://ion.sst.dev/docs/)
2. Installed aws cli [https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
3. Generated aws access keys for cli and configured it with `aws configure`
4. Initialized sst for this repo with `sst init`
5. Deployed using `sst deploy`
6. Fixed cross-platform architecture dependencies
   **Prisma** - ```binaryTargets = ["native", "rhel-openssl-3.0.x"]```. Added this to `schema.prisma`

