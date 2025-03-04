import { Schet } from 'src/interfaces/report.interface';
import { FounderObject } from './prepareEntrysList';
import { Document } from 'src/documents/document.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocSTATUS, DocumentType } from "src/interfaces/document.interface";

export interface ResultgetValuesForEntry {
  debet: Schet
  debetFirstSubcontoId: number | null
  debetSecondSubcontoId: number | null
  debetThirdSubcontoId?: number | null
  kredit: Schet
  kreditFirstSubcontoId: number | null
  kreditSecondSubcontoId: number | null
  kreditThirdSubcontoId?: number | null
  count: number
  total: number
  description?: string
}

export const getValuesForEntry = (doc: Document, newEntry: boolean, hasTable: boolean, tableItem: DocTableItems | undefined, isCash: boolean, founders: Array<FounderObject>): ResultgetValuesForEntry => {
  if (doc) {
    let documentType = doc.documentType;
    let { receiverId, senderId, analiticId, count, total, cashFromPartner, isPartner, isWorker, isFounder } = doc.docValues
    
    const leaveComeTMZObj = {
      debetFirstSubcontoId: receiverId,
      debetSecondSubcontoId: analiticId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: analiticId,
      count,
      total,
    }

    let leaveMaterialWithTable = {
        debetFirstSubcontoId: senderId,
        debetSecondSubcontoId: receiverId,
        kreditFirstSubcontoId: senderId,
        kreditSecondSubcontoId: (hasTable && doc.docTableItems?.length && !newEntry && tableItem?.analiticId) ? tableItem.analiticId : null,
        count: (hasTable && doc.docTableItems?.length && !newEntry && tableItem?.count) ? tableItem.count : 0,
        total: (hasTable && doc.docTableItems?.length && !newEntry && tableItem?.total) ? tableItem.total : 0,
      }
    
    const ZpCalculateObj = {
      debetFirstSubcontoId: receiverId,
      debetSecondSubcontoId: analiticId,
      kreditFirstSubcontoId: analiticId,
      kreditSecondSubcontoId: receiverId,
      count,
      total,
    }

    const TakeProfitObj = {
      debetFirstSubcontoId: null,
      debetSecondSubcontoId: null,
      kreditFirstSubcontoId: receiverId,
      kreditSecondSubcontoId: null,
      count,
      total,
    }
  
    const ServicesFromPartnersObj = {
      debetFirstSubcontoId: receiverId,
      debetSecondSubcontoId: senderId,
      kreditFirstSubcontoId: analiticId,
      kreditSecondSubcontoId: receiverId,
      count,
      total,
    }

    const saleTMZObj = {
      debetFirstSubcontoId: receiverId,
      debetSecondSubcontoId: analiticId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: analiticId,
      count,
      total,
    }

    const saleTMZ4028 = {
      debetFirstSubcontoId: senderId,
      debetSecondSubcontoId: receiverId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: analiticId,
      count,
      total,
    }

    const salePaymentObj = {
      debetFirstSubcontoId: senderId,
      debetSecondSubcontoId: analiticId,
      kreditFirstSubcontoId: receiverId,
      kreditSecondSubcontoId: analiticId,
      count,
      total,
    }

    const salePayment4050 = {
      debetFirstSubcontoId: senderId,
      debetSecondSubcontoId: analiticId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: receiverId,
      count,
      total,
    }

    const leaveTMZ = {
      debetFirstSubcontoId: senderId,
      debetSecondSubcontoId: receiverId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: analiticId,
      count,
      total,
    }

    const comeHalfstuff = {
      debetFirstSubcontoId: receiverId,
      debetSecondSubcontoId: analiticId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: analiticId,
      count,
      total,
    }

    let leaveCashZp6750 = {
      debetFirstSubcontoId: analiticId,
      debetSecondSubcontoId: senderId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: analiticId,
      count: 0,
      total,
    }

    let leaveCashObj6050 = {
      debetFirstSubcontoId: analiticId,
      debetSecondSubcontoId: receiverId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: analiticId,
      count: 0,
      total,
    }

    let leaveCashOther = {
      debetFirstSubcontoId: receiverId,
      debetSecondSubcontoId: analiticId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: analiticId,
      count: 0,
      total,
    }

    let leaveCashFromFounder = {
      debetFirstSubcontoId: senderId,
      debetSecondSubcontoId: analiticId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: analiticId,
      count: 0,
      total,
    }

    let MoveCashObj = {
      debetFirstSubcontoId: receiverId,
      debetSecondSubcontoId: senderId,
      kreditFirstSubcontoId: senderId,
      kreditSecondSubcontoId: receiverId,
      count: 0,
      total,
    }

    let remaindDate = 1735671599000;
 
    switch (documentType) {
      case DocumentType.ComeCashFromPartners:
        if ( founders && founders.length && 
          founders.filter((item:FounderObject) => item.id == receiverId).length > 0) 
          return {
            debet: Schet.S66,
            kredit: Schet.S00,
            ...MoveCashObj,
        };
      
        return {
          debet: doc.date > remaindDate ? Schet.S50 : Schet.S00,
          kredit: Schet.S60,
          ...MoveCashObj
        };

      case DocumentType.ComeHalfstuff:
        if (hasTable && tableItem && !newEntry) {
          return {
            debet: Schet.S23,
            kredit: Schet.S10,
            ...leaveMaterialWithTable
          };
        } else {
          return {
            debet: Schet.S21,
            kredit: Schet.S23,
            ...comeHalfstuff
          };
        }
        
      case DocumentType.ComeMaterial:
        return {
          debet: Schet.S10,
          kredit: doc.date > remaindDate ? Schet.S60 : Schet.S00,
          ...leaveComeTMZObj
        };

      case DocumentType.SaleHalfStuff:
        if (!newEntry) {
          return {
            debet: Schet.S60,
            kredit: Schet.S21,
            ...leaveComeTMZObj
          };
        } else if (newEntry) {
          return {
            debet: Schet.S50,
            kredit: Schet.S60,
            ...salePaymentObj
          };
        }
      
      case DocumentType.ComeProductImport:
        return {
          debet: Schet.S28,
          kredit: doc.date > remaindDate ? Schet.S60 : Schet.S00,
          ...leaveComeTMZObj
        };

      case DocumentType.ComeProduct:
        return {
          debet: Schet.S28,
          kredit: doc.date > remaindDate ? Schet.S20 : Schet.S00,
          ...leaveComeTMZObj,
        };

      case DocumentType.LeaveCash:
        if (isPartner) {
          return {
            debet: Schet.S60,
            kredit: Schet.S50,
            ...leaveCashObj6050,
            count: isCash ? -1 : 0,
          };
        }
        if (isWorker) {
          return {
            debet: Schet.S67,
            kredit: Schet.S50,
            ...leaveCashZp6750,
            count: isCash ? -1 : 0
          };
        }

        if (
          founders && founders.length && 
          founders.filter((item:FounderObject) => item.id == senderId).length > 0
        ) 
          return {
            debet: Schet.S00,
            kredit: Schet.S68,
            ...leaveCashFromFounder,
        };

        return {
          debet: Schet.S20,
          kredit: Schet.S50,
          ...leaveCashOther,
          count: isCash ? -1 : 0,
        };

      case DocumentType.LeaveHalfstuff:
        return {
          debet: Schet.S20,
          kredit: Schet.S21,
          ...leaveTMZ,
        };

      case DocumentType.LeaveMaterial:
        return {
          debet: Schet.S20,
          kredit: Schet.S10,
          ...leaveMaterialWithTable,
        };

      case DocumentType.LeaveProd:
        return {
          debet: Schet.S20,
          kredit: Schet.S28,
          ...leaveTMZ,
        };

      case DocumentType.MoveCash:
        if (!newEntry) {
          return {
            debet: Schet.S68,
            kredit: Schet.S00,
            ...MoveCashObj,
            count: isCash ? -1 : 0,
          }
        } else {
          if (founders && founders.length && founders.filter((item:FounderObject) => item.id == receiverId).length > 0) 
             return {
                debet: Schet.S66,
                kredit: Schet.S50,
                ...MoveCashObj,
                count: isCash ? -1 : 0,
              }
          else return {
            debet: Schet.S50,
            kredit: doc.date > remaindDate ? Schet.S50 : Schet.S00,
            ...MoveCashObj,
            count: isCash ? -1 : 0,
          };        
          
        }

      case DocumentType.MoveHalfstuff:
        return {
          debet: Schet.S21,
          kredit: doc.date > remaindDate ? Schet.S21 : Schet.S00,
          ...leaveComeTMZObj,
        };

      case DocumentType.MoveMaterial:
        return {
          debet: Schet.S10,
          kredit: Schet.S10,
          ...leaveComeTMZObj
        };

      case DocumentType.MoveProd:
        return {
          debet: Schet.S28,
          kredit: Schet.S28,
          ...leaveComeTMZObj
        };

      case DocumentType.SaleMaterial:
        if (!newEntry) {
          return {
            debet: Schet.S60,
            kredit: Schet.S10,
            ...saleTMZObj
          };
        } else if (newEntry) {
          return {
            debet: Schet.S50,
            kredit: Schet.S60,
            ...salePaymentObj
          };
        }

      case DocumentType.SaleProd:
        if (!newEntry) {
          return {
            debet: Schet.S40,
            kredit: Schet.S28,
            ...saleTMZ4028
          };
        } else if (newEntry) {
          return {
            debet: Schet.S50,
            kredit: Schet.S40,
            ...salePayment4050
          };
        }

      case DocumentType.ZpCalculate:
        // шу хужжатни проводкаси хакида кайта бир уйлаб куриш керак
        return {
          debet: Schet.S20,
          kredit: Schet.S67,
          ...ZpCalculateObj
        };

      case DocumentType.TakeProfit:
        // шу хужжатни проводкаси хакида кайта бир уйлаб куриш керак
        return {
          debet: Schet.S00,
          kredit: Schet.S66,
          ...TakeProfitObj
        };
      
      case DocumentType.ServicesFromPartners:
        console.log('-*-')
        return {
          debet: Schet.S20,
          kredit: Schet.S60,
          ...ServicesFromPartnersObj
        };
    }
  }

  return {
      debet: Schet.S00,
      debetFirstSubcontoId: null,
      debetSecondSubcontoId: null,
      debetThirdSubcontoId: null,
      kredit: Schet.S00,
      kreditFirstSubcontoId: null,
      kreditSecondSubcontoId: null,
      kreditThirdSubcontoId: null,
      count: 0,
      total: 0,
      description: ''
  }
  
}