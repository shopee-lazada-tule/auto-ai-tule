export type TranslationMode = 'ENGLISH' | 'LOCAL' | 'ENGLISH_AND_LOCAL' | 'MANUAL';

export function buildTitle(sourceTitle: string, mode: TranslationMode) {
  if (mode === 'MANUAL') return sourceTitle;
  if (mode === 'LOCAL') return `${sourceTitle}（現地語タイトル）`;
  if (mode === 'ENGLISH_AND_LOCAL') return `${sourceTitle} 【Direct from Japan】 / 現地語タイトル`;
  return `${sourceTitle} 【Direct from Japan】`;
}

export function buildDescription(source: string, mode: TranslationMode) {
  if (mode === 'MANUAL') return source;
  const english = `Product details:
${source}
Ships from Japan.`;
  if (mode === 'LOCAL') return `現地語の商品説明:
${source}
日本から発送します。`;
  if (mode === 'ENGLISH_AND_LOCAL') return `${english}

Local description:
${source}`;
  return english;
}
