import { SendActivationNotifyDto } from '../dto/SendActivationNotify.dto';

export interface IActivationService<> {
  sendActivationNotify(dto: SendActivationNotifyDto): Promise<void>;
}

export const IActivationService = Symbol('IActivationService');
