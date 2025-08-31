import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo?: string;

  @Prop({
    required: true,
    enum: ['pending', 'in_progress', 'closed'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: [String] })
  attachments?: string[];

  @Prop()
  type?: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
