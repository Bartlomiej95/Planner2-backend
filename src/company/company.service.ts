import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
    constructor(){}

    async createNewCompany(data: CreateCompanyDto, res: Response){
        try {
            console.log(data);
            const searchCompany = await Company.findOne({ where: [{ name: data.name}, { nip: data.nip } ]});
            if(searchCompany){
                res.status(401).json('Taka firma już istnieje');
            };

            const searchUser = await User.findOne({ where: {link: data.urlCode}});
            console.log("searchUser", searchUser);
            if(!searchUser){
                console.log('hellls')
                res.status(404).json('Nie ma takiego użytkownika');
            }

            const newCompany = Company.create();
            newCompany.name = data.name;
            newCompany.nip = data.nip;
            newCompany.administrator = searchUser;
            console.log(newCompany);

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

    async showAllCompanies(){
        try {
            return await Company.find();
        } catch (error) {
            throw new Error(error)
        }
    }

    async getUsersFromCompany(user: User, res: Response){
        try {
            const userWithRelation = await User.findOne({ where: { id: user.id}, relations: { company: true }});
            const searchedCompanyId = userWithRelation.company.id;
            const searchedUsers = await User.findUsersByCompany(searchedCompanyId);
            
            return res.json(searchedUsers);
        } catch (error) {
            throw new Error(error)
        }
    }
}
