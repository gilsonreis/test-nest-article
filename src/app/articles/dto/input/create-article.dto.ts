import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsInt()
  @Min(1)
  userId!: number; // autor do artigo
}