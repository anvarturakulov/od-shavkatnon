import { TypeReference, TypeSECTION } from 'src/interfaces/reference.interface';
import { skladItem } from './skladItem';
import { Reference } from 'src/references/reference.model';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';

export const sklad = async (
  data: any,
  startDate: number | null,
  endDate: number | null,
  stocksService: StocksService,
  oborotsService: OborotsService
) => {
  console.log('Input data:', data);
  console.log('Data length:', data?.length);
  console.log('startDate:', startDate);
  console.log('endDate:', endDate);

  let result: any[] = [];
  let filteredData: Reference[] = [];

  if (!data || !data.length) {
    console.log('No data provided');
    return {
      reportType: 'SKLAD',
      values: [],
    };
  }

  filteredData = data.filter((item: Reference) => {
    return (
      item &&
      item.typeReference === TypeReference.STORAGES &&
      item.refValues &&
      !item.refValues.markToDeleted &&
      (item.refValues.typeSection === TypeSECTION.STORAGE || item.refValues.typeSection === TypeSECTION.FILIAL)
    );
  });

  console.log('filteredData:', filteredData);

  for (const item of filteredData) {
    let element = await skladItem(data, startDate, endDate, item.id, item.name, stocksService, oborotsService);
    if (Object.keys(element).length) {
      result.push(element);
    }
  }

  return {
    reportType: 'SKLAD',
    values: [...result],
  };
};