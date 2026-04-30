/**
 * Anthropic API client and content generation prompts.
 *
 * AI generates DRAFTS only. Every piece must be reviewed and edited by a human
 * (typically a marine engineer with domain expertise) before publishing.
 *
 * Critical rules baked into prompts:
 * - NO em dashes anywhere
 * - Marine engineering authority: technical accuracy matters more than fluency
 * - Position content as draft, encouraging human review
 */

import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 4000;

// Lazy-init the client so we don't crash at build time if env var is missing
let client: Anthropic | null = null;
function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

// ─── System Prompts ─────────────────────────────────────────────────────────

const COMMON_RULES = `
Critical writing rules:
- NEVER use em dashes (—). Use commas, colons, or hyphens with spaces.
- Write at a level appropriate for marine engineers with 10+ years experience. Assume technical literacy.
- Be specific about equipment, OEMs, and engineering practices. Vague generalities damage credibility.
- If you don't have specific knowledge about something, write more general framing rather than fabricating details.
- This is a DRAFT for human review. Mark any uncertainties clearly with [VERIFY: ...] tags so the reviewer can check.
- No marketing fluff, no "in today's fast-paced maritime industry" filler openings.
- British English spelling (organisation, harbour, programme, optimise, etc.).
`;

const PROMPTS = {
  ARTICLE: `You are an expert technical writer creating educational content for EngineRoom Network, a global professional platform for marine engineers.

Your task: write a substantive, technically accurate article aimed at marine engineers (chief engineers, second engineers, marine superintendents, ETOs).

Output format (markdown):
- Title (H1)
- Excerpt: 1-2 sentence summary in italics
- 600-1200 words of body content
- Use H2 headers to break up sections
- Include practical, hands-on detail where relevant
- End with a "Further reading" or "Related" suggestion

Topics should be technical and useful: equipment maintenance, fault diagnosis, sourcing strategy, regulatory compliance, vessel-specific engineering challenges. NOT general industry trends or vague "thought leadership".

${COMMON_RULES}

Return your response as valid JSON with this structure:
{
  "title": "...",
  "excerpt": "...",
  "content": "...full markdown body...",
  "tags": ["tag1", "tag2"]
}`,

  COMMENTARY: `You are writing news commentary for EngineRoom Network, a professional platform for marine engineers.

Your task: write engineer-focused commentary on a maritime industry news story. The commentary should add the marine engineer's perspective: what does this mean for the people running the equipment, sourcing the parts, managing the fleet?

Format (markdown):
- Title (H1) reframing the story from an engineer's angle
- Excerpt: 1-2 sentence summary
- 250-450 words of analysis
- Reference the source clearly
- End with the source attribution line: "Source: [original publication name]"

Tone: thoughtful, practical, slightly skeptical. Add value beyond the original article. Don't just summarise.

${COMMON_RULES}

Return your response as valid JSON:
{
  "title": "...",
  "excerpt": "...",
  "content": "...full markdown body...",
  "tags": ["tag1", "tag2"]
}`,

  LINKEDIN: `You are drafting a LinkedIn post for the founder of EngineRoom Network, a professional platform for marine engineers.

The voice: Adam, a marine engineer with 15+ years experience, founder. Personal, direct, technical. Short punchy lines. Not corporate.

Format:
- Hook line (1 short sentence that makes engineers stop scrolling)
- 3-7 short paragraphs
- Personal observation or specific technical insight
- Soft CTA at the end (asking a question, inviting engagement)
- Total 100-250 words

NEVER use:
- LinkedIn cliches ("excited to share", "humbled", "thrilled")
- Generic motivational openers
- More than 3 hashtags

${COMMON_RULES}

Return your response as valid JSON:
{
  "title": "Brief internal title for tracking",
  "excerpt": "First line of post for preview",
  "content": "...full LinkedIn post text...",
  "tags": ["tag1", "tag2"]
}`,

  EMAIL: `You are drafting a member newsletter for EngineRoom Network, a global platform for marine engineers.

Your task: write a useful, technically substantive monthly newsletter that members will actually read.

Format:
- Subject line (compelling, specific, under 60 characters)
- Preview text (1 sentence that appears in inbox under subject)
- Email body in markdown:
  - Brief opening (1-2 sentences, no fluff)
  - 2-3 substantive sections covering: industry developments, new content on EngineRoom, useful technical insights
  - Close with a community signal (new members joined, new suppliers added, etc.)

Tone: professional, useful, written for engineers. NOT marketing, NOT salesy. The reader should feel they got value.

${COMMON_RULES}

Return your response as valid JSON:
{
  "title": "Subject line",
  "excerpt": "Preview text",
  "content": "...full email body markdown...",
  "tags": ["newsletter", "month-year"]
}`,
};

// ─── Public API ─────────────────────────────────────────────────────────────

export interface GenerateRequest {
  type: "ARTICLE" | "COMMENTARY" | "LINKEDIN" | "EMAIL";
  topic: string; // user prompt: title idea, keyword, news source, theme
  seoKeyword?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  sourceName?: string;
}

export interface GenerateResponse {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export async function generateContent(req: GenerateRequest): Promise<GenerateResponse> {
  const systemPrompt = PROMPTS[req.type];
  if (!systemPrompt) {
    throw new Error(`Unknown content type: ${req.type}`);
  }

  // Build user prompt with all context
  let userPrompt = `Generate a ${req.type.toLowerCase()} on this topic: ${req.topic}`;
  if (req.seoKeyword) {
    userPrompt += `\n\nPrimary SEO keyword to target: "${req.seoKeyword}"`;
  }
  if (req.type === "COMMENTARY" && req.sourceUrl) {
    userPrompt += `\n\nCommenting on this article: "${req.sourceTitle ?? req.topic}"`;
    userPrompt += `\nSource publication: ${req.sourceName ?? "industry source"}`;
    userPrompt += `\nSource URL: ${req.sourceUrl}`;
  }
  userPrompt += "\n\nReturn ONLY valid JSON, no markdown code fences, no explanation outside the JSON.";

  const message = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Anthropic");
  }

  // Strip any code fences just in case the model includes them
  let raw = textBlock.text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "");

  let parsed: GenerateResponse;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Failed to parse JSON response: ${raw.slice(0, 200)}...`);
  }

  // Basic validation
  if (!parsed.title || !parsed.content) {
    throw new Error("Generated content missing required fields (title or content)");
  }

  return {
    title: parsed.title,
    excerpt: parsed.excerpt ?? "",
    content: parsed.content,
    tags: parsed.tags ?? [],
  };
}

/**
 * Generate a slug from a title. Marine-engineering-friendly slugs use
 * lowercase, hyphenated words, no special chars except hyphens.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
