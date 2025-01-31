import { CatsService } from '@/services/api/cats-service';
import { testCat1, testCat2, testCats } from '../data';
import { setUpFetchErrorMock, setUpFetchSuccessMock } from '../utils';
import { Cat } from '@/domain/cat';

// https://github.com/facebook/jest/issues/13834
// https://github.com/jsdom/jsdom/issues/1724
// https://medium.com/fernandodof/how-to-mock-fetch-calls-with-jest-a666ae1e7752

function getService() {
  return new CatsService();
}

describe('Cats service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('get', () => {
    it('should return an cat for valid id', async () => {
      setUpFetchSuccessMock([testCat1]);

      const found = await getService().get({ id: testCat1.id });

      expect(found).toBeDefined();
      expect(found?.id).toEqual('1');
      expect(found?.name).toEqual('Smelly');
      expect(found?.description).toEqual('Smelly cat');
      expect(found?.group).toEqual('Tabby');

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error for invalid id', async () => {
      setUpFetchErrorMock('Not found');

      await expect(getService().get({ id: 'NaN' })).rejects.toThrow(
        'Not found'
      );

      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('all', () => {
    it('should return all cats', async () => {
      setUpFetchSuccessMock([testCats]);

      const results = await getService().all();

      expect(results).toBeDefined();
      expect(results?.length).toEqual(2);
      expect(results[0].id).toEqual('1');
      expect(results[0].name).toEqual('Smelly');
      expect(results[0].description).toEqual('Smelly cat');
      expect(results[0].group).toEqual('Tabby');

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error for invalid id', async () => {
      setUpFetchErrorMock('Not found');

      await expect(getService().all()).rejects.toThrow('Not found');

      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('create cat', () => {
    it('should create a cat', async () => {
      setUpFetchSuccessMock(testCat1);
      const results = await getService().create(
        testCat1.name,
        testCat1.description
      );

      expect(results).toBeDefined();
      expect(results.id).toEqual('1');
      expect(results.name).toEqual('Smelly');

      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a cat for the given cat id', async () => {
      setUpFetchSuccessMock([testCat1]);

      const found = await getService().delete(testCat1.id);

      expect(found).toBeDefined();
      expect(found).toBeTruthy();

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('delete should throw an error for invalid id', async () => {
      setUpFetchErrorMock('Not found');

      await expect(getService().delete('0')).rejects.toThrow('Not found');

      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('update cat', () => {
    it('should update a cat successfully', async () => {
      setUpFetchSuccessMock([testCat1]);
      testCat1.name = testCat1.name + ' updated';
      testCat1.description = testCat1.description + ' updated';
      const updated = await getService().update(testCat1);
      expect(updated.name).toEqual('Smelly updated');
      expect(updated.description).toEqual('Smelly cat updated');
    });
  });

  describe('search cat', () => {
    it('should search cats successfully', async () => {
      setUpFetchSuccessMock([testCats]);

      const updated = await getService().all();
      expect(updated?.length).toEqual(2);

      setUpFetchSuccessMock(testCat2);
      const cat: Cat = await getService().search('Garfield', '');

      expect(cat.name).toEqual('Garfield');
      expect(cat.description).toEqual('Lazy cat');
    });
  });
});
