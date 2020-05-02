import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
    let itemsController: ItemsController;
    let spyItemsService: ItemsService;
    let moduleRef: TestingModule;

    beforeEach(async () => {
      moduleRef = await Test.createTestingModule({
        controllers: [ItemsController],
        providers: [
          {
            provide: ItemsService,
            useFactory: () => ({
              findOne: jest.fn(() => true),
              findAll: jest.fn(() => true), 
              createItem: jest.fn(() => true),
            }),
          },
        ],
        }).compile();

        spyItemsService = moduleRef.get(ItemsService);
        itemsController = moduleRef.get(ItemsController);
    });

    // get all items
    describe('findAll', () => {
      it('should get all items', async () => {
        itemsController.findAll();
        expect(spyItemsService.createItem).toHaveBeenCalled;
      });
    });

    // get by id
    describe('getById', () => {
      it('should get an item', async () => {
        const item = {
          id: 3,
          name: 'Melanzane',
          price: 7,
        }
        itemsController.getById(item.id);
        expect(spyItemsService.findOne).toHaveBeenCalledWith(item.id);
      });
    });


    // create an item      
    describe('create', () => {
      it('should add an item', async () => {
        const item = {
          name: 'Melanzane',
          price: 7,
        }
        itemsController.create(item);
        expect(spyItemsService.createItem).toHaveBeenCalledWith(item);
      });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

});
