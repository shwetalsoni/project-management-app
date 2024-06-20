import Link from "next/link";

const ProjectCard = () => {
  return (
    <Link href="/projects/1">
      <div className="h-40 w-60 translate-y-1 rounded-xl bg-white p-4 shadow-lg shadow-slate-200 duration-150 ease-in-out hover:scale-95">
        <p className="text-md mb-5 font-medium text-cyan-900">Project Card</p>
        <p className="line-clamp-3 text-sm text-cyan-800">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt
          exercitationem ipsam voluptatibus esse quo. Minus itaque inventore
          culpa consequatur quo dicta, repellendus quam facilis sequi illo, esse
          voluptate quas illum.
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
