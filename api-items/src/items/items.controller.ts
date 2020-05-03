import { 
  Get,
  Post, 
  Body, 
  Controller, 
  UsePipes, 
  Param, 
  Put, 
  Delete,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Logger,
 } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item, ShareMessage } from './item.interface';
import { ValidationPipe } from '../common/validation.pipe';
import { CreateItemDto } from './create-item.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class ItemsController {
  private logger = new Logger('ItemsController'); 
  constructor(private readonly itemsService: ItemsService) {}

  @Get('items')
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post('items')
  @UsePipes (new ValidationPipe())
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.createItem(createItemDto);
  }

  @Get('items/:id')
  async getById(@Param('id') id: number): Promise<Item> {
    const itemInfo = await this.itemsService.findOne(id);
    if(!itemInfo){
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return itemInfo
  }

  // TODO
  @UseGuards(AuthGuard('jwt'))
  @Delete('items/:id')
  delete(@Param('id') id: number) {
    //this.itemsService.delete(id);
    throw new BadRequestException();
  } 

  //@UseGuards(AuthGuard('jwt'))
  @Post('share')
  async share(@Body() message: ShareMessage): Promise<any> {
    const itemInfo = await this.itemsService.findOne(message.id);
    if(!itemInfo){
      this.logger.log('Item not found');
      throw new NotFoundException(`Item with id ${message.id} not found`);
    } else {
      this.logger.log('Sharing ' + message.id + " with " + message.recipientId);
      return this.itemsService.shareItem(message);
    }
  }
}