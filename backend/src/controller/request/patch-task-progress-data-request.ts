// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class PatchTaskProgressDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly task_progress_id!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly task_status!: string
}
