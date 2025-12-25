function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  return [...A].filter(x => B.has(x)).length / new Set([...A, ...B]).size || 0;
}

function matchScore(lost, found) {
  let score = 0;

  score += jaccard(lost.labels, found.labels) * 0.4;
  score += jaccard(lost.objects, found.objects) * 0.4;
  score += jaccard(lost.colors, found.colors) * 0.2;

  if (lost.text.some(t => found.text.includes(t))) {
    score += 1.0;
  }

  return score;
}

module.exports = { matchScore };
