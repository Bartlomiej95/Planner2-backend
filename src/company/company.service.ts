import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
    constructor(){}

    async createNewCompany(user: User, data: CreateCompanyDto, res: Response){
        try {
            const searchCompany = await Company.findOne({ where: [{ name: data.name}, { nip: data.nip } ]});
            if(searchCompany){
                throw new Error(`Taka firma już istnieje`);
            }

            const newCompany = Company.create();
            newCompany.name = data.name;
            newCompany.nip = data.nip;
            newCompany.administrator = user;

            await newCompany.save();

            res.status(200)
                .json({
                    ok: true,
                    message: `Założono konto nowej firmy o nazwie ${newCompany.name}`,
                })

            
        } catch (error) {
            res.status(500)
                .json({ error })
        }
    }
}
