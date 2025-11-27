import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateUrlDto {
  @IsUrl({}, { message: 'URL must be a valid URL' })
  @IsNotEmpty({ message: 'URL is required' })
  url: string;
}
