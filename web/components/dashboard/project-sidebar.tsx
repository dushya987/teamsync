"use client";

import { FolderKanban } from "lucide-react";

interface Props {
  projects: any[];
  selectedProject: any;
  onSelect: (id: string) => void;
}

export function ProjectSidebar({ projects, selectedProject, onSelect }: Props) {
  return (
    <aside className="rounded-[8px] border border-gray-200 bg-white p-4 shadow-sm md:min-h-[calc(100vh-48px)]">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#2563EB] font-bold text-white">
          TS
        </div>

        <div>
          <h1 className="text-[22px] font-semibold text-gray-900">TeamSync</h1>

          <p className="text-[13px] text-gray-500">Workspace</p>
        </div>
      </div>

      <nav className="mb-6">
        <button className="flex w-full cursor-default items-center gap-2 rounded-[6px] bg-blue-50 px-3 py-2.5 text-left text-[15px] font-medium text-[#1E40AF]">
          <FolderKanban size={17} />
          Projects
        </button>
      </nav>

      <p className="mb-2 text-[13px] font-medium tracking-wide text-gray-400">
        ACTIVE PROJECTS
      </p>

      <div className="space-y-2">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelect(project.id)}
            className={`w-full cursor-pointer rounded-[6px] border px-3 py-3 text-left transition-colors duration-150 ${
              selectedProject?.id === project.id
                ? "border-blue-200 bg-blue-50 text-[#1E40AF]"
                : "border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50"
            }`}
          >
            <p className="font-medium">{project.name}</p>

            <p className="mt-1 text-[13px] text-gray-500">
              {project.members?.length ?? 0} members
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
}
