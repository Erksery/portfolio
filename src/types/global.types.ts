import type { ReactNode } from "react";

export type TechType = {
  id: string;
  title: string;
  icon: ReactNode;
  color?: string;
  description?: string;
};

export type Stack = {
  id: string;
  title: string;
  icon: ReactNode;
  items: TechType[];
};

export type ProjectLanguage = {
  id: string;
  name: string;
  ratio: number;
};

export type ProjectTechnology = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  title: string;
  image: string | null;
  link: string;
  description: string;
  languages: ProjectLanguage[];
  technologies: ProjectTechnology[];
};
