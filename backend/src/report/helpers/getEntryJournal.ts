import { DocTableItem, Document } from 'src/document/models/document.model';
import { EntryItem, Schet } from 'src/interfaces/report.interface';
import { hasDocumentTablePart } from './hasDocumentTableType';
import { prepareEntry } from './entry/prepareEntry';

export interface DocumentWithId extends Document {
  _id: string
}

export const getEntryJournal = (allDocuments: Array<Document>): Array<EntryItem> => {
  let documents = [...allDocuments]
  let results = []
  documents.forEach((item: Document) => {
    if (!item.deleted) {
      if (hasDocumentTablePart(item.documentType)) {
        item.tableItems.forEach((tableItem: DocTableItem) => {
          let newItemForResults = { ...prepareEntry(item, tableItem) }
          results.push(newItemForResults);
        })
      } else {
        let newItemForResults = { ...prepareEntry(item) }
        results.push(newItemForResults);
      }
    }
  })
  return results
}