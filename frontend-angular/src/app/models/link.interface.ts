export interface Link {
  _id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  votes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  linkId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
