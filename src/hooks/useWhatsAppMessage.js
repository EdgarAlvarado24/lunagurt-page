const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '04145145068'

export function buildWhatsAppUrl({ formData, quantities, selectedFlavors, totalYogurts, totalPrice }) {
  const message = [
    '🍧 *Nuevo Pedido LunaGurt*',
    '',
    `*Cliente:* ${formData.name}`,
    `*Dirección:* ${formData.address}`,
    formData.phone ? `*Teléfono:* ${formData.phone}` : '',
    '',
    '*Pedido:*',
    quantities.individual > 0 ? `- ${quantities.individual}x Yogur Individual ($${quantities.individual * 5})` : '',
    quantities.duo > 0 ? `- ${quantities.duo}x Dúo ($${quantities.duo * 10})` : '',
    quantities.family > 0 ? `- ${quantities.family}x Pack Familiar ($${quantities.family * 13})` : '',
    '',
    `*Sabores:* ${selectedFlavors.join(', ')}`,
    '',
    `*Total yogures:* ${totalYogurts}`,
    `*Total:* $${totalPrice}`,
  ]
    .filter(Boolean)
    .join('%0A')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

export function openWhatsApp({ formData, quantities, selectedFlavors, totalYogurts, totalPrice }) {
  const url = buildWhatsAppUrl({ formData, quantities, selectedFlavors, totalYogurts, totalPrice })
  window.open(url, '_blank', 'noopener,noreferrer')
}
