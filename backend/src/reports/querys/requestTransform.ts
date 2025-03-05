import { Request } from 'express';
import { QuerySimple } from 'src/interfaces/report.interface';

export const requestTransform = (request: Request): QuerySimple => {
    return {
        reportType: `${request.query?.reportType}`,
        typeQuery: `${request.query?.typeQuery}`,
        sectionId: request.query?.sectionId ? +request.query?.sectionId : 0,
        schet: `${request.query?.schet}`,
        dk: `${request.query?.schet}`,
        workerId: request.query?.workerId ? +request.query?.workerId : 0,
        name: `${request.query?.name}`,
        startDate: request.query?.startDate ? +request.query?.startDate : 0,
        endDate: request.query?.endDate ? +request.query?.endDate : 0,
        firstSubcontoId: request.query?.firstSubcontoId ? +request.query?.firstSubcontoId : null,
        secondSubcontoId: request.query?.secondSubcontoId ? +request.query?.secondSubcontoId: null,
        thirdSubcontoId: request.query?.thirdSubcontoId ? +request.query?.thirdSubcontoId: null,
        foydaPrice: {
            first: request.query?.first ? +request.query?.first : 0,
            second: request.query?.second ? +request.query?.second : 0
        },
    }
    
}