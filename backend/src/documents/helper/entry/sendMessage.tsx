import { UpdateCreateDocumentDto } from "src/documents/dto/updateCreateDocument.dto";
import { ReferencesService } from "src/references/references.service";
import { UsersService } from "src/users/users.service";
import { ReferencesForTelegramMessage, sendMessageToChanel } from "./telegramMessage";
import * as TelegramBot from 'node-telegram-bot-api';

export const sendMessage = async (dto: UpdateCreateDocumentDto, newDocument: boolean, usersService:UsersService, referencesService: ReferencesService, bot: TelegramBot, messageInDeleting?: string, ) => {
        
        const user = await usersService.getUserById(dto.userId);

        let sender, receiver, analitic, productForCharge
        if (dto.docValues.senderId) sender = await referencesService.getReferenceById(dto.docValues.senderId);
        if (dto.docValues.receiverId) receiver = await referencesService.getReferenceById(dto.docValues.receiverId);
        if (dto.docValues.analiticId) analitic = await referencesService.getReferenceById(dto.docValues.analiticId);
        if (dto.docValues.productForChargeId) productForCharge = await referencesService.getReferenceById(dto.docValues.productForChargeId);

        let references: ReferencesForTelegramMessage = {
            sender,
            receiver,
            analitic,
            productForCharge,
        }
        if (!messageInDeleting) messageInDeleting = ''

        sendMessageToChanel(dto, user, references, newDocument, messageInDeleting, bot)
    }