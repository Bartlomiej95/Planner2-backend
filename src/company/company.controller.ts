import { Controller } from '@nestjs/common';
import { Body, Inject, Post, Res, Get, UseGuards } from '@nestjs/common/decorators';
import { Response } from 'express';
import { UserObj } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
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

    @Get('/users')
    @UseGuards(JwtAuthGuard)
    async getUsersFromCompany(
        @UserObj() user: User,
        @Res() res: Response,
    ){
        return await this.companyService.getUsersFromCompany(user, res);   
    }
}
