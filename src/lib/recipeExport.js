import { Document, Packer, Paragraph, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'

function safeFileName(title) {
  return (title || 'rezept').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)
}

export async function exportRecipeAsWord(recipe) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: recipe.title, heading: HeadingLevel.TITLE }),
          new Paragraph({ text: `von ${recipe.author}${recipe.category ? ' · ' + recipe.category : ''}` }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Zutaten', heading: HeadingLevel.HEADING_1 }),
          ...(recipe.ingredients || []).map((ing) => new Paragraph({ text: `• ${ing}` })),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Zubereitung', heading: HeadingLevel.HEADING_1 }),
          ...(recipe.steps || []).map((step, i) => new Paragraph({ text: `${i + 1}. ${step}` })),
        ],
      },
    ],
  })
  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${safeFileName(recipe.title)}.docx`)
}

export function exportRecipeAsPdf(recipe) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 48
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - margin * 2
  let y = margin

  function addLine(text, { size = 11, bold = false, gapAfter = 14 } = {}) {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += size * 1.35
    })
    y += gapAfter
  }

  addLine(recipe.title, { size: 22, bold: true, gapAfter: 6 })
  addLine(`von ${recipe.author}${recipe.category ? ' · ' + recipe.category : ''}`, { size: 11, gapAfter: 20 })

  addLine('Zutaten', { size: 14, bold: true, gapAfter: 8 })
  ;(recipe.ingredients || []).forEach((ing) => addLine(`•  ${ing}`, { gapAfter: 6 }))
  y += 10

  addLine('Zubereitung', { size: 14, bold: true, gapAfter: 8 })
  ;(recipe.steps || []).forEach((step, i) => addLine(`${i + 1}. ${step}`, { gapAfter: 10 }))

  doc.save(`${safeFileName(recipe.title)}.pdf`)
}
