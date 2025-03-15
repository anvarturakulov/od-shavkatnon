"use client"
import { ReactNode, createContext, useContext, useState } from "react";
import { defaultMainData } from './app.context.constants';
import { IAppContext, Maindata } from './app.context.interfaces';
import {set} from 'lodash'

const appContextDefaultValues: IAppContext = {
  mainData: {...defaultMainData},
};

const AppContext = createContext<IAppContext>(appContextDefaultValues);

export function useAppContext() {
    return useContext(AppContext);
}

type Props = {
    children: ReactNode;
};

const keyWithParent = (key: string, obj: Maindata): string => {
    // const keys = ['document', 'journal',]
    
    if (key in obj.document) return `document.${key}`
    if (key in obj.journal) return `journal.${key}`
    if (key in obj.reference) return `reference.${key}`
    if (key in obj.report) return `report.${key}`
    if (key in obj.users) return `users.${key}`
    if (key in obj.window) return `window.${key}`
    return ''
}

export function AppProvider({ children }: Props) {
    
    const [data, setData] = useState<Maindata>(defaultMainData);
    const setMainData = (key: string, value: any ) => {
        let newObj = {...data}
        let newValue = typeof value != 'object' ? value : 
                        Array.isArray(value) ? [...value]:
                        {...value}
        let newKey = keyWithParent(key, data)
        if (newKey) {
            set(newObj, newKey, newValue)
            setData(newObj)
        }
    };

    const value = {
        mainData: data,
        setMainData,
    };

    return (
        <>
            <AppContext.Provider value={value}>
                {children}
            </AppContext.Provider>
        </>
    );
}