export async function translateToEnglish(text: string): Promise<string> {
  if (!text.trim()) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Translation request failed');
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((p: any) => p[0]).join('');
    }
  } catch (err) {
    console.error('translateToEnglish error', err);
  }
  return text;
}

export default translateToEnglish;
