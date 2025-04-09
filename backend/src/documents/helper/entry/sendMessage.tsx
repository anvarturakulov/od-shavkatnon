import { UpdateCreateDocumentDto } from "src/documents/dto/updateCreateDocument.dto";
import { ReferencesService } from "src/references/references.service";
import { UsersService } from "src/users/users.service";
import { ReferencesForTelegramMessage, sendMessageToChanel } from "./telegramMessage";
import * as TelegramBot from 'node-telegram-bot-api';

export const sendMessage = async (dto: UpdateCreateDocumentDto, newDocument: boolean, usersService:UsersService, referencesService: ReferencesService, bot: TelegramBot, messageInDeleting?: string, ) => {
        
        const user = await usersService.getUserById(dto.userId);

        let sender, receiver, analitic, firstWorker, secondWorker, thirdWorker
        if (dto.docValues.senderId) sender = await referencesService.getReferenceById(dto.docValues.senderId);
        if (dto.docValues.receiverId) receiver = await referencesService.getReferenceById(dto.docValues.receiverId);
        if (dto.docValues.analiticId) analitic = await referencesService.getReferenceById(dto.docValues.analiticId);

        let references: ReferencesForTelegramMessage = {
            sender,
            receiver,
            analitic,
            firstWorker,
            secondWorker,
            thirdWorker,
        }
        if (!messageInDeleting) messageInDeleting = ''

        sendMessageToChanel(dto, user, references, newDocument, messageInDeleting, bot)
    }