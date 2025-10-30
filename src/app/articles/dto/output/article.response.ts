export class ArticleResponse {
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
