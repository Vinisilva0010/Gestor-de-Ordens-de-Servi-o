
import { ServiceOrder } from '../types';

// Fix: Add type declaration for jspdf on the window object to fix TypeScript error.
declare global {
  interface Window {
    jspdf: any;
  }
}

// Use jsPDF from the global scope (window)
const { jsPDF } = window.jspdf;

// A utility to format date strings
const formatDate = (dateString: string) => new Date(dateString).toLocaleString('pt-BR');

/**
 * Exports an array of service orders to a CSV file.
 * @param orders The array of service orders to export.
 * @param filename The desired name of the output file.
 */
export const exportToCsv = (orders: ServiceOrder[], filename = 'ordens_de_servico.csv'): void => {
  const headers = ['Nº OS', 'Cliente/Solicitante', 'Descrição', 'Prioridade', 'Departamento', 'Status', 'Data de Criação', 'Notas'];
  const rows = orders.map(os => [
    os.osNumber,
    os.client,
    `"${os.description.replace(/"/g, '""')}"`, // Escape double quotes
    os.priority,
    os.department,
    os.status,
    formatDate(os.createdAt),
    `"${os.notes.map(n => {
        let noteContent = `${formatDate(n.createdAt)}: ${n.text}`;
        if (n.checklist && n.checklist.length > 0) {
            const checklistString = n.checklist.map(item => `[${item.completed ? 'x' : ' '}] ${item.text}`).join(', ');
            noteContent += ` (Checklist: ${checklistString})`;
        }
        return noteContent;
    }).join('; ').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


/**
 * Exports a detailed report of a single service order to a PDF file.
 * @param order The service order to export.
 */
export const exportOrderToPdf = (order: ServiceOrder): void => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Ordem de Serviço: ${order.osNumber}`, 14, 22);

  doc.setFontSize(12);
  doc.text(`Data de Criação: ${formatDate(order.createdAt)}`, 14, 32);
  
  const details = [
      ['Cliente/Solicitante', order.client],
      ['Departamento', order.department],
      ['Prioridade', order.priority],
      ['Status', order.status],
      ['Descrição', order.description]
  ];

  (doc as any).autoTable({
      startY: 40,
      head: [['Campo', 'Detalhe']],
      body: details,
      theme: 'grid',
      styles: {
          cellPadding: 2,
          fontSize: 10,
      },
      headStyles: {
          fillColor: [79, 70, 229] // zanvexis-primary
      },
      columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 'auto' }
      }
  });

  if (order.notes.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      doc.setFontSize(14);
      doc.text('Notas Adicionais', 14, finalY + 15);

      let currentY = finalY + 22;
      const sortedNotes = [...order.notes].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      sortedNotes.forEach(note => {
        if (currentY > 270) { // Add new page if content overflows
            doc.addPage();
            currentY = 20;
        }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        const splitTitle = doc.splitTextToSize(`${formatDate(note.createdAt)} - ${note.text}`, 180);
        doc.text(splitTitle, 14, currentY);
        currentY += (splitTitle.length * 5);
        
        if (note.checklist && note.checklist.length > 0) {
            doc.setFont('helvetica', 'normal');
            note.checklist.forEach(item => {
                if (currentY > 275) {
                    doc.addPage();
                    currentY = 20;
                }
                const splitItem = doc.splitTextToSize(`- [${item.completed ? 'X' : ' '}] ${item.text}`, 170);
                doc.text(splitItem, 20, currentY);
                currentY += (splitItem.length * 5);
            });
        }
        currentY += 4; // space between notes
      });
  }
  
  doc.save(`OS_${order.osNumber}.pdf`);
};

/**
 * Exports a summary report of multiple service orders to a PDF file.
 * @param orders The array of service orders to export.
 */
export const exportAllToPdf = (orders: ServiceOrder[]): void => {
    const doc = new jsPDF();
    doc.text('Relatório de Ordens de Serviço', 14, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 26);

    const head = [['Nº OS', 'Cliente', 'Departamento', 'Prioridade', 'Status', 'Data de Criação']];
    const body = orders.map(os => [
        os.osNumber,
        os.client,
        os.department,
        os.priority,
        os.status,
        formatDate(os.createdAt)
    ]);

    (doc as any).autoTable({
        startY: 35,
        head,
        body,
        theme: 'striped',
        headStyles: {
            fillColor: [79, 70, 229] // zanvexis-primary
        }
    });

    doc.save('relatorio_os_zanvexis.pdf');
};
