import { QuerySimple } from "src/interfaces/report.interface";

export const PDSUM = (req: QuerySimple) => {
    const { reportType, typeQuery, sectionId, schet, dk, workerId, name,
        startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, firstPrice, secondPrice} = req;

    const replacements: { [key: string]: any } = {};

    let query = ` SELECT SUM(total) as total
                  FROM entries
                  WHERE `
            
    if (schet !== null && schet !== undefined) {
        query += ` debet = :schet`;
        replacements.schet = schet;
    }

    if (startDate !== null && startDate !== undefined) {
        query += ` AND date < :startDate`;
        replacements.startDate = startDate;
    }            

    if (firstSubcontoId !== null && firstSubcontoId !== undefined) {
        query += ` AND debetFirstSubcontoId = :firstSubcontoId`;
        replacements.firstSubcontoId = firstSubcontoId;
    }

    if (secondSubcontoId !== null && secondSubcontoId !== undefined) {
        query += ` AND debetSecondSubcontoId = :secondSubcontoId`;
        replacements.secondSubcontoId = secondSubcontoId;
    }

    if (thirdSubcontoId !== null && thirdSubcontoId !== undefined) {
        query += ` AND debetThirdSubcontoId = :thirdSubcontoId`;
        replacements.thirdSubcontoId = thirdSubcontoId;
    }

    let stopQuery = (!schet || !startDate) ? true : false
    return {query, replacements, stopQuery}
}