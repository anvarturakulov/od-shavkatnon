import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export enum UserRoles {
  ADMIN = 'ADMIN',
  HEADCOMPANY = 'HEADCOMPANY',
  ZAMGLBUX = 'ZAMGLBUX',
  GLBUX = 'GLBUX',
  ELAKCHI = 'ELAKCHI',
  HAMIRCHI = 'HAMIRCHI',
  TANDIR = 'TANDIR',
  HEADSECTION = 'HEADSECTION',
  DELIVERY = 'DELIVERY',
  SELLER = 'SELLER',
  GUEST = 'GUEST',
  ZP = 'ZP',
  KASSIR = 'KASSIR'
}

export class AuthDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsEnum(UserRoles)
  @IsOptional()
  role: UserRoles;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  storageId: string;

  @IsString()
  @IsOptional()
  tandirId: string;

  @IsString()
  @IsOptional()
  productId: string;

  @IsBoolean()
  @IsOptional()
  deleted?: boolean

}
