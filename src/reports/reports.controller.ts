import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignReportDto } from './dto/assign-report.dto';
import { ReportsService } from './reports.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('create')
  @Roles('admin', 'siso', 'contratista', 'obrero')
  createReport(@Body() dto: CreateReportDto, @Req() req) {
    console.log('req.user:', req.user);
    return this.reportsService.create(dto, req.user.userId);
  }

  @Get('my-reports')
  @Roles('admin', 'siso', 'ingeniero', 'supervisor', 'contratista', 'obrero')
  getMyReports(@Req() req) {
    return this.reportsService.getMyReports(req.user._id);
  }

  @Get('all')
  @Roles('admin', 'siso', 'ingeniero')
  getAllReports() {
    return this.reportsService.getAllReports();
  }

  @Patch(':id/status')
  @Roles('admin', 'siso', 'ingeniero', 'supervisor')
  updateReportStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.reportsService.updateStatus(id, dto);
  }

  @Patch(':id/assign')
  @Roles('admin', 'siso', 'supervisor')
  assignReport(@Param('id') id: string, @Body() dto: AssignReportDto) {
    return this.reportsService.assignReport(id, dto);
  }
}
