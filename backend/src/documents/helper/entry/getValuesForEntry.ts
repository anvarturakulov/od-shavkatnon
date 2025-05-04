import { Schet } from 'src/interfaces/report.interface';
import { Document } from 'src/documents/document.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocumentType } from "src/interfaces/document.interface";

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

export const getValuesForEntry = (doc: Document, newEntry: boolean, hasTable: boolean, tableItem: DocTableItems | undefined, recieverIsFounder: boolean, senderIsFounder:boolean): ResultgetValuesForEntry => {
  if (doc) {
    let documentType = doc.documentType;
    let { receiverId, senderId, analiticId, productForChargeId, count, total, isPartner, isWorker } = doc.docValues
    let leaveMaterialWithTable = {
        debetFirstSubcontoId: senderId,
        debetSecondSubcontoId: receiverId,
        debetThirdSubcontoId: productForChargeId,
        kreditFirstSubcontoId: senderId,
        kreditSecondSubcontoId: (hasTable && doc.docTableItems?.length && !newEntry && tableItem?.analiticId) ? tableItem.analiticId : null,
        count: (hasTable && doc.docTableItems?.length && !newEntry && tableItem?.count) ? tableItem.count : 0,
        total: (hasTable && doc.docTableItems?.length && !newEntry && tableItem?.total) ? tableItem.total : 0,
      }
    
    let remaindDate = 1735671599000;
 
    switch (documentType) {
      case DocumentType.ComeCashFromPartners:
        let objects = {
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: senderId,
          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: receiverId,
          count: 0,
          total,
        }
        if (recieverIsFounder) {
          return {
            debet: Schet.S68,
            kredit: Schet.S00,
            ...objects
          };
        } else return {
          debet: doc.date > remaindDate ? Schet.S50 : Schet.S00,
          kredit: Schet.S60,
          ...objects
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
            debetFirstSubcontoId: receiverId,
            debetSecondSubcontoId: analiticId,
            kreditFirstSubcontoId: senderId,
            kreditSecondSubcontoId: analiticId,
            count,
            total,
          };
        }
        
      case DocumentType.ComeMaterial:
        return {
          debet: Schet.S10,
          kredit: doc.date > remaindDate ? Schet.S60 : Schet.S00,
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: analiticId,
          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: analiticId,
          count,
          total,
        };

      case DocumentType.SaleHalfStuff:
        if (!newEntry) {
          return {
            debet: Schet.S60,
            kredit: Schet.S21,
            debetFirstSubcontoId: receiverId,
            debetSecondSubcontoId: analiticId,
            kreditFirstSubcontoId: senderId,
            kreditSecondSubcontoId: analiticId,
            count,
            total,
          };
        } else if (newEntry) {
          return {
            debet: Schet.S50,
            kredit: Schet.S60,
            debetFirstSubcontoId: senderId,
            debetSecondSubcontoId: analiticId,
            kreditFirstSubcontoId: receiverId,
            kreditSecondSubcontoId: analiticId,
            count,
            total,
          };
        }
      
      case DocumentType.ComeProductImport:
        return {
          debet: Schet.S28,
          kredit: doc.date > remaindDate ? Schet.S60 : Schet.S00,
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: analiticId,
          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: analiticId,
          count,
          total,
        };

      case DocumentType.ComeProduct:
        return {
          debet: Schet.S28,
          kredit: doc.date > remaindDate ? Schet.S20 : Schet.S00,
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: analiticId,

          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: analiticId,
          count,
          total,
        };

      case DocumentType.LeaveCash:
        if (isPartner) {
          return {
            debet: Schet.S60,
            kredit: Schet.S50,
            debetFirstSubcontoId: analiticId,
            debetSecondSubcontoId: receiverId,
            kreditFirstSubcontoId: senderId,
            kreditSecondSubcontoId: analiticId,
            count: 0,
            total,
          };
        }
        if (isWorker) {
          return {
            debet: Schet.S67,
            kredit: Schet.S50,
            debetFirstSubcontoId: analiticId,
            debetSecondSubcontoId: senderId,
            kreditFirstSubcontoId: senderId,
            kreditSecondSubcontoId: analiticId,
            count: 0,
            total,
          };
        }
        if ( senderIsFounder ) 
          return {
            debet: Schet.S00,
            kredit: Schet.S68,
            debetFirstSubcontoId: senderId,
            debetSecondSubcontoId: analiticId,
            kreditFirstSubcontoId: senderId,
            kreditSecondSubcontoId: analiticId,
            count: 0,
            total,
        };

        return {
          debet: Schet.S20,
          kredit: Schet.S50,
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: analiticId,
          debetThirdSubcontoId: productForChargeId,
          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: analiticId,
          count: 0,
          total,
        };

      case DocumentType.LeaveHalfstuff:
        return {
          debet: Schet.S20,
          kredit: Schet.S21,
          debetFirstSubcontoId: senderId,
          debetSecondSubcontoId: receiverId,
          debetThirdSubcontoId: productForChargeId,
          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: analiticId,
          count,
          total,
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
          debetFirstSubcontoId: senderId,
          debetSecondSubcontoId: receiverId,
          debetThirdSubcontoId: productForChargeId,
          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: analiticId,
          count,
          total,
        };

      case DocumentType.MoveCash:
        if (!newEntry) {
          if (recieverIsFounder && senderIsFounder) {
            return {
                  debet: Schet.S68,
                  kredit: Schet.S68,
                  debetFirstSubcontoId: receiverId,
                  debetSecondSubcontoId: senderId,
                  kreditFirstSubcontoId: senderId,
                  kreditSecondSubcontoId: receiverId,
                  count: 0,
                  total
                }
          }
    
          if (recieverIsFounder && !senderIsFounder) {
            return {
                  debet: Schet.S68,
                  kredit: Schet.S00,
                  debetFirstSubcontoId: receiverId,
                  debetSecondSubcontoId: senderId,
                  kreditFirstSubcontoId: senderId,
                  kreditSecondSubcontoId: receiverId,
                  count: 0,
                  total
                }
          }
        } else {
    
          if (recieverIsFounder && !senderIsFounder) {
            return {
                  debet: Schet.S66,
                  kredit: doc.date > remaindDate ? Schet.S50 : Schet.S00,
                  debetFirstSubcontoId: receiverId,
                  debetSecondSubcontoId: senderId,
                  kreditFirstSubcontoId: senderId,
                  kreditSecondSubcontoId: receiverId,
                  count: 0,
                  total
                }
          }
          
          if (recieverIsFounder && senderIsFounder) total = 0

          return {
                debet: Schet.S50,
                kredit: doc.date > remaindDate ? Schet.S50 : Schet.S00,
                debetFirstSubcontoId: receiverId,
                debetSecondSubcontoId: senderId,
                kreditFirstSubcontoId: senderId,
                kreditSecondSubcontoId: receiverId,
                count: 0,
                total
              }
        } 

      case DocumentType.MoveHalfstuff:
        return {
          debet: Schet.S21,
          kredit: doc.date > remaindDate ? Schet.S21 : Schet.S00,
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: analiticId,
          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: analiticId,
          count,
          total,
        };

      case DocumentType.MoveMaterial:
        return {
          debet: Schet.S10,
          kredit: Schet.S10,
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: analiticId,
          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: analiticId,
          count,
          total,
        };

      case DocumentType.MoveProd:
        return {
          debet: Schet.S28,
          kredit: Schet.S28,
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: analiticId,
          kreditFirstSubcontoId: senderId,
          kreditSecondSubcontoId: analiticId,
          count,
          total,
        };

      case DocumentType.SaleMaterial:
        if (!newEntry) {
          return {
            debet: Schet.S60,
            kredit: Schet.S10,
            debetFirstSubcontoId: receiverId,
            debetSecondSubcontoId: analiticId,
            kreditFirstSubcontoId: senderId,
            kreditSecondSubcontoId: analiticId,
            count,
            total,
          };
        } else if (newEntry) {
          return {
            debet: Schet.S50,
            kredit: Schet.S60,
            debetFirstSubcontoId: senderId,
            debetSecondSubcontoId: analiticId,
            kreditFirstSubcontoId: receiverId,
            kreditSecondSubcontoId: analiticId,
            count,
            total,
          };
        }

      case DocumentType.SaleProd:
        if (!newEntry) {
          return {
            debet: Schet.S40,
            kredit: Schet.S28,
            debetFirstSubcontoId: senderId,
            debetSecondSubcontoId: receiverId,
            kreditFirstSubcontoId: senderId,
            kreditSecondSubcontoId: analiticId,
            count,
            total,
          };
        } else if (newEntry) {
          return {
            debet: Schet.S50,
            kredit: Schet.S40,
            debetFirstSubcontoId: senderId,
            debetSecondSubcontoId: analiticId,
            kreditFirstSubcontoId: senderId,
            kreditSecondSubcontoId: receiverId,
            count,
            total,
          };
        }

      case DocumentType.ZpCalculate:
        // шу хужжатни проводкаси хакида кайта бир уйлаб куриш керак
        return {
          debet: Schet.S20,
          kredit: Schet.S67,
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: analiticId,
          debetThirdSubcontoId: productForChargeId,
          kreditFirstSubcontoId: analiticId,
          kreditSecondSubcontoId: receiverId,
          count,
          total,
        };

      case DocumentType.TakeProfit:
        // шу хужжатни проводкаси хакида кайта бир уйлаб куриш керак
        return {
          debet: Schet.S00,
          kredit: Schet.S66,
          debetFirstSubcontoId: null,
          debetSecondSubcontoId: null,
          kreditFirstSubcontoId: receiverId,
          kreditSecondSubcontoId: null,
          count,
          total,
        };
      
      case DocumentType.ServicesFromPartners:
        return {
          debet: Schet.S20,
          kredit: Schet.S60,
          debetFirstSubcontoId: receiverId,
          debetSecondSubcontoId: senderId,
          debetThirdSubcontoId: productForChargeId,
          kreditFirstSubcontoId: analiticId,
          kreditSecondSubcontoId: receiverId,
          count,
          total,
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