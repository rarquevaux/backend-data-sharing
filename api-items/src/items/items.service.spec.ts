import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { Item } from './item.interface';
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

describe("-- Items Service --", () => {
    let itemService: ItemsService;
    let module: TestingModule;
    let itemRepositoryMock: MockType<Repository<Item>>;
    const item = {id: 1, name: 'Melanzane',price: 6};
    const item2 = {id: 2, name: 'Anchovy',price: 2};
    const item3 = {id: 3, name: 'Pepperoni',price: 4};

    beforeAll(async () => {
      module = await Test.createTestingModule({
        providers: [
          ItemsService,
          { provide: getRepositoryToken(Item), useFactory: repositoryMockFactory },
        ]
     }).compile();

     itemService = module.get<ItemsService>(ItemsService);
     itemRepositoryMock = module.get(getRepositoryToken(Item));
    });

    describe('createItem', () => {
        it('should save an item in the database', async () => {
          
          itemRepositoryMock.save = jest.fn();
          await itemService.createItem(item);
    
          expect(itemRepositoryMock.save).toHaveBeenCalledWith(
            Object.assign(new Item(), item),
            );
          });
      });

    describe('findOne', () => {
        it('should return the item which id was passed', () => {
          
          itemRepositoryMock.findOne.mockReturnValue(item);
          return itemService.findOne(item.id).then(data => {
            expect(data).toEqual(item);
            });
        });
        
        it('should have been called with id', async () => {
          itemService.findOne(item.id);
          expect(itemRepositoryMock.findOne).toHaveBeenCalledWith(item.id);
        });
          

      });

    describe('findAll', () => {
        it('should return all items', async () => {

          const items: Item[] = [];
          items.push(item);
          items.push(item2);
          items.push(item3);

          itemRepositoryMock.find.mockReturnValue(items);
          return itemService.findAll().then(data => {
            expect(data).toEqual(items);
          });
          
        });

        it('should have been called', async () => {
          itemService.findAll;
          expect(itemRepositoryMock.find).toHaveBeenCalled();
        });
      });
  });


// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    findOne: jest.fn(entity => entity),
    find: jest.fn(),
    save: jest.fn()
   }));
export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
   };