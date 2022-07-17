import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {

    constructor(private paymentsService: PaymentsService) { }

    @Get()
    getAllPayments() {
        return this.paymentsService.getAll();
    }

    @Post()
    createPaymentMethod() {
        //TODO
    }
}
