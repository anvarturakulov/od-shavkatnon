import { QuerySimple } from "src/interfaces/report.interface";

export const TKKOL = (req: QuerySimple) => {
    const { reportType, typeQuery, sectionId, schet, dk, workerId, name,
        startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, firstPrice, secondPrice} = req;

    const replacements: { [key: string]: any } = {};
    
    let query = ` SELECT SUM(count) as total
                  FROM entries
                  WHERE `
            
    if (schet !== null && schet !== undefined) {
        query += ` kredit = :schet`;
        replacements.schet = schet;
    }

    if (startDate !== null && startDate !== undefined) {
        query += ` AND date >= :startDate`;
        replacements.startDate = startDate;
    }
    
    if (endDate !== null && endDate !== undefined) {
        query += ` AND date <= :endDate`;
        replacements.endDate = endDate;
    }

    if (firstSubcontoId !== null && firstSubcontoId !== undefined) {
        query += ` AND kreditFirstSubcontoId = :firstSubcontoId`;
        replacements.firstSubcontoId = firstSubcontoId;
    }

    if (secondSubcontoId !== null && secondSubcontoId !== undefined) {
        query += ` AND kreditSecondSubcontoId = :secondSubcontoId`;
        replacements.secondSubcontoId = secondSubcontoId;
    }

    if (thirdSubcontoId !== null && thirdSubcontoId !== undefined) {
        query += ` AND kreditThirdSubcontoId = :thirdSubcontoId`;
        replacements.thirdSubcontoId = thirdSubcontoId;
    }

    let stopQuery = (!schet || !startDate || !endDate) ? true : false
    return {query, replacements, stopQuery}
}