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

const createPDFContent = (record: Record) => {
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

  return container;
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

export const generatePDF = async (record: Record) => {
  try {
    console.log('Starting PDF generation for record:', record);
    const container = createPDFContent(record);
    document.body.appendChild(container);

    // Handle photos
    const fotosContainer = container.querySelector('.fotos');
    if (fotosContainer && record["Registos - Fotos"]) {
      const urls = record["Registos - Fotos"].split(',').map(url => url.trim());
      console.log('Processing photos:', urls);

      for (const url of urls) {
        if (url) {
          try {
            const img = await loadImage(url);
            img.style.width = '100%';
            img.style.marginBottom = '10px';
            img.style.maxHeight = '300px';
            img.style.objectFit = 'contain';
            fotosContainer.appendChild(img);
          } catch (error) {
            console.error('Error loading image:', url, error);
          }
        }
      }
    }

    // Generate PDF with better quality
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate scaling to fit content properly
    const contentRatio = canvas.height / canvas.width;
    const pageRatio = pdfHeight / pdfWidth;
    
    let finalWidth = pdfWidth;
    let finalHeight = pdfWidth * contentRatio;
    
    // If content is taller than page, scale it down
    if (finalHeight > pdfHeight) {
      finalHeight = pdfHeight;
      finalWidth = pdfHeight / contentRatio;
    }
    
    // Center content horizontally if needed
    const xOffset = (pdfWidth - finalWidth) / 2;
    
    pdf.addImage(imgData, 'JPEG', xOffset, 0, finalWidth, finalHeight);
    pdf.save(`registo-carga-${record.Id}.pdf`);
    
    document.body.removeChild(container);
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};