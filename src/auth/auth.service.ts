import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { config } from 'src/config/config';
import { ActivationDto } from './dto/activation.dto';
import { RegistrationDto } from './dto/registration.dto';
import { randomSigns } from 'src/common/utils/random-signs';
import { hashPwd } from 'src/common/utils/hashPwd';
import { MailService } from 'src/common/providers/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { validateResetPass } from 'src/common/utils/validate-resetpass';

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserService) private userService: UserService,
        @Inject(JwtService) private jwtService: JwtService,
        @Inject(MailService) private mailService: MailService,
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
        } else {
            return 
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

    async login(req: Request, res: Response){
        const { email, password } = req.body;
        
        const searchedUser = await User.findOne({ where: { email }});
        console.log(searchedUser);
        if(!searchedUser){
            res.json({message: "Taki użytkownik nie istnieje"});    
            return;
        } else {
            if(searchedUser.isActive){
                const hashCompareResult = await compare(password, searchedUser.password);
    
                if(!hashCompareResult){
                    res.json({message: "Nieprawidłowe hasło"});
                    return;
                }
            } else {
                res.json({message: "Konto jest nieaktywne"});
                return;
            }
        }


        searchedUser.jwtId = await this.generateNewJwtId();
        await searchedUser.save();

        const payload = { jwtId: searchedUser.jwtId };
        console.log(payload);

        res.cookie('access_token', this.jwtService.sign(payload), {
            secure: false,
            httpOnly: true,
            maxAge: config.jwtCookieTimeToExpire,
          });
      
        return searchedUser;
    }

    async activate(req: { data: ActivationDto }, res: Response){
        try {
            const data: ActivationDto = req.data;
            const result = await User.findOne({
                where: {
                    link: data.urlCode,
                }
            })

            if (!result) {
                return res.json({
                    actionStatus: false,
                    message: 'Niepoprawny link aktywacyjny',
                })
            }

            if(result.isActive){
                return res.json({
                    actionStatus: false,
                    message: 'Ten użytkownik ma już aktywne konto!',
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

            if(!data.firstName || !data.lastName){
                return res.json({
                    actionStatus: false,
                    message: 'Podaj imię i nazwisko',
                })
            }
            
            result.link = null;
            result.isActive = true;
            result.password = await hashPwd(data.password);
            result.firstName = data.firstName;
            result.lastName = data.lastName;
            result.position = data.position;
            
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

                await this.mailService.sendActivationUrl(newUser.email, { activateAccountUrl: `${config.feUrl}/activate/${newUser.link}` });

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

    async resetPassword( data: string, res: Response) {
        try {
            const inputMail = Object.keys(data)[0];
            if(!inputMail){
                return res.status(400).json({
                    ok: false, 
                    message: "Mail nie może być pusty",
                });
            }

            const user = await User.findOne({ where: { email: inputMail }});

        
            if(user){
                user.link = randomSigns(25);
                await user.save();
                await this.mailService.sendForgotPassword(user.email, { forgotPasswordUrl: `${config.feUrl}/restart/${user.link}`} );
                return res.status(200).json({ ok: true, message: 'Na podany adres email został wysłany link do reaktywacji konta' });
            } else {
                return res.status(400).json({ ok: false, message: "Niepoprawny adres email"});
            };
        } catch (error) {
            console.log(error);
        }
    }

    async setNewPassAfterRestart(data: ResetPasswordDto, res: Response){
        try {
            const searchedUser = await User.findOne({ where: { link: data.link }});
            console.log(data);
            if(!searchedUser){
                return res.status(400).json({
                    ok: false,
                    message: "Link wygasł albo jest niepoprawny. Zrestartuj hasło jeszcze raz",
                });
            } 

            const validateRes = validateResetPass(data.password, data.replyPassword);
            
            if(!validateRes.ok){
                return res.status(400).json({
                    ok: false,
                    message: validateRes.message,
                });
            } 

            searchedUser.link = "",
            searchedUser.password = await hashPwd(data.password);

            await searchedUser.save();

            return res.status(200).json({
                ok: true, 
                message: "Poprawnie zmieniono hasło",
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Błąd serwera", error: error});
        }
    }
}
