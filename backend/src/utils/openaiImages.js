const DEFAULT_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const OPENAI_IMAGE_ENDPOINT = 'https://api.openai.com/v1/images/generations';

function buildVariantPrompt(details, variant) {
  const title = String(details.title || details.name || 'Plant').trim();
  const category = String(details.category || 'plant').trim();
  const description = String(details.description || '').trim();
  const benefits = String(details.benefits || '').trim();
  const height = String(details.height || '').trim();
  const potSize = String(details.potSize || '').trim();
  const watering = String(details.watering || '').trim();
  const sunlight = String(details.sunlight || '').trim();
  const fertilizer = String(details.fertilizer || '').trim();

  const core = [
    `Product: ${title}`,
    `Category: ${category}`,
    description ? `Description: ${description}` : '',
    benefits ? `Benefits: ${benefits}` : '',
    height ? `Height: ${height}` : '',
    potSize ? `Pot: ${potSize}` : '',
    watering ? `Watering: ${watering}` : '',
    sunlight ? `Sunlight: ${sunlight}` : '',
    fertilizer ? `Fertilizer: ${fertilizer}` : ''
  ]
    .filter(Boolean)
    .join(' | ');

  if (variant === 'lifestyle') {
    return [
      `Create a premium lifestyle ecommerce photograph for a ${title}.`,
      core,
      'Show the plant styled in a modern Indian home interior with natural sunlight, tasteful decor, and a premium retail look.',
      'Keep the plant as the hero subject, realistic proportions, crisp leaves, and a clean premium composition.',
      'No people, no text, no logos, no watermark.'
    ].join(' ');
  }

  if (variant === 'detail') {
    return [
      `Create a hyper-realistic detail shot for a ${title}.`,
      core,
      'Focus on leaf texture, healthy growth, pot details, and fresh soil texture.',
      'Use a clean editorial look with shallow depth of field and premium marketplace quality.',
      'No people, no text, no logos, no watermark.'
    ].join(' ');
  }

  return [
    `Create a premium ecommerce product image for a ${title}.`,
    core,
    'Use a pure seamless white background, centered subject, studio lighting, crisp shadows kept minimal, and a clean marketplace-style composition.',
    'The image should feel like a high-end Amazon/Flipkart listing photo, photorealistic and professionally shot.',
    'No people, no text, no logos, no watermark.'
  ].join(' ');
}

async function generateSingleImage(prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch(OPENAI_IMAGE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: DEFAULT_IMAGE_MODEL,
      prompt,
      size: '1024x1024'
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.message || 'OpenAI image generation failed';
    throw new Error(message);
  }

  const base64 = payload?.data?.[0]?.b64_json || payload?.b64_json;
  if (!base64) {
    throw new Error('OpenAI image generation returned no image data');
  }

  return {
    base64,
    revisedPrompt: payload?.data?.[0]?.revised_prompt || payload?.revised_prompt || '',
    usage: payload?.usage || null
  };
}

export async function generateProductImageSet(details, count = 3) {
  const variants = ['studio', 'lifestyle', 'detail'];
  const limit = Math.min(Math.max(Number(count) || 3, 1), variants.length);
  const selectedVariants = variants.slice(0, limit);

  const results = [];
  for (const variant of selectedVariants) {
    const prompt = buildVariantPrompt(details, variant);
    const result = await generateSingleImage(prompt);
    results.push({
      variant,
      prompt,
      ...result
    });
  }

  return results;
}
