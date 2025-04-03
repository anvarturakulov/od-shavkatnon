import { Schet, TypeQuery } from "src/interfaces/report.interface";
import { OborotsService } from "src/oborots/oborots.service";

export const OK = async (
    debet: Schet,
    kredit: Schet,
    typeQuery: TypeQuery,
    startDate: number | null,
    endDate: number | null,
    debetFirstSubcontoId: number | null, 
    debetSecondSubcontoId: number | null,
    debetThirdSubcontoId: number | null,
    kreditFirstSubcontoId: number | null, 
    kreditSecondSubcontoId: number | null,
    kreditThirdSubcontoId: number | null,
    oborotsService: OborotsService
) => {
    
    return (
        await oborotsService.getOborotByDate('COUNT', startDate, endDate, 
                debet, debetFirstSubcontoId, debetSecondSubcontoId, debetThirdSubcontoId, 
                kredit, kreditFirstSubcontoId, kreditSecondSubcontoId, kreditThirdSubcontoId)
        ).result
}