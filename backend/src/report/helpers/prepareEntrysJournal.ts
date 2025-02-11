import { DocTableItem, Document } from 'src/document/models/document.model';
import { prepareEntry } from './entry/prepareEntry';
import { DocumentType } from 'src/interfaces/document.interface';
import { hasDocumentTablePart } from './hasDocumentTableType';
import { EntryItem } from 'src/interfaces/report.interface';
import { ReferenceDocument } from 'src/reference/models/referense.model';
import { TypeReference } from 'src/interfaces/reference.interface';

export interface DocumentWithId extends Document {
  _id: string
}

export interface FounderObject {
  id: string,
  shavkat: boolean,
  maxsud: boolean,
}

export const prepareEntrysJournal = (allDocuments: Array<Document>, founders:Array<ReferenceDocument>):Array<EntryItem> => {
  let documents = [...allDocuments]
  let results: Array<EntryItem> = []
  
  let filteredFounders: Array<FounderObject> = founders
                        .filter((item: ReferenceDocument) => item.typeReference == TypeReference.STORAGES)
                        .map(((item: ReferenceDocument) => {
                          return {id: String(item._id), 'shavkat': item.shavkat, 'maxsud': item.maxsud}
                        }))
  

  documents.forEach((item: Document) => {
    if (!item.deleted) {
        
      if ( hasDocumentTablePart(item.documentType)) {
        if ( item?.tableItems && item.tableItems != undefined || item.tableItems.length > 0 ) {
          item.tableItems.forEach((tableItem: DocTableItem) => {
            let newItemForResults = { ...prepareEntry(item, false, true, tableItem, false, filteredFounders) }
            results.push(newItemForResults);

          })
        }

      } else {
        let newItemForResults = { ...prepareEntry(item, true, false, undefined, item.isCash, filteredFounders) }
        results.push(newItemForResults);

        if (item.documentType == DocumentType.SaleProd || item.documentType == DocumentType.SaleMaterial || item.documentType == DocumentType.SaleHalfStuff ) {
          let newItemForResults = { ...prepareEntry(item, false, false, undefined, false, filteredFounders) }
          results.push(newItemForResults);
        }

        if (item.documentType == DocumentType.MoveCash) {

          if ( filteredFounders && filteredFounders.length && 
            filteredFounders.filter((elem:FounderObject) => elem.id == item.receiverId.toString()).length > 0
            ) {
              let newItemForResults = { ...prepareEntry(item, false, false, undefined, false, filteredFounders) }
              results.push(newItemForResults);
            }
        }
      }
      
      if (item.documentType == DocumentType.ComeHalfstuff) {
        let newItemForResults = { ...prepareEntry(item, true, false, undefined, false, filteredFounders) }
        let total: number = 0;
        if (item?.tableItems && item.tableItems.length >0) {
          total = item.tableItems.reduce((summa, item) => summa + item.total, 0);
        }
        newItemForResults.summa = total
        results.push(newItemForResults);
      }

      
    }
  })
  return results
}