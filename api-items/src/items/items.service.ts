import { Injectable, Inject, Logger } from '@nestjs/common';
import { Item, ShareMessage } from './item.interface';
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
        item.shared = false;
        this.logger.log("new item created with hash: " + item.itemHash);
        return this.itemsRepository.save(item);
    }


    async shareItem(message: ShareMessage): Promise<any> {
        //check that the item exists
        let item = await this.itemsRepository.findOne(message.id).catch(() => {   
            throw new Error('Cannot find item')
        });
        //check that the item is not already shared
        if (item.shared === true) {
            return "item is already shared";
        } else {
            //send hash and recipient id to ms-data-sharing
            message.hash = item.itemHash;
            item.shared = true;
            this.itemsRepository.save(item);
            return this.client.send<number, ShareMessage>('share', message);
        } 
    }
}

