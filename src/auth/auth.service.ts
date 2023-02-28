import { Injectable, Inject } from '@nestjs/common';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { config } from 'src/config/config';
import { ActivationDto } from './dto/activation.dto';
import { RegistrationDto } from './dto/registration.dto';
import { randomSigns } from 'src/common/utils/random-signs';
import { hashPwd } from 'src/common/utils/hashPwd';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserService) private userService: UserService,
        @Inject(JwtService) private jwtService: JwtService,
    ){}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await User.findOne({
            where: { email }
        });

        if(user){
            const hashCompareResult = await compare(password, user.password);

            if(hashCompareResult){
                return user;
            }
        }

        return null
    }

    async generateNewJwtId(): Promise<string> {
        let newJwtId: string;
        let isUniqueness: boolean;
        
        do {
          newJwtId = uuid();
          const user = await User.findOne({ where: { jwtId: newJwtId}})
          
          if(user){
            isUniqueness = false
          } else {
            isUniqueness = true
          }
            
        } while (!isUniqueness);
    
        return newJwtId;
      }

    async login(user: User, res: Response){
        console.log(user);
        user.jwtId = await this.generateNewJwtId();
        await user.save();

        const payload = { jwtId: user.jwtId };
        console.log(payload);

        res.cookie('access_token', this.jwtService.sign(payload), {
            secure: false,
            httpOnly: true,
            maxAge: config.jwtCookieTimeToExpire,
          });
      
        return user;
    }

    async activate(data: ActivationDto, res: Response){
        try {
            
            const result = await User.findOne({
                where: {
                    email: data.email
                }
            })

            if (!result) {
                return res.json({
                    actionStatus: false,
                    message: 'Użytkownik o podanym adresie email nie istnieje',
                })
            }

            if (result.link !== data.urlCode) {
                return res.json({
                    actionStatus: false,
                    message: 'niepoprawny kod aktywacyjny',
                })
            }

            if (data.password.length < 8) {
                return res.json({
                    actionStatus: false,
                    message: 'Hasło jest za krótkie',
                })
            }
            
            result.link = null;
            result.isActive = true;
            result.password = await hashPwd(data.password);

            await result.save();

            res.json({
                actionStatus: true,
                message: 'Hasło nadane, konto jest aktywne',
            })
        } catch (err) {
            res
                .status(500)
                .json({
                    actionStatus: false,
                    message: 'Błąd serwera',
                })
        }
    }

    async register(data: RegistrationDto, res: Response){
        try {
            const email = await User.findOne({
                where: {
                    email: data.email
                }
            })

            if(!email){

                const newUser = new User();
                newUser.link = randomSigns(25);
                newUser.email = data.email;

                await newUser.save();

                // await sendActivationLink(newUser.link, newUser.email, 'test');

                return res.json({
                    message: "Na podany adres email został wysłany link aktywacyjny."
                })
                
            } else {
                return res.json({
                    message: "Podany adres email już istnieje w bazie."
                })
            }

        } catch (error) {
            console.log(error);
            res.status(500)
                .json({ message: "Błąd serwera"})
        }
    }

    async logout(user: User, res: Response): Promise<{ ok: boolean}> {
        if (!user?.jwtId) return { ok: false };
    
        user.jwtId = null;
        await user.save();
    
        res.clearCookie('access_token', {
          secure: false,
          httpOnly: true,
          maxAge: config.jwtCookieTimeToExpire,
        });
    
        return { ok: true };
      }
}
