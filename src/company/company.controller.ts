import { Controller } from '@nestjs/common';
import { Body, Inject, Post, Res, Get } from '@nestjs/common/decorators';
import { Response } from 'express';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('company')
export class CompanyController {
    constructor(
        @Inject(CompanyService) private companyService: CompanyService
    ){} 

    @Post('/')
    async createCompany(
        @Body() data: CreateCompanyDto,
        @Res() res: Response,
    ){
        return await this.companyService.createNewCompany(data, res )
    }

    @Get('/all')
    async getAllCompanies(){
        return await this.companyService.showAllCompanies();
    }
}
