
import { Document } from 'src/documents/document.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { EntryCreationAttrs } from 'src/entries/entry.model';
import { getValuesForEntry } from './getValuesForEntry';

export const prepareEntry = (doc: Document, newEntryForCharges: boolean, hasTable: boolean, tableItem: DocTableItems | undefined, recieverIsFounder: boolean, senderIsFounder:boolean) :EntryCreationAttrs => {
  console.log(doc.date)
  return {
    date: doc.date,
    documentType: doc.documentType,
    description: doc.docValues.comment,
    docId: doc.id,
    ...getValuesForEntry(doc, newEntryForCharges, hasTable, tableItem, recieverIsFounder, senderIsFounder)
  }
}