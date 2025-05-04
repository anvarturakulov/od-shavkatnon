import { numberValue } from '@/app/service/common/converters'
import styles from './footer.module.css'
import { FooterProps } from './footer.props'

export default function Footer({ windowFor ,className, count, total, docCount, ...props }: FooterProps): JSX.Element {
    if (windowFor == 'reference') return <></>
    return (
        <div className={styles.box}>
            {
                count!=undefined && count>0 && 
                <div>{`Сон: ${numberValue(count)}`}</div>

            }

            {
                total!=undefined && total>0 &&
                <div>{`Сумма: ${numberValue(total)}`}</div>

            }

            {
                docCount!=undefined && docCount>0 &&
                <div>{`Хужжат сони: ${numberValue(docCount)}`}</div>

            }

            {
                docCount!=undefined && docCount>0 && count &&
                <div>{` Урта сон: ${numberValue(count/docCount)}`}</div>
            }

        </div>
    )
}

