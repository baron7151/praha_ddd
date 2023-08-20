// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class PatchTeamDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly team_id!: string

  @ApiProperty()
  @IsString()
  readonly team_name?: string
}
