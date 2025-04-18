'use client';
import styles from './clients.module.css';
import { useEffect } from 'react';
import { useAppContext } from '@/app/context/app.context';
import { ClientProps } from './clients.props';
import { numberValue } from '@/app/service/common/converters';

// Интерфейсы для типизации данных
interface Value {
  count: number;
  summa: number;
}

interface Client {
  name: string | undefined;
  id: number;
}

interface ReportData {
  reportType: string;
  values: (Value | Client)[][];
  dimensions: {
    height: number;
    width: number;
  };
  days: number[];
}

export const Clients = ({ className, ...props }: ClientProps): JSX.Element => {
  const { setMainData, mainData } = useAppContext();
  const { clients } = mainData.report;

  useEffect(() => {
    console.log('clients:', clients);
    console.log('reportData:', clients);
    console.log('values:', clients?.values);
    console.log('days:', clients?.days);
    console.log('clientsList:', clients?.values?.[0]);
    console.log('clientData:', clients?.values?.[0] ? clientsList : []);
  }, [clients]);

  // Проверяем, есть ли данные
  if (!clients) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  const reportData: ReportData | undefined = clients;
  if (!reportData) {
    return <div className={styles.noData}>Нет данных с сервера</div>;
  }

  const { values = [], dimensions = { height: 0, width: 0 }, days = [] } = reportData;

  if (!values || !values[0]) {
    return <div className={styles.noData}>Нет клиентов в данных</div>;
  }

  // Форматирование дат для заголовков
  const formatDate = (timestamp: number): string => {
    if (timestamp === 0) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Получаем список клиентов из первой строки
  const clientsList = values[0].map((item) =>
    'name' in item ? item : { name: '-', id: 0 }
  );

  // Транспонируем данные: строки — клиенты, столбцы — дни
  const clientData = clientsList.map((client, clientIndex) => ({
    client,
    values: (values.slice(1) ?? []).map(
      (row) => (row[clientIndex] as Value) ?? { count: 0, summa: 0 }
    ),
  }));

  return (
    <div className={className}>
      {clientData.length === 0 ? (
        <div className={styles.noData}>Нет данных для отображения</div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Клиент</th>
                {days.map((day, index) => (
                  <th key={index}>{formatDate(day)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientData.map(({ client, values }, clientIndex) => (
                <tr key={clientIndex}>
                  <td>{client.name ?? '-'}</td>
                  {values.map((value, dayIndex) => (
                    <td key={dayIndex}>
                      {value ? (
                        <>
                            <div>
                                {numberValue(value.count)}
                            </div>
                            <div>
                                <span>{numberValue(value.summa)}</span>
                            </div>
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.dimensions}>
            Жадвал: {clientData.length} мижозлар сони × {days.length} кунга
          </div>
        </>
      )}
    </div>
  );
};