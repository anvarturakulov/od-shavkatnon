import { Schet, TypeQuery } from "src/interfaces/report.interface";

export const COUNTCOME = (
    schet: Schet | null, 
    typeQuery: TypeQuery | null, 
    startDate: number | null, 
    endDate: number | null, 
    firstSubcontoId: number | undefined | null, 
    secondSubcontoId: number | undefined | null,
    thirdSubcontoId: number | undefined | null
) => {

    const replacements: { [key: string]: any } = {};
    
    let query = ` SELECT SUM(count) as total
                  FROM entries
                  WHERE `
            
    if (schet !== null && schet !== undefined) {
        query += ` debet = :schet`;
        replacements.schet = schet;
    }

    if (endDate !== null && endDate !== undefined) {
        query += ` AND date < :endDate`;
        replacements.endDate = endDate;
    }            

    if (firstSubcontoId !== null && firstSubcontoId !== undefined) {
        query += ` AND "debetFirstSubcontoId" = :firstSubcontoId`;
        replacements.firstSubcontoId = firstSubcontoId;
    }

    if (secondSubcontoId !== null && secondSubcontoId !== undefined) {
        query += ` AND "debetSecondSubcontoId" = :secondSubcontoId`;
        replacements.secondSubcontoId = secondSubcontoId;
    }

    if (thirdSubcontoId !== null && thirdSubcontoId !== undefined) {
        query += ` AND "debetThirdSubcontoId" = :thirdSubcontoId`;
        replacements.thirdSubcontoId = thirdSubcontoId;
    }

    let stopQuery = (!schet || !endDate) ? true : false

    return {query, replacements, stopQuery}
}