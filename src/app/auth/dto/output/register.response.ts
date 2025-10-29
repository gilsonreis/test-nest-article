export class RegisterResponse {
  id!: number;
  name!: string;
  email!: string;
  role!: 'admin' | 'editor' | 'reader';
}
