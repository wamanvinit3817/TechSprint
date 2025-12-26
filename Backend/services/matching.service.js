function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return NaN;
  if (a.length === 0 || b.length === 0) return NaN;
  if (a.length !== b.length) return NaN;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return NaN;

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { cosineSimilarity };
