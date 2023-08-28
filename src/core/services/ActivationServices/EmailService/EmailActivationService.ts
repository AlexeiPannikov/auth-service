import { Injectable } from '@nestjs/common';
import { IEmailService } from './interface/IEmailService';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as process from 'process';
import { SendActivationNotifyDto } from '../dto/SendActivationNotify.dto';
import { MailOptions } from 'nodemailer/lib/smtp-pool';

@Injectable()
export class EmailActivationService implements IEmailService {
  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    null;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationNotify(dto: SendActivationNotifyDto): Promise<void> {
    const mail: MailOptions = {
      from: process.env.SMTP_USER,
      to: dto.to,
      subject: `Account activation ${process.env.API_URL}`,
      text: '',
      html: `
                <div>
                    <h1>To activate follow the link</h1>
                    <a href="${dto.link}">${dto.link}</a>
                </div>
            `,
    };
    await this.transporter.sendMail(mail);
  }
}
