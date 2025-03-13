'use client'
import { Sequelize } from 'sequelize-typescript';
import { sklad } from './sklad/sklad';

export const matOborot = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    section: number | null,
    sequelize: Sequelize
    ) => {
    
    let result:any[] = [];

    let skladResult = await sklad(data, startDate, endDate, section, sequelize)
    result.push(skladResult);

    return result
    
} 