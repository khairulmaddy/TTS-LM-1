import { StudentAttempt } from '../types';
import { INITIAL_QUESTIONS } from '../data/questions';

/**
 * Generates an Excel-compatible downloadable file containing student quiz results.
 * Uses formatted XML Spreadsheet format (.xls / .xlsx readable) with UTF-8 support.
 */
export function exportToExcel(attempts: StudentAttempt[], filename = 'Rekap_Nilai_TTS_Digital_Onboarding.xls') {
  if (!attempts || attempts.length === 0) {
    alert('Belum ada data nilai siswa untuk diunduh.');
    return;
  }

  const questionHeaders = INITIAL_QUESTIONS.map(q => `Soal ${q.number} (${q.word})`);

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Title">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="14" ss:Color="#1F2937" ss:Bold="1"/>
  </Style>
  <Style ss:ID="DataCell">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="CenterCell">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
  <Style ss:ID="ScoreCell">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#15803D" ss:Bold="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Rekap Nilai Siswa">
  <Table>
   <Row ss:Height="25">
    <Cell ss:StyleID="Title"><Data ss:Type="String">REKAPITULASI PENILAIAN TEKA TEKI SILANG - DIGITAL ON BOARDING</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell><Data ss:Type="String">Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}</Data></Cell>
   </Row>
   <Row ss:Height="10"></Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="Header"><Data ss:Type="String">No</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Nama Siswa</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Kelas</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Mata Pelajaran</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Kesempatan Ke-</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Nilai Akhir (0-100)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Jumlah Benar</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Jumlah Salah</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Durasi (MM:SS)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Waktu Pengerjaan</Data></Cell>
`;

  questionHeaders.forEach(qh => {
    xml += `    <Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(qh)}</Data></Cell>\n`;
  });

  xml += `   </Row>\n`;

  attempts.forEach((att, index) => {
    const minutes = Math.floor(att.durationSeconds / 60);
    const seconds = att.durationSeconds % 60;
    const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    xml += `   <Row ss:Height="20">
    <Cell ss:StyleID="CenterCell"><Data ss:Type="Number">${index + 1}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(att.studentName)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(att.studentClass)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(att.subject)}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="Number">${att.attemptNumber}</Data></Cell>
    <Cell ss:StyleID="ScoreCell"><Data ss:Type="Number">${att.score}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="Number">${att.correctCount}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="Number">${att.wrongCount}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="String">${formattedDuration}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(att.completedAt)}</Data></Cell>
`;

    INITIAL_QUESTIONS.forEach(q => {
      const userAns = att.answers[q.id] || '-';
      const isCorrect = userAns.toUpperCase().trim() === q.word.toUpperCase().trim();
      const mark = isCorrect ? `[BENAR] ${userAns}` : `[SALAH] ${userAns}`;
      xml += `    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(mark)}</Data></Cell>\n`;
    });

    xml += `   </Row>\n`;
  });

  xml += `  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
