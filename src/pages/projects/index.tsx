import ProjectCard from "@/components/ProjectCard";
import SignOut from "@/components/SignOut";
import Head from "next/head";
import Link from "next/link";

export default function Projects() {
  return (
    <>
      <Head>
        <title>Projects page</title>
        <meta
          name="description"
          content="Displays all projects created by user"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" justify-left flex min-h-screen flex-col bg-white px-28 py-16">
        <div className="mb-10 flex items-center">
          <h1 className="flex-1 text-2xl font-medium">My Projects</h1>
          <button className="mr-5 rounded-full bg-cyan-700 px-5 py-2 text-white">
            Create Project
          </button>
          <SignOut />
        </div>
        {/* show created projects */}
        <div className="flex flex-wrap gap-6">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i}>
              <ProjectCard />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
