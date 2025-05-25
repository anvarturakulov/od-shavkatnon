import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Sequelize } from 'sequelize-typescript';
import { query } from 'src/reports/querys/query';
import { queryKor } from 'src/reports/querys/queryKor';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';

export const cashItem = async ( 
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number | null, 
  title: string, 
  stocksService: StocksService,
  oborotsService: OborotsService
) => {
  const promises = [
    query(Schet.S50, TypeQuery.POSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // POSUM
    query(Schet.S50, TypeQuery.KOSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // KOSUM
    queryKor(Schet.S50, Schet.S40, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, oborotsService), // TRADEINCOME
    queryKor(Schet.S50, Schet.S41, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, oborotsService), // ORDERINCOME
    queryKor(Schet.S50, Schet.S60, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, oborotsService), // TRADEINCOME
    queryKor(Schet.S50, Schet.S50, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, oborotsService), // MOVEINCOME
    queryKor(Schet.S50, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, oborotsService), // MOVEOUT
    queryKor(Schet.S20, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, oborotsService), // CHARGES часть 1
    queryKor(Schet.S67, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, oborotsService), // CHARGES часть 2
    queryKor(Schet.S60, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, oborotsService), // FORPARTNERS
    queryKor(Schet.S66, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, oborotsService), // FORFOUNDER
  ];

  const [
    POSUM,
    KOSUM,
    TRADEINCOME40,
    ORDERINCOME41,
    TRADEINCOME60,
    MOVEINCOME,
    MOVEOUT,
    chargesPart1,
    chargesPart2,
    FORPARTNERS,
    FORFOUNDER,
  ] = await Promise.all(promises);

  const CHARGES = chargesPart1 + chargesPart2;

  if (!(POSUM) && !(TRADEINCOME40 + MOVEINCOME) && !(CHARGES + FORPARTNERS + MOVEOUT + FORFOUNDER) && !(KOSUM)) return {};
  return {
    section: title,
    startBalans: POSUM,
    sale: TRADEINCOME40+TRADEINCOME60 + ORDERINCOME41,
    moveIncome: MOVEINCOME,
    allIncome: TRADEINCOME40 + MOVEINCOME + TRADEINCOME60 + ORDERINCOME41,
    charges: CHARGES,
    forPartner: FORPARTNERS,
    moveOut: MOVEOUT,
    forFounder: FORFOUNDER,
    allOut: CHARGES + FORPARTNERS + MOVEOUT + FORFOUNDER,
    endBalans: KOSUM,
  };
};