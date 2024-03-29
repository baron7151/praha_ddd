// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class PostUserDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly user_name!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly email!: string
}
