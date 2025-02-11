import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthDto, UserRoles } from './dto/auth.dto';
import { User, UserDocument } from './models/user.model';
import { Model } from 'mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
    ) { }

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
      role: dto.role,
      name: dto.name,
      storageId: dto.storageId
    })

    return newUser.save()
  }

  async findUser(email: string) {
    return this.userModel.findOne({email}).exec();
  }

  async findUserByName(name: string) {
    return this.userModel.findOne({ name }).exec();
  }

  // Promise<Pick<User, 'email' >>
  async validateUser(email: string, password: string) {
    const user = await this.findUser(email);
    if (!user || (user && user.deleted)) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return { email: user.email, role: user.role, name: user.name, storageId: user.storageId, productId: user.productId }
  }

  async login(email: string, role: UserRoles, name: string, storageId: string, productId: string) {
    const payload = { email };
    return {
      email,
      role,
      access_token: await this.jwtService.signAsync(payload),
      name,
      storageId,
      productId,
    }
  }

  async markToDelete(id: string) {
   const user = await this.userModel.findOne({_id: id})
    if (!user?.name) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    const state = user.deleted ? false : true
    return this.userModel.updateOne({ _id: id }, { $set: { deleted: state} })
  }
 
  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec()
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async updateById(id: string, dto: AuthDto) {
    return this.userModel.updateOne({ _id: id }, { $set: dto })
  }
}
