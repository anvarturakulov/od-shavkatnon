import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED_ERROR, USER_NOT_FOUND_ERROR } from './auth.constants';
import { JwtAuthGuard } from './guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/ad-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR)
    }
    return this.authService.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() {login, password}: AuthDto) {
    const { email, role, name, storageId, productId } = await this.authService.validateUser(login, password);
    return this.authService.login(email, role, name, storageId, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('markToDelete/:id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const markedDoc = await this.authService.markToDelete(id);
    if (!markedDoc) {
      throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getAllReferences() {
    return this.authService.getAllUsers()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const user = await this.authService.findById(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    const newUser = {
      _id: user._id,
      name: user.name, 
      login:user.email,
      password: user.passwordHash,
      productId: user.productId,
      role: user.role,
      storageId: user.storageId,
      tandirId: user.tandirId,
    }
    
    return newUser;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: AuthDto) {
    const updatedProduct = await this.authService.updateById(id, dto);
    if (!updatedProduct) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    return updatedProduct;
  }
}
