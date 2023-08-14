// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class PatchPairDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly pair_id!: string

  @ApiProperty()
  readonly pair_name?: string

  @ApiProperty()
  readonly team_id?: string

  @ApiProperty()
  @IsArray()
  readonly user_ids?: string[]
}
