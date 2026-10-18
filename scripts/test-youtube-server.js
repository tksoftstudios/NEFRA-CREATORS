/**
 * Test Server YouTube Verification and Firestore Logic
 */
import { handleYouTubeConnect, handleYouTubeDisconnect } from '../src/server/apiHandler.js';

async function runTest() {
  console.log('🧪 Testing Server-Side YouTube Verification & Firestore Handler...');

  // 1. Connect YouTube Channel
  const connectRes = await handleYouTubeConnect({
    creatorId: 'creator_01',
    accessToken: 'sandbox_demo_token',
    googleUser: {
      uid: 'google_test_uid_01',
      email: 'creator@nefra.io',
      displayName: 'Kaveen Tech Official'
    },
    customHandle: '@kaveentech'
  });

  console.log('✅ Connect result:', {
    success: connectRes.success,
    serverVerified: connectRes.channel?.serverVerified,
    channelId: connectRes.channel?.channelId,
    subscribers: connectRes.channel?.subscribersFormatted,
    firestoreSaved: connectRes.firestoreSaved
  });

  if (!connectRes.success || !connectRes.channel?.serverVerified) {
    throw new Error('Connect failed verification');
  }

  // 2. Disconnect YouTube Channel
  const disconnectRes = await handleYouTubeDisconnect({
    creatorId: 'creator_01'
  });

  console.log('✅ Disconnect result:', disconnectRes);

  if (!disconnectRes.success) {
    throw new Error('Disconnect failed');
  }

  console.log('🎉 Server-side YouTube connection & Firestore tests PASSED!');
  process.exit(0);
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
