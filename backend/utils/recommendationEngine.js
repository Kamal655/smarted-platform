/**
 * Lightweight TF-IDF + Cosine Similarity Engine
 * ─────────────────────────────────────────────
 * Purely in-memory. No external dependencies.
 * Used to score internship relevance against a student profile.
 */

// Stopwords to exclude from IDF vocabulary
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'not',
  'this', 'that', 'these', 'those', 'we', 'you', 'he', 'she', 'it',
  'they', 'our', 'your', 'their', 'its', 'all', 'any', 'each', 'into',
  'also', 'more', 'about', 'such', 'via', 'per', 'etc', 'strong',
  'good', 'work', 'working', 'knowledge', 'experience', 'ability',
  'skills', 'looking', 'seeking', 'candidate', 'must', 'require',
  'required', 'preferred', 'including', 'role', 'opportunity',
  'join', 'team', 'help', 'able', 'well', 'use', 'using',
]);

/**
 * Tokenizes and normalises a text string into an array of lowercase words.
 * Strips punctuation, numbers, and stopwords.
 */
export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s+#]/g, ' ')  // keep # for C#
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * Builds a term-frequency map from a token array.
 * { word: normalised_tf }
 */
function termFrequency(tokens) {
  const freq = {};
  for (const t of tokens) freq[t] = (freq[t] || 0) + 1;
  const total = tokens.length || 1;
  const tf = {};
  for (const [term, count] of Object.entries(freq)) {
    tf[term] = count / total;
  }
  return tf;
}

/**
 * Computes IDF for each term across a corpus of TF maps.
 * IDF(t) = log( N / (1 + df(t)) ) + 1   (smoothed)
 */
function inverseDocumentFrequency(tfMaps) {
  const N = tfMaps.length;
  const df = {};
  for (const tf of tfMaps) {
    for (const term of Object.keys(tf)) {
      df[term] = (df[term] || 0) + 1;
    }
  }
  const idf = {};
  for (const [term, count] of Object.entries(df)) {
    idf[term] = Math.log(N / (1 + count)) + 1;
  }
  return idf;
}

/**
 * Multiplies TF × IDF for each term to get the TF-IDF vector.
 */
function tfidfVector(tf, idf) {
  const vec = {};
  for (const [term, tfVal] of Object.entries(tf)) {
    vec[term] = tfVal * (idf[term] || 1);
  }
  return vec;
}

/**
 * Cosine similarity between two sparse vector objects.
 * Returns a float in [0, 1].
 */
function cosineSimilarity(a, b) {
  const keysA = Object.keys(a);
  if (!keysA.length) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (const k of keysA) {
    dot += (a[k] || 0) * (b[k] || 0);
    magA += a[k] * a[k];
  }
  for (const v of Object.values(b)) magB += v * v;

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Bonus: direct keyword hit multiplier.
 * Each skill that literally appears in an internship's text gives extra weight.
 * This compensates for short resume skill lists that score low in TF-IDF.
 */
function keywordBonus(skillNames, internshipText) {
  if (!skillNames.length) return 0;
  const lower = internshipText.toLowerCase();
  let hits = 0;
  for (const skill of skillNames) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i');
    if (re.test(lower)) hits++;
  }
  // Return a 0–0.40 bonus (capped)
  return Math.min(hits / skillNames.length, 1) * 0.40;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Ranks internships by relevance to a student profile.
 *
 * @param {Object} studentProfile  - { skills: string[], appliedDescriptions: string[] }
 * @param {Array}  internships     - MongoDB Internship documents
 * @param {number} topN            - Max results to return (default 10)
 * @returns {Array} Sorted array of { internship, relevanceScore, matchLabel }
 */
export function rankInternships(studentProfile, internships, topN = 10) {
  const { skills = [], appliedDescriptions = [] } = studentProfile;

  // 1. Build the student "query document" from skills + applied history
  const studentText = [
    ...skills,
    // Expand applied descriptions to reinforce preference signals
    ...appliedDescriptions.flatMap((desc) => tokenize(desc).slice(0, 20)),
  ].join(' ');

  const studentTokens = tokenize(studentText);
  if (!studentTokens.length) {
    // No profile data — return internships in creation order with a zero score
    return internships.slice(0, topN).map((i) => ({
      internship: i,
      relevanceScore: 0,
      matchLabel: 'New',
    }));
  }

  // 2. Build corpus: student document + all internship documents
  const internshipTexts = internships.map(
    (i) => `${i.title} ${i.title} ${i.description}` // double title for weight boost
  );

  const allTokenSets = [studentTokens, ...internshipTexts.map(tokenize)];
  const allTFs = allTokenSets.map(termFrequency);
  const idf = inverseDocumentFrequency(allTFs);

  const studentVec = tfidfVector(allTFs[0], idf);

  // 3. Score each internship
  const scored = internships.map((internship, idx) => {
    const internVec = tfidfVector(allTFs[idx + 1], idf);
    const tfidfScore = cosineSimilarity(studentVec, internVec);
    const bonus = keywordBonus(skills, internshipTexts[idx]);

    // Final score = weighted blend, converted to 0–100
    const rawScore = tfidfScore * 0.70 + bonus;
    const relevanceScore = Math.min(Math.round(rawScore * 100), 100);

    return { internship, relevanceScore, matchLabel: getMatchLabel(relevanceScore) };
  });

  // 4. Sort descending and return top N
  return scored
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, topN);
}

function getMatchLabel(score) {
  if (score >= 75) return 'Best Match';
  if (score >= 50) return 'Good Match';
  if (score >= 25) return 'Fair Match';
  return 'Explore';
}
