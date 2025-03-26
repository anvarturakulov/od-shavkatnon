import { QuerySimple, Schet, TypeQuery } from "src/interfaces/report.interface";
import { StocksService } from "src/stocks/stocks.service";

export const POKOL = async (
    schet: Schet | null,  
    typeQuery: TypeQuery | null, 
    startDate: number | null, 
    endDate: number | null, 
    firstSubcontoId: number | null, 
    secondSubcontoId: number | null,
    thirdSubcontoId: number | undefined | null,
    stocksService: StocksService
) => {
    
    if (schet && startDate && firstSubcontoId) {
        return (await stocksService.getStockByDate( schet, firstSubcontoId, secondSubcontoId, startDate)).remainCount
    } else return 0
}