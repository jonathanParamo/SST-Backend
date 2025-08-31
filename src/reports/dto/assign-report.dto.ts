import { IsString, IsNotEmpty } from 'class-validator';

export class AssignReportDto {
  @IsString()
  @IsNotEmpty()
  assignedTo: string;
}
