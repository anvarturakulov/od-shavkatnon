import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        // const obj = plainToClass(metadata.metatype, value)
        // const errors = await validate(obj)
        throw new Error("Method not implemented.");
        
    }

}