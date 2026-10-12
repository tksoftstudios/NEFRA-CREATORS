import { CATEGORIES, SEED_CREATORS } from '../src/data/seedCreators.js';
import { formatSubscriberCount } from '../src/services/youtubeService.js';
import { 
  analyzeCreatorVideosWithGemini, 
  generateJobCardWithGemini, 
  rankCreatorsForJobWithGemini 
} from '../src/services/geminiService.js';

async function runTests() {
  console.log('🧪 Starting Nefra Core Pipeline Verification...\n');

  // Test 1: Category & Seed Data Integrity
  console.log('Test 1: Validating Categories and Pre-Seeded Creators');
  if (CATEGORIES.length !== 7) throw new Error(`Expected 7 categories, found ${CATEGORIES.length}`);
  if (SEED_CREATORS.length < 6) throw new Error(`Expected at least 6 seed creators, found ${SEED_CREATORS.length}`);
  
  SEED_CREATORS.forEach((creator) => {
    if (!creator.title || !creator.handle || !creator.avatar) {
      throw new Error(`Incomplete creator profile: ${JSON.stringify(creator)}`);
    }
    if (!creator.recentVideos || creator.recentVideos.length !== 3) {
      throw new Error(`Creator ${creator.title} must have exactly 3 recent videos`);
    }
    if (typeof creator.subscriberCount !== 'number' || creator.subscriberCount <= 0) {
      throw new Error(`Creator ${creator.title} has invalid subscriberCount`);
    }
  });
  console.log(`✅ All ${SEED_CREATORS.length} seed creators verified with valid profiles and 3 videos.\n`);

  // Test 2: Subscriber count formatter
  console.log('Test 2: Validating Subscriber Count Formatter');
  if (formatSubscriberCount(1680000) !== '1.68M') throw new Error('Format failed for 1.68M');
  if (formatSubscriberCount(420000) !== '420K') throw new Error('Format failed for 420K');
  if (formatSubscriberCount(950) !== '950') throw new Error('Format failed for 950');
  console.log('✅ Subscriber count formatting verified (1.68M, 420K, 950).\n');

  // Test 3: Gemini 3-Video Content Analyzer Pipeline
  console.log('Test 3: Testing Gemini 3-Video Content Analyzer Pipeline');
  const sampleCreator = SEED_CREATORS[0];
  const analysisResult = await analyzeCreatorVideosWithGemini('', sampleCreator, sampleCreator.recentVideos);
  
  if (!analysisResult.category || !analysisResult.tags || !analysisResult.nefraScore) {
    throw new Error('Analysis result missing required fields: ' + JSON.stringify(analysisResult));
  }
  if (!Array.isArray(analysisResult.tags) || analysisResult.tags.length < 3) {
    throw new Error('Analysis result must contain tags array');
  }
  console.log('✅ Gemini Content Analyzer output:');
  console.log(`   - Inferred Category: ${analysisResult.categoryLabel} (${analysisResult.category})`);
  console.log(`   - Generated Tags: ${analysisResult.tags.slice(0, 4).join(', ')}...`);
  console.log(`   - Nefra AI Score: ${analysisResult.nefraScore}/100\n`);

  // Test 4: Business Job Card Synthesis
  console.log('Test 4: Testing AI Job Card Builder');
  const testRequirement = "Looking for a tech YouTuber with 100k+ subscribers to review our developer IDE with $2,000 budget.";
  const jobCard = await generateJobCardWithGemini('', testRequirement);
  
  if (!jobCard.title || !jobCard.deliverables || !jobCard.estimatedBudget) {
    throw new Error('Job Card missing required fields: ' + JSON.stringify(jobCard));
  }
  console.log('✅ AI Job Card synthesized:');
  console.log(`   - Title: "${jobCard.title}"`);
  console.log(`   - Target Category: ${jobCard.targetCategoryLabel}`);
  console.log(`   - Budget: ${jobCard.estimatedBudget}`);
  console.log(`   - Deliverables: ${jobCard.deliverables.length} items\n`);

  // Test 5: AI Creator Matchmaker Ranking
  console.log('Test 5: Testing AI Creator Matchmaker');
  const ranked = await rankCreatorsForJobWithGemini('', jobCard, SEED_CREATORS.slice(0, 3));
  if (!Array.isArray(ranked) || ranked.length === 0) {
    throw new Error('Ranking returned empty list');
  }
  console.log(`✅ AI Ranked ${ranked.length} candidates with match scores and rationales.\n`);

  // Test 6: Singer & Music Campaign Recognition
  console.log('Test 6: Testing Singer & Vocalist Recognition');
  const singerRequirement = "Need a soulful acoustic singer or female vocalist to write an original song for our travel brand. Budget $2,200.";
  const musicJobCard = await generateJobCardWithGemini('', singerRequirement);
  if (musicJobCard.targetCategory !== 'music') {
    throw new Error(`Expected category 'music', got '${musicJobCard.targetCategory}'`);
  }
  console.log(`✅ Singer requirement accurately categorized as '${musicJobCard.targetCategoryLabel}' with tags: ${musicJobCard.requiredTags.join(', ')}\n`);

  console.log('🎉 ALL 6 TEST SUITES PASSED CLEANLY! Ready for Firebase deploy and video demo.\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
