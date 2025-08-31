import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}
