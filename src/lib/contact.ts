// Datos de contacto tomados de la bio de Instagram (@spazio_centroartistico) el 2026-09-18.
// Pendiente de confirmación por la academia (ver docs/SITEMAP.md, pendiente #5).
export const CONTACT = {
  whatsappDisplay: '22 13 07 46 45',
  whatsappHref: 'https://wa.me/522213074645',
  address: 'Av. Soledad #479, Planta Alta, Segundo Barrio, Huejotzingo, Puebla',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Av.+Soledad+479+Huejotzingo+Puebla',
  instagram: 'https://www.instagram.com/spazio_centroartistico/',
  // Facebook: solo se conoce el nombre de la página ("Spazio Centro Artístico"), no la URL exacta.
  // No se inventa el slug; se agrega cuando la academia lo confirme (ver docs/SITEMAP.md).
  facebook: null as string | null,
} as const;

export function whatsappHrefWithText(text: string): string {
  return `${CONTACT.whatsappHref}?text=${encodeURIComponent(text)}`;
}
