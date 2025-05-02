import { DocTableItemDto } from "src/documents/dto/docTableItem.dto"
import { DocValuesDto } from "src/documents/dto/docValues.dto"
import { UpdateCreateDocumentDto } from "src/documents/dto/updateCreateDocument.dto"
import { DocSTATUS, OrderStatus } from "src/interfaces/document.interface"

export const convertJsonDocs = (jsonRow:any):UpdateCreateDocumentDto => {

    let docTableItems: DocTableItemDto[] = [] 
    if (jsonRow.tableItems && jsonRow.tableItems.length) {
        let docTItems = [...jsonRow.tableItems]
        if (docTItems && docTItems.length) {
            for (const item of docTItems) {
                const result: DocTableItemDto = {
                    docId: BigInt(1),
                    analiticId: 13957,
                    analiticOldId: item.referenceId,
                    balance: item.balance,
                    count: item.count,
                    price: item.price,
                    total: item.total
                } 
                if (result) docTableItems.push(result)

            }
        }
    }
    

    let docValues: DocValuesDto = {
        docId: BigInt(1),
        senderId: 13957,
        receiverId: 13957,
        analiticId: 13957,
        productForChargeId: 13957,
        senderoldId: jsonRow.senderId,
        receiverOldId: jsonRow.receiverId,
        analiticOldId: jsonRow.analiticId,
        isWorker: jsonRow.isWorker,
        isPartner: jsonRow.isPartner,
        isFounder: jsonRow.isFounder,
        isCash: jsonRow.isCash,
        count: jsonRow.count,
        price: jsonRow.price,
        total: jsonRow.total,
        cashFromPartner: jsonRow.jsonRow,
        comment: jsonRow.comment,
        orderTakingDate: BigInt(0),
        orderTakingTime: '',
        orderWithDeleviry: false,
        orderAdress: '',
        orderStatus: OrderStatus.OPEN,
        
    }
    let doc:UpdateCreateDocumentDto = {
        date: jsonRow.date,
        userId: 13,
        userOldId: jsonRow.user,
        documentType: jsonRow.documentType,
        docStatus: jsonRow?.deleted == true ? DocSTATUS.DELETED : DocSTATUS.OPEN,
        docValues: {...docValues},
        docTableItems: [...docTableItems]
    }
    
    return doc
} 