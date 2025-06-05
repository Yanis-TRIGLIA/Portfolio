export type Blog_table = {
  id: number;
  cover: string;
  created_at: string;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  
};

export type Tag_table = {
  id: number;
  categories: string;
  name: string;
  master_percentage	: number;

};


export type Project_table = {
  id: number;
  name: string;
  created_at: string;
  decription: string;
  images: string;
  tags: Tag_table[];

  
};

export type Blog = Blog_table;
export type Tag = Tag_table;
export type Project = Project_table;