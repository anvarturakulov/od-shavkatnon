import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKor } from 'src/report/helpers/querys/queryKor';
import { query } from 'src/report/helpers/querys/query';
import { HamirService } from 'src/hamir/hamir.service';
import { Hamir } from 'src/hamir/models/hamir.model';

export const productionItem = ( 
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  title: string, 
  globalEntrys: Array<EntryItem> | undefined,
  hamirs: Hamir[] ) => {
   
  let currentHamirs, currentZagatovka, colHamirs, colZagatovka; 
  let colNon = 0;
  let zuvalaKPI = 0;

    if (hamirs && hamirs.length) {
        currentHamirs = hamirs.filter((item: Hamir) => {
            return (String(item.sectionId) == currentSectionId && item.proveden && item.zuvala && !item.fromHamirchi)
        })
        currentZagatovka = hamirs.filter((item: Hamir) => {
            return (String(item.sectionId) == currentSectionId && item.proveden && item.zuvala && item.fromHamirchi)
        })

        // colNon = currentHamirs.reduce((acc:number, item: HamirModel) => {acc + item.zuvala, 0)
        currentHamirs.forEach((item:Hamir) => {
            if (item.zuvala) colNon += item.zuvala
        });
        
        colHamirs = currentHamirs.length
        colZagatovka = currentZagatovka.length
        if (colHamirs) {
            zuvalaKPI = (colNon / colHamirs)
        }
    }
    

    let idForBuxanka = '65e7048b5c54490bbc335ca2';

    const PDKOL = query(Schet.S28, TypeQuery.PDKOL, startDate, endDate, currentSectionId, '', globalEntrys);
    const PDKOLbux = query(Schet.S28, TypeQuery.PDKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys);
    
    const PKKOL = query(Schet.S28, TypeQuery.PKKOL, startDate, endDate, currentSectionId, '', globalEntrys);
    const PKKOLbux = query(Schet.S28, TypeQuery.PKKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys);

    const OBKOLD2828 = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, String(currentSectionId), '', globalEntrys);
    const OBKOLD2828bux = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
    
    const OBKOLD2820 = queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, String(currentSectionId), '', globalEntrys);;
    const OBKOLD2820bux = queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
    
    const OBKOLK2828 = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), '', globalEntrys);
    const OBKOLK2828bux = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
    
    const OBKOLK2028 = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), '', globalEntrys);
    const OBKOLK2028bux = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);

    const OBKOLK4028 = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), '', globalEntrys);
    const OBKOLK4028bux = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
   
    const TDKOL = query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, '', globalEntrys);
    const TDKOLbux = query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys);
    
    const TKKOL = query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, '', globalEntrys);
    const TKKOLbux = query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys);

  return (
    {
      section: title,
      countHamirs: colHamirs,
      countZagatovka: colZagatovka,
      zuvalaKPI: zuvalaKPI,
      startBalansCountNon: PDKOL-PKKOL-(PDKOLbux-PKKOLbux),
      startBalansCountBux: PDKOLbux-PKKOLbux,
      prodCountNon: OBKOLD2820-OBKOLD2820bux,
      prodCountBux: OBKOLD2820bux,
      moveIncomeCountNon: OBKOLD2828-OBKOLD2828bux,
      moveIncomeCountBux: OBKOLD2828bux,
      saleCountNon: OBKOLK4028-OBKOLK4028bux,
      saleCountBux: OBKOLK4028bux,
      brakCountNon: OBKOLK2028-OBKOLK2028bux,
      brakCountBux: OBKOLK2028bux,
      moveOutNon: OBKOLK2828-OBKOLK2828bux,
      moveOutBux: OBKOLK2828bux,
      endBalansCountNon: PDKOL - PKKOL + TDKOL - TKKOL - (PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux),
      endBlanasCountBux: PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux, 
    }
      
  )
} 