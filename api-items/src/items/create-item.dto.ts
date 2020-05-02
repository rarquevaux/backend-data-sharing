import  { IsString, IsInt } from 'class-validator';

// Define how data must be transfered 
export class CreateItemDto {
    @IsString() readonly name: string;
    @IsInt() readonly price: number
}