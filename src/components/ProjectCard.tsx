import Link from "next/link";

type ProjectCardProps = {
  id: number;
  title: string;
  description: string;
};

const ProjectCard = ({ id, title, description }: ProjectCardProps) => {
  return (
    <Link href={`/projects/${id}`}>
      <div className="h-40 w-60 translate-y-1 rounded-xl bg-white p-4 shadow-lg shadow-slate-200 duration-150 ease-in-out hover:scale-95">
        <p className="text-md mb-5 font-medium text-cyan-900">{title}</p>
        <p className="line-clamp-3 text-sm text-cyan-800">{description}</p>
      </div>
    </Link>
  );
};

export default ProjectCard;
