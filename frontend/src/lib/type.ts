export type Blog_table = {
  id: number;
  cover: string;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  
};

export type Tag_table = {
  id: number;
  categories: string;
  name: string;
  master_percentage	: number;
  created_at: string;

};


export type Project_table = {
  id: number;
  name: string;
  created_at: string;
  description: string;
  images: string;
  tag: Tag_table[];
  link_project: string;
  github_project: string;
};

export type Blog = Blog_table;
export type Tag = Tag_table;
export type Project = Project_table;