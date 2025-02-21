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

export function AppProvider({ children }: Props) {
    
    const [data, setData] = useState<Maindata>(defaultMainData);
    const setMainData = (key: string, value: any ) => {
        let newObj = {...data}
        let newValue = typeof value != 'object' ? value : 
                                                    Array.isArray(value) ? [...value]:
                                                    {...value}
        set(newObj, key, newValue)
        // setData((data) => ({
            //     ...data,
            //     [key]: typeof value != 'object' ? value : 
            //             Array.isArray(value) ? [...value]:
            //             {...value}
            // }));
            setData(newObj)
            console.log('newObj', newObj)

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