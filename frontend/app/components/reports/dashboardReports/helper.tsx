import { Financial } from "./financial/financial"
import { Foyda } from "./foyda/foyda"
import {Cash} from "./cash/cash"
import {Taking} from './taking/taking'
import { Section } from "./section/section"
import { Giving } from "./giving/giving"
import { Sklad } from "./sklad/sklad"
import { Norma } from "./norma/norma"
import { Material } from "./material/material"
import { DebitorKreditor } from "./debitorKreditor/debitorKreditor"

export const getReportByType = (dashboardCurrentReportType: string, informData: any) : JSX.Element => {
    
    switch (dashboardCurrentReportType) {
        case 'Financial':
            return <Financial data={informData}/>
        case 'DebitorKreditor':
            return <DebitorKreditor data={informData}/>
        case 'Foyda':
            return <Foyda data={informData}/>
        case 'Cash':
            return <Cash data={informData}/>
        case 'Taking':
            return <Taking data={informData} />
        case 'Giving':
            return <Giving data={informData}/>
        case 'Section-buxgalter':
            return <Section data={informData} sectionType='buxgalter'/>
        case 'Section-filial':
            return <Section data={informData} sectionType='filial'/>
        case 'Section-delivery':
            return <Section data={informData} sectionType='delivery'/>
        case 'Sklad':
            return <Sklad data={informData}/>
        case 'Norma':
            return <Norma data={informData}/> 
        case 'Material':
            return <Material data={informData}/> 
        case 'Section-founder':
            return <Section data={informData} sectionType='founder'/>
        case 'All':
            return ( 
                <>
                    <Foyda data={informData}/>
                    <DebitorKreditor data={informData}/>
                    <Cash data={informData}/>
                    <Financial data={informData}/>
                    <Section data={informData} sectionType='buxgalter'/>
                    <Section data={informData} sectionType='filial'/>
                    <Section data={informData} sectionType='delivery'/>
                    <Sklad data={informData}/>
                    <Norma data={informData}/> 
                    <Material data={informData}/> 
                    <Section data={informData} sectionType='founder'/> 
                </>
            )
        default:
            return <></>
        
    }


}