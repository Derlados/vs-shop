import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './models/payment.model';

@Injectable()
export class PaymentsService {
    constructor(@InjectRepository(Payment) private paymentsRepository: Repository<Payment>) { }

    getAll() {
        return this.paymentsRepository.find();
    }
}
