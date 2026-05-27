/**
 * Helpers para lidar com URLs do YouTube.
 */

/**
 * Extrai o videoId de uma URL do YouTube em qualquer formato:
 *  - https://www.youtube.com/watch?v=ABC123
 *  - https://youtu.be/ABC123
 *  - https://www.youtube.com/embed/ABC123
 *  - https://www.youtube.com/shorts/ABC123
 *
 * Retorna o ID ou null se a URL nao for valida.
 */
export function extrairVideoId(url) {
  if (!url || typeof url !== 'string') return null;

  const padroes = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/
  ];

  for (const padrao of padroes) {
    const match = url.match(padrao);
    if (match) return match[1];
  }

  return null;
}

/** Gera a URL de embed (iframe) a partir de qualquer link do YouTube. */
export function urlEmbed(url) {
  const id = extrairVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** Gera a URL da thumbnail (capa) a partir de qualquer link do YouTube. */
export function urlThumb(url) {
  const id = extrairVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
