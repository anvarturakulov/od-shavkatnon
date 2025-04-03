import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { OborotsService } from 'src/oborots/oborots.service';
import { queryKorFull } from 'src/reports/querys/queryKorFull';

export const givingItem = async ( 
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number, 
  title: string, 
  oborotsService: OborotsService
) => {    
    const glBuxId = -1;

    const promises = [
        queryKorFull(Schet.S20, Schet.S50, TypeQuery.OS, startDate, endDate, null, currentSectionId, null, glBuxId, -1, null, oborotsService),
        queryKorFull(Schet.S60, Schet.S50, TypeQuery.OS, startDate, endDate, currentSectionId, null, null, glBuxId, -1, null, oborotsService),
        queryKorFull(Schet.S50, Schet.S50, TypeQuery.OS, startDate, endDate, currentSectionId, null, null, glBuxId, -1, null, oborotsService),
        queryKorFull(Schet.S67, Schet.S50, TypeQuery.OS, startDate, endDate, currentSectionId, null, null, glBuxId, -1, null, oborotsService),
    ];

    const results = await Promise.all(promises);
    const OBSUM50 = results.reduce((sum, value) => sum + value, 0);

    if (!OBSUM50) return {};
    return { 
        section: title,
        giving: OBSUM50 
    };
};