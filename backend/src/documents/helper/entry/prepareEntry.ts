
import { Document } from 'src/documents/document.model';
import { FounderObject } from './prepareEntrysList';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { Entry, EntryCreationAttrs } from 'src/entries/entry.model';
import { getValuesForEntry } from './getValuesForEntry';

export const prepareEntry = (doc: Document, newEntryForCharges: boolean, hasTable: boolean, tableItem: DocTableItems | undefined, isCash: boolean, founders: Array<FounderObject>) :EntryCreationAttrs => {
  // let hasTableItems = hasDocumentTablePart(item.documentType);
  return {
    date: doc.date,
    documentType: doc.documentType,
    description: '',
    docId: doc.id,
    ...getValuesForEntry(doc, newEntryForCharges, hasTable, tableItem, isCash, founders)
  }
}