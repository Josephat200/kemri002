import ExcelJS from 'exceljs';
import { RespondentModel } from '../models/RespondentModel';

const appendSummaryRow = (
  worksheet: ExcelJS.Worksheet,
  label: string,
  value: string | number
) => {
  const row = worksheet.addRow([label, value]);
  row.getCell(1).font = { bold: true };
  row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
};

export class ExcelExportService {
  static async buildRespondentWorkbook(): Promise<Buffer> {
    const respondents = await RespondentModel.getAllForExport();
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'KEMRI RH Survey System';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.subject = 'Respondent export';
    workbook.title = 'KEMRI RH Survey Respondents';

    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 32 },
      { header: 'Value', key: 'value', width: 20 },
    ];

    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } };

    const total = respondents.length;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const thisYear = respondents.filter((respondent) => new Date(respondent.collection_date).getFullYear() === currentYear).length;
    const thisMonth = respondents.filter((respondent) => {
      const respondentDate = new Date(respondent.collection_date);
      return respondentDate.getFullYear() === currentYear && respondentDate.getMonth() === currentMonth;
    }).length;

    appendSummaryRow(summarySheet, 'Total Respondents', total);
    appendSummaryRow(summarySheet, 'Respondents This Month', thisMonth);
    appendSummaryRow(summarySheet, 'Respondents This Year', thisYear);
    appendSummaryRow(summarySheet, 'Generated At', new Date().toISOString());

    summarySheet.addRow([]);
    summarySheet.addRow(['Respondents by School', 'Count']);
    summarySheet.getRow(summarySheet.rowCount).font = { bold: true };

    const bySchool = respondents.reduce<Record<string, number>>((accumulator, respondent) => {
      accumulator[respondent.school_name] = (accumulator[respondent.school_name] || 0) + 1;
      return accumulator;
    }, {});

    Object.entries(bySchool).forEach(([schoolName, count]) => {
      summarySheet.addRow([schoolName, count]);
    });

    summarySheet.addRow([]);
    summarySheet.addRow(['Age Distribution', 'Count']);
    summarySheet.getRow(summarySheet.rowCount).font = { bold: true };

    const byAge = respondents.reduce<Record<string, number>>((accumulator, respondent) => {
      const key = String(respondent.age);
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    Object.entries(byAge).forEach(([age, count]) => {
      summarySheet.addRow([age, count]);
    });

    const respondentsSheet = workbook.addWorksheet('Respondents');
    respondentsSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Serial Number', key: 'serial_no', width: 18 },
      { header: 'School Name', key: 'school_name', width: 24 },
      { header: 'Supervisor Name', key: 'supervisor_name', width: 24 },
      { header: 'Collection Date', key: 'collection_date', width: 16 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Stay With', key: 'stay_with', width: 14 },
      { header: 'Guardian Occupation', key: 'guardian_occupation', width: 18 },
      { header: 'Guardian Education', key: 'guardian_education', width: 18 },
      { header: 'Religion', key: 'religion', width: 12 },
      { header: 'Family Size', key: 'family_size', width: 12 },
      { header: 'Older Siblings', key: 'older_siblings', width: 14 },
      { header: 'Parents Give Pocket Money', key: 'parents_give_pocket_money', width: 22 },
      { header: 'Financial Support Source', key: 'financial_support_source', width: 20 },
      { header: 'Guardian Visits', key: 'guardian_visits', width: 14 },
      { header: 'Has RH Info', key: 'has_rh_info', width: 12 },
      { header: 'Info Adequate', key: 'info_adequate', width: 12 },
      { header: 'Created At', key: 'created_at', width: 20 },
    ];

    respondentsSheet.getRow(1).font = { bold: true };
    respondentsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } };

    respondents.forEach((respondent) => {
      respondentsSheet.addRow({
        id: respondent.id,
        serial_no: respondent.serial_no,
        school_name: respondent.school_name,
        supervisor_name: respondent.supervisor_name,
        collection_date: respondent.collection_date,
        age: respondent.age,
        stay_with: respondent.stay_with,
        guardian_occupation: respondent.guardian_occupation,
        guardian_education: respondent.guardian_education,
        religion: respondent.religion,
        family_size: respondent.family_size,
        older_siblings: respondent.older_siblings,
        parents_give_pocket_money: respondent.parents_give_pocket_money,
        financial_support_source: respondent.financial_support_source,
        guardian_visits: respondent.guardian_visits,
        has_rh_info: respondent.has_rh_info,
        info_adequate: respondent.info_adequate,
        created_at: respondent.created_at,
      });
    });

    respondentsSheet.views = [{ state: 'frozen', ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer as ArrayBuffer);
  }
}