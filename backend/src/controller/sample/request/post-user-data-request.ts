// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IS_NOT_EMPTY, IsNotEmpty, IsNumber } from 'class-validator'

export class PostSomeDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  name!: string

  @ApiProperty()
  @IsNotEmpty()
  email!: string
}
