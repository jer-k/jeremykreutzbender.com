export type DescriptionLink = {
  text: string;
  url: string;
  internal?: boolean;
};

export type DescriptionListItem = {
  text?: string;
  content?: (string | DescriptionLink)[];
  children?: DescriptionListItem[];
};

export type Job = {
  companyName: string;
  companyUrl?: string;
  workType: "Remote" | "On-Site";
  duration: string;
  title: string;
  descriptionMarkdown: string;
};

export type Project = {
  name: string;
  url: string;
  descriptionMarkdown: string;
};

export type School = {
  institutionName: string;
  institutionUrl: string;
  department?: string;
  departmentUrl?: string;
  location: string;
  locationUrl: string;
  duration: string;
  degree?: string;
  achievement?: string;
};

export type Cv = {
  personalInfo: {
    name: string;
    location: string;
    locationUrl: string;
    avatarUrl: string;
    avatarFallback: string;
  };
  about: {
    summary: string;
  };
  jobs: Job[];
  projects: Project[];
  skills: {
    languages: string[];
    technologies: string[];
  };
  schools: School[];
};
