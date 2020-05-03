import { Injectable, Inject, Logger } from '@nestjs/common';
import { Item } from './item.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';
import { createHash } from 'crypto';

@Injectable()
export class ItemsService {
    private client: ClientProxy;
    private logger = new Logger('ItemsService'); 

    constructor(
        @InjectRepository(Item)
        private itemsRepository: Repository<Item>,
    ){
        this.client = ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
              host: 'main_ms_data_sharing',
              port: 3001,
            },
        });
    }

    public accumulate(data: number[]) {
        return this.client.send<number, number[]>('add', data);
      }

    /**
    * findAll
    * @return an array with all the Items
    * */
    async findAll(): Promise<Item[]> {
        return this.itemsRepository.find();
    }

    /**
    * findOne 
    * @param a number
    * @return an Item
    * */
    async findOne(id: number): Promise<Item> {
        return this.itemsRepository.findOne(id);
    } 

    /**
    * createItem 
    * @param an Item
    * @return an Item
    * */
    async createItem(item: Item): Promise<Item> {
        const hash = createHash('sha256');
        hash.update(JSON.stringify(item));
        item.itemHash = hash.digest('hex');
        this.logger.log("new item createed with hash: " + item.itemHash);
        return this.itemsRepository.save(item);
    }
    
}
