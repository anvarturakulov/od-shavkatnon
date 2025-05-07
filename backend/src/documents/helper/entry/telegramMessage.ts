import TelegramBot from 'node-telegram-bot-api';
import { UserRoles } from 'src/interfaces/user.interface';
import { DocumentType } from 'src/interfaces/document.interface';
import { UpdateCreateDocumentDto } from 'src/documents/dto/updateCreateDocument.dto';
import { User } from 'src/users/users.model';
import { Reference } from 'src/references/reference.model';
import { getDescriptionDocument } from 'src/data/menu';

// const TelegramBot = require('node-telegram-bot-api');

enum TelegramChanelsIds {
  Halqobod = '-1002271858434', //+++
  Chashma = '-1002479917847', //+++
  Konteyner = '-1002437963219', //+++
  All = '-1002280389944', //++
  ZpChanel = '-1002279595323', //++
  Delivery = '-1002422160049' //+++
}

export type ReferencesForTelegramMessage = {
  sender: Reference | undefined,
  receiver: Reference | undefined,
  analitic: Reference | undefined,
  productForCharge: Reference | undefined
}

export const numberValue = (price: number): string => {
  let newPrice = Math.round(price * 10) / 10;
  return newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
};

const prepareCheck = (body: UpdateCreateDocumentDto, user: User, references: ReferencesForTelegramMessage, newDocument: boolean, messageInDeleting: string) => {
  let title = newDocument ? 'ШАВКАТ НОН" - ЧЕК' : 'ЧЕК УЗГАРТИРИЛДИ'
  if (messageInDeleting && messageInDeleting.length > 0) title = messageInDeleting
  let dateDoc = new Date(Number(body.date)).toLocaleDateString('ru-RU')
  let userName = user ? `Ходим --- ${user.name}` : ''
  let date = dateDoc ? `Сана --- ${dateDoc}` : ''
  let hodim = body.documentType == DocumentType.LeaveHalfstuff ? 'Хамирчи' : 'Ёпувчи';
  let doc = getDescriptionDocument(body.documentType) ? `Хужжат тури --- ${getDescriptionDocument(body.documentType)}` : '';

  let receiver = references.receiver?.name ? `Олувчи -- - ${references.receiver.name}` : ''
  let analitic = references.analitic?.name ? `Аналитика -- - ${references.analitic.name}` : ''
  let sender = references.sender?.name ? `Жунатувчи -- - ${references.sender.name}` : ''
  let productForCharge = references.productForCharge?.name ? `Махсулот тури - ${references.productForCharge.name}` : ''

  let count = body.docValues.count > 0 ? `Сон --- ${numberValue(body.docValues.count)} та` : ''
  let price = body.docValues.price > 0 ? `Нарх --- ${numberValue(body.docValues.price)}` : ''
  let total = body.docValues.total > 0 ? `Сумма --- ${numberValue(body.docValues.total)}` : ''
  let comment = body.docValues.comment ? `Изох: ${body.docValues.comment} ` : ''

  return (
    `==========================
      ${title}      
   =========================
   ${userName}
   ${doc}
   ${date} 
   --------------------------------------------
   ${receiver}
   ${sender}
   ${analitic}
   ${productForCharge}
   ${count} ${price}
   ${total} 
   ${comment}
   ==========================
   МЕХНАТИНГИЗ УЧУН РАХМАТ!
   ==========================
  `
  )
}

const prepareCheckForZP = (body: UpdateCreateDocumentDto, references: ReferencesForTelegramMessage, newDocument: boolean, messageInDeleting: string) => {

  let title: string = ''
  const titleForCalculate = 'ИШ ХАКИ ХИСОБЛАНДИ'
  const titleForCalculateChange = 'ИШ ХАКИ УЗГАРТИРИЛДИ'
  const titleForPayment = 'ИШ ХАКИ ТУЛАНДИ'
  const titleForPaymentChange = 'ТУЛОВ УЗГАРТИРИЛДИ'

  if (body.documentType == DocumentType.ZpCalculate) {
    title = newDocument ? titleForCalculate : titleForCalculateChange
  }

  if (body.documentType == DocumentType.LeaveCash) {
    title = newDocument ? titleForPayment : titleForPaymentChange
  }

  if (messageInDeleting && messageInDeleting.length > 0) title = messageInDeleting

  let dateDoc = new Date(Number(body.date)).toLocaleDateString('ru-RU')
  let date = dateDoc ? `Сана --- ${dateDoc}` : ''

  let receiver = references.receiver?.name ? `Цех -- - ${references.receiver.name}` : ''
  let analitic = references.analitic?.name ? `Ходим -- - ${references.analitic.name}` : ''
  let productForCharge = references.productForCharge?.name ? `${references.productForCharge.name}` : ''
  let total = body.docValues.total > 0 ? `Сумма --- ${numberValue(body.docValues.total)}` : ''
  const comment = body.docValues.comment ? body.docValues.comment : ''
  const productForChargeWithComment = `Изох: ${productForCharge} ${comment}`

  return (
    `==========================
      ${title}      
   =========================
   ${date}
   --------------------------------------------
   ${receiver}
   ${analitic}
   ${total} 
   ${productForChargeWithComment}
   ==========================
   МЕХНАТИНГИЗ УЧУН РАХМАТ!
   ==========================
  `
  )
}

export const sendMessageToChanel = (body: UpdateCreateDocumentDto, user: User | null, references: ReferencesForTelegramMessage, newDocument: boolean, messageInDeleting: string, bot: TelegramBot) => {
  
  let firstChadId = ''

  if (!user) return

  if (body.documentType == DocumentType.ZpCalculate) firstChadId = TelegramChanelsIds.ZpChanel

  if (user.role == UserRoles.HEADSECTION) {
    if (user.sectionId == 19556) firstChadId = TelegramChanelsIds.Chashma
    if (user.sectionId == 19557) firstChadId = TelegramChanelsIds.Halqobod
    if (user.sectionId == 19558) firstChadId = TelegramChanelsIds.Konteyner
  }

  if (user?.role == UserRoles.DELIVERY) firstChadId = TelegramChanelsIds.Delivery

  let secondChatId = TelegramChanelsIds.All
  if (firstChadId) {
    bot.sendMessage(firstChadId, prepareCheck(body, user, references, newDocument, messageInDeleting));
  }
  bot.sendMessage(secondChatId, prepareCheck(body, user, references, newDocument, messageInDeleting));

  if (
    body.documentType == DocumentType.ZpCalculate || 
    ( body.documentType == DocumentType.LeaveCash && body.docValues.isWorker)
  ) {
    try {
      if (references.analitic?.refValues.telegramId) {
        bot.sendMessage(references.analitic.refValues.telegramId, prepareCheckForZP(body, references, newDocument, messageInDeleting));
      }
    } catch {

    }
  }
}
