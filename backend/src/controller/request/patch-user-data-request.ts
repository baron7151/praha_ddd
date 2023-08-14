// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class PatchUserDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly user_id!: string

  @ApiProperty()
  readonly user_name?: string

  @ApiProperty()
  readonly email?: string

  @ApiProperty()
  readonly status?: string

  @ApiProperty()
  readonly pair_id?: string

  @ApiProperty()
  readonly team_id?: string
}
