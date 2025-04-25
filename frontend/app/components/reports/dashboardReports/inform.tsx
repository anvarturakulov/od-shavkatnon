'use client';
import { InformationProps } from './inform.props';
import styles from './inform.module.css';
import { useAppContext } from '@/app/context/app.context';
import { RefreshPanel } from './refreshPanel/refreshPanel';
import { useRef } from 'react';
import { getReportByType } from './helper';
import LoadingIco from './loading.svg';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '../../common/button/Button';
import { dateNumberToString } from '@/app/service/common/converterForDates';

export const totalByKey = (key: string, data: any[]) => {
  let total = 0;
  data &&
    data.length &&
    data.forEach((item: any) => {
      total += item[key];
    });
  return total;
};

export const totalByKeyForFinancial = (key: string, data: any[]) => {
  let total = 0;
  data &&
    data.length &&
    data.forEach((item: any) => {
      total += item[key];
    });
  return total;
};

export const Inform = ({ className, ...props }: InformationProps): JSX.Element => {
  const { mainData, setMainData } = useAppContext();
  const { uploadingDashboard } = mainData.window;
  const { informData, dashboardCurrentReportType } = mainData.report;
  const reportType = dashboardCurrentReportType;
  const reportRef = useRef<HTMLDivElement>(null);
  const {dateStart, dateEnd} = mainData.window.interval;
  let dateStartInStr = dateNumberToString(dateStart)
  let dateEndInStr = dateNumberToString(dateEnd)

  const generatePDF = async () => {
    if (!reportRef.current) {
      throw new Error('Report content not found');
    }

    // Логируем содержимое для отладки
    // console.log('Report content:', reportRef.current.innerHTML);

    const canvas = await html2canvas(reportRef.current, {
      scale: 1,
      useCORS: true,
      logging: true,
    });
    const imgData = canvas.toDataURL('image/png', 0.5); // Снижаем качество для уменьшения размера
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Добавляем первую страницу
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Добавляем дополнительные страницы, если отчет длинный
    while (heightLeft > 0) {
      pdf.addPage();
      position -= pdfHeight; // Сдвигаем изображение вверх для следующей страницы
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    const pdfBlob = pdf.output('blob');
    // console.log('PDF size:', pdfBlob.size / 1024 / 1024, 'MB');

    // Проверка на пустой PDF
    if (pdfBlob.size === 0) {
      throw new Error('Generated PDF is empty');
    }

    return pdfBlob;
  };

  const sendToTelegram = async () => {
    try {
      const pdfBlob = await generatePDF();

      // Проверка размера PDF (Telegram ограничивает до 50 МБ)
      if (pdfBlob.size / 1024 / 1024 > 50) {
        alert('PDF size exceeds 50MB, please reduce report content.');
        return;
      }

      const formData = new FormData();
      formData.append('document', pdfBlob, `Жамланма хисобот - (${dateStartInStr}-${dateEndInStr}).pdf`);

      const response = await axios.post('/apifront/send-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Архивга жунатилди');
    } catch (error) {
      console.error('Error sending PDF to Telegram:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      alert('Failed to send PDF');
    }
  };

  return (
    <div ref={reportRef} className={styles.container}>
      <RefreshPanel />
      {!uploadingDashboard && getReportByType(reportType, informData)}
      {uploadingDashboard && <LoadingIco />}
      <Button appearance='primary' onClick={sendToTelegram} className={styles.pdfBtn}>
        Архивга олиш
      </Button>
    </div>
  );
};