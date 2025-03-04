import { Document } from "src/documents/document.model"
import { hasTablePartInDocument } from "./hasDocumentTableType"
import { Entry, EntryCreationAttrs } from "src/entries/entry.model"
import { DocTableItems } from "src/docTableItems/docTableItems.model"
import { prepareEntry } from "./prepareEntry"
import { Reference } from "src/references/reference.model"
import { DocSTATUS, DocumentType } from "src/interfaces/document.interface";

export interface FounderObject {
  id: number,
}

export const prepareEntrysJournal = (document: Document, founders:Array<Reference>):Array<EntryCreationAttrs> => {
  
  let results: Array<EntryCreationAttrs> = []
  
  if (document) {
    if (document.docStatus != DocSTATUS.PROVEDEN) {
        
      if ( hasTablePartInDocument(document.documentType)) {
        if ( document.docTableItems && document.docTableItems.length > 0 ) {
          document.docTableItems.forEach((tableItem: DocTableItems) => {
            let entry = { ...prepareEntry(document, false, true, tableItem, false, founders) }
            results.push(entry);
          })
        }

      } else {
        let entry = { ...prepareEntry(document, true, false, undefined, document.docValues.isCash, founders) }
        results.push(entry);

        if ( 
          document.documentType == DocumentType.SaleProd || 
          document.documentType == DocumentType.SaleMaterial || 
          document.documentType == DocumentType.SaleHalfStuff 
        ) {
          let entry = { ...prepareEntry(document, false, false, undefined, false, founders) }
          results.push(entry);
        }

        if (document.documentType == DocumentType.MoveCash) {
          if ( 
              founders && founders.length && 
              founders.filter((elem:FounderObject) => elem.id == document.docValues.receiverId).length > 0
            ) {
              let entry = { ...prepareEntry(document, false, false, undefined, false, founders) }
              results.push(entry);
            }
        }
      }
      
      if (document.documentType == DocumentType.ComeHalfstuff) {
        let entry = { ...prepareEntry(document, true, false, undefined, false, founders) }
        let total: number = 0;
        if (document.docTableItems && document.docTableItems.length >0) {
          total = document.docTableItems.reduce((summa, item) => summa + item.total, 0);
        }
        entry.total = total
        results.push(entry);
      }
    }
  }
  return results
}