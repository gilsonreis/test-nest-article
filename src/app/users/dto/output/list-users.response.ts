export class UserSummary {
  id!: number;
  name!: string;
  email!: string;
  role!: 'admin' | 'editor' | 'reader';
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListUsersResponse {
  data!: UserSummary[];
  meta!: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
