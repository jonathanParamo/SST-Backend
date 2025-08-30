import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async create(from: string, to: string, text: string): Promise<Message> {
    const newMessage = new this.messageModel({
      id: uuidv4(),
      from,
      to,
      text,
    });
    return newMessage.save();
  }

  async getConversation(userA: string, userB: string): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { from: userA, to: userB },
          { from: userB, to: userA },
        ],
      })
      .sort({ createdAt: 1 });
  }
}
