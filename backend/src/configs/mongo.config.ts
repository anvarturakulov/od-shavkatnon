import { ConfigService } from '@nestjs/config';

const getMongoString = (configService: ConfigService) => 
  'mongodb://'+
  configService.get('MONGO_LOGIN2')+
  ':'+
  configService.get('MONGO_PASSWORD2')+
  '@'+
  configService.get('MONGO_HOST2') +
  ':' +
  configService.get('MONGO_PORT2');
  // '/'+
  // configService.get('MONGO_AUTHDATABASE2');

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})