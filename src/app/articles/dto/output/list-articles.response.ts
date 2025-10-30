export class ArticleSummary {
  id!: number;
  title!: string;
  content!: string;
  userId!: number;
  createdAt!: Date;
  updatedAt!: Date;

  author!: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'reader';
  };
}

export class ListArticlesResponse {
  data!: ArticleSummary[];
  meta!: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
