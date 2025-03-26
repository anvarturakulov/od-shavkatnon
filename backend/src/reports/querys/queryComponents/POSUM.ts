import { Schet, TypeQuery } from "src/interfaces/report.interface";
import { StocksService } from "src/stocks/stocks.service";

export const POSUM = async (
    schet: Schet | null, 
    typeQuery: TypeQuery | null, 
    startDate: number | null, 
    endDate: number | null,  
    firstSubcontoId: number | undefined | null, 
    secondSubcontoId: number  | null,
    thirdSubcontoId: number | null,
    stocksService: StocksService
) => {

    if (schet && startDate && firstSubcontoId) {
        return (await stocksService.getStockByDate( schet, firstSubcontoId, secondSubcontoId, startDate)).remainTotal
    } else return 0
}