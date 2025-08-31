import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignReportDto } from './dto/assign-report.dto';
import { ReportsGateway } from './reports.gateway';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private readonly usersService: UsersService,
    private readonly reportsGateway: ReportsGateway,
  ) {}

  // Crear
  async create(dto: CreateReportDto, userId: string): Promise<Report> {
    const newReport = new this.reportModel({
      ...dto,
      createdBy: userId,
    });

    const savedReport = await newReport.save();

    const rolesAllowed = ['admin', 'siso', 'ingeniero', 'supervisor'];
    this.reportsGateway.notifyNewReport(savedReport, rolesAllowed);

    return savedReport;
  }

  // Obtener
  async getMyReports(userId: string): Promise<Report[]> {
    return this.reportModel.find({ createdBy: userId }).exec();
  }

  // Obtener reportes (solo para roles con permiso)
  async getAllReports(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  // Actualizar reporte
  async updateStatus(id: string, dto: UpdateStatusDto): Promise<Report> {
    const updatedReport = await this.reportModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updatedReport) {
      throw new NotFoundException('Reporte no encontrado');
    }

    const rolesAllowed = ['admin', 'siso', 'ingeniero', 'supervisor'];
    this.reportsGateway.notifyReportUpdated(updatedReport, rolesAllowed);

    return updatedReport;
  }

  async assignReport(id: string, dto: AssignReportDto): Promise<Report> {
    const user = await this.usersService.findById(dto.assignedTo);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const updatedReport = await this.reportModel.findByIdAndUpdate(
      id,
      {
        assignedTo: { id: (user as any)._id, name: user.name, role: user.role },
      },
      { new: true },
    );
    if (!updatedReport) {
      throw new NotFoundException('Reporte no encontrado');
    }

    const rolesAllowed = ['admin', 'siso', 'supervisor'];
    this.reportsGateway.notifyReportAssigned(updatedReport, rolesAllowed);

    return updatedReport;
  }
}
