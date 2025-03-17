import { Document } from "src/documents/document.model"
import { hasTablePartInDocument } from "./hasDocumentTableType"
import { EntryCreationAttrs } from "src/entries/entry.model"
import { DocTableItems } from "src/docTableItems/docTableItems.model"
import { prepareEntry } from "./prepareEntry"
import { DocSTATUS, DocumentType } from "src/interfaces/document.interface";


export const prepareEntrysList = (document: Document, force: boolean = false):Array<EntryCreationAttrs> => {
  
  let results: Array<EntryCreationAttrs> = []
  
  // Бу хозирча шундай туриб турсин. Кейин тепадан келиш керак
  let recieverIsFounder = false, senderIsFounder = false

  if (document) {
    if (document.docStatus != DocSTATUS.PROVEDEN || force) {
        
      if ( hasTablePartInDocument(document.documentType)) {
        if ( document.docTableItems && document.docTableItems.length > 0 ) {
          document.docTableItems.forEach((tableItem: DocTableItems) => {
            let entry = { ...prepareEntry(document, false, true, tableItem, recieverIsFounder, senderIsFounder) }
            results.push(entry);
          })
        }

      } else {
        let entry = { ...prepareEntry(document, true, false, undefined, recieverIsFounder, senderIsFounder) }
        results.push(entry);

        if ( 
          document.documentType == DocumentType.SaleProd || 
          document.documentType == DocumentType.SaleMaterial || 
          document.documentType == DocumentType.SaleHalfStuff 
        ) {
          let entry = { ...prepareEntry(document, false, false, undefined, recieverIsFounder, senderIsFounder) }
          results.push(entry);
        }

        if (document.documentType == DocumentType.MoveCash) {
          if ( recieverIsFounder ) {
              let entry = { ...prepareEntry(document, false, false, undefined, recieverIsFounder, senderIsFounder) }
              results.push(entry);
            }
        }
      }
      
      if (document.documentType == DocumentType.ComeHalfstuff) {
        let entry = { ...prepareEntry(document, true, false, undefined, recieverIsFounder, senderIsFounder) }
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