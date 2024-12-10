import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Record {
  "Carimbo de data/hora": string;
  Cliente: string;
  Matricula: string;
  "Número encomenda": string;
  "Registos - Fotos": string;
  Operador: string;
  "Nome da empresa": string;
  "Número Contentor": string;
  Id: number;
}

export const generatePDF = async (record: Record) => {
  console.log('Generating PDF for record:', record);

  // Create a temporary div to render the template
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="container" style="padding: 20px; font-family: Arial, sans-serif;">
      <header style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="https://static.wixstatic.com/media/54ce03_0a1fa1d6e23049299a173a90cde79521~mv2.png" 
             alt="Logo" style="width: 96px; height: 77px; margin-right: 20px;">
        <div>
          <h1 style="margin: 0; color: #333;">REGISTO DE CARGA</h1>
          <p><strong>Data:</strong> ${record["Carimbo de data/hora"]}</p>
        </div>
      </header>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th colspan="2" style="padding: 10px; text-align: left; background-color: #f7f7f7;">
              Detalhes do Registo de Carga
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Data:</td>
            <td style="padding: 10px;">${record["Carimbo de data/hora"]}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Cliente:</td>
            <td style="padding: 10px;">${record.Cliente}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Número de Encomenda:</td>
            <td style="padding: 10px;">${record["Número encomenda"]}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Número de Contentor:</td>
            <td style="padding: 10px;">${record["Número Contentor"] || 'Não aplica'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Nome da Empresa:</td>
            <td style="padding: 10px;">${record["Nome da empresa"]}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Matrícula:</td>
            <td style="padding: 10px;">${record.Matricula}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Operador:</td>
            <td style="padding: 10px;">${record.Operador}</td>
          </tr>
        </tbody>
      </table>

      <div class="fotos" style="margin-top: 20px;"></div>
    </div>
  `;

  // Add photos to the template
  const fotosContainer = container.querySelector('.fotos');
  if (fotosContainer && record["Registos - Fotos"]) {
    const urls = record["Registos - Fotos"].split(',');
    for (const url of urls) {
      if (url.trim()) {
        const img = document.createElement('img');
        img.src = url.trim();
        img.alt = "Foto do registo de carga";
        img.style.width = '100%';
        img.style.marginBottom = '10px';
        fotosContainer.appendChild(img);
      }
    }
  }

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      logging: true,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`registo-carga-${record.Id}.pdf`);
    
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    document.body.removeChild(container);
  }
};