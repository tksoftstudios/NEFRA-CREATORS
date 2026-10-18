/**
 * Unit Test Suite for Escrow State Machine and Financial Math
 * Validates Section 8 of NEFRA_BUILD_GUIDE.md
 */

import { canTransition, transitionContract, ESCROW_STATES } from '../src/packages/escrow/stateMachine.js';
import { calculateContractFees, calculateMilestones } from '../src/packages/escrow/feeCalculator.js';

console.log('🧪 Running Escrow Engine & Financial Math Tests...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// --- Test Suite 1: State Machine Allowed Transitions ---
console.log('Suite 1: Valid State Transitions');
assert(canTransition(ESCROW_STATES.PENDING_PAYMENT, ESCROW_STATES.FUNDED), 'pending_payment -> funded');
assert(canTransition(ESCROW_STATES.FUNDED, ESCROW_STATES.IN_PRODUCTION), 'funded -> in_production');
assert(canTransition(ESCROW_STATES.IN_PRODUCTION, ESCROW_STATES.DRAFT_REVIEW), 'in_production -> draft_review');
assert(canTransition(ESCROW_STATES.DRAFT_REVIEW, ESCROW_STATES.APPROVED), 'draft_review -> approved');
assert(canTransition(ESCROW_STATES.DRAFT_REVIEW, ESCROW_STATES.REVISION_REQUESTED), 'draft_review -> revision_requested');
assert(canTransition(ESCROW_STATES.APPROVED, ESCROW_STATES.RELEASED), 'approved -> released');
assert(canTransition(ESCROW_STATES.FUNDED, ESCROW_STATES.DISPUTED), 'funded -> disputed');
assert(canTransition(ESCROW_STATES.DRAFT_REVIEW, ESCROW_STATES.DISPUTED), 'draft_review -> disputed');
assert(canTransition(ESCROW_STATES.DISPUTED, ESCROW_STATES.RELEASED), 'disputed -> released');
assert(canTransition(ESCROW_STATES.DISPUTED, ESCROW_STATES.REFUNDED), 'disputed -> refunded');

// --- Test Suite 2: Disallowed State Transitions ---
console.log('\nSuite 2: Disallowed State Transitions Throw Errors');
assert(!canTransition(ESCROW_STATES.FUNDED, ESCROW_STATES.RELEASED), 'funded CANNOT jump directly to released');
assert(!canTransition(ESCROW_STATES.PENDING_PAYMENT, ESCROW_STATES.APPROVED), 'pending_payment CANNOT jump to approved');
assert(!canTransition(ESCROW_STATES.RELEASED, ESCROW_STATES.IN_PRODUCTION), 'released is terminal');
assert(!canTransition(ESCROW_STATES.REFUNDED, ESCROW_STATES.RELEASED), 'refunded is terminal');

let threwOnIllegalJump = false;
try {
  transitionContract({ state: ESCROW_STATES.FUNDED }, ESCROW_STATES.RELEASED);
} catch (e) {
  threwOnIllegalJump = true;
}
assert(threwOnIllegalJump, 'transitionContract throws error on illegal transition');

// --- Test Suite 3: Fee Math & Cents Precision ---
console.log('\nSuite 3: Integer Cents Fee Calculations');
const fee1 = calculateContractFees(250000, 10); // $2,500.00 at 10%
assert(fee1.grossAmountCents === 250000, 'Gross is 250,000 cents ($2,500.00)');
assert(fee1.platformFeeCents === 25000, 'Platform fee is 25,000 cents ($250.00)');
assert(fee1.netCreatorCents === 225000, 'Net creator payout is 225,000 cents ($2,250.00)');
assert(fee1.escrowHeldCents === 250000, 'Escrow hold is 100% of gross');

// Test 15% VIP rate
const fee2 = calculateContractFees(100000, 15); // $1,000.00 at 15%
assert(fee2.platformFeeCents === 15000, 'Platform fee at 15% is 15,000 cents ($150.00)');
assert(fee2.netCreatorCents === 85000, 'Net creator payout is 85,000 cents ($850.00)');

// --- Test Suite 4: Milestone Math with Remainder Cents ---
console.log('\nSuite 4: 30 / 50 / 20 Milestone Math & Remainder Cents');
const totalCents = 100001; // $1,000.01 (odd cents)
const milestones = calculateMilestones(totalCents);
const sumMilestones = milestones.reduce((sum, m) => sum + m.amountCents, 0);

assert(milestones.length === 3, 'Exactly 3 milestones generated');
assert(milestones[0].percent === 30, 'Milestone 1 is 30%');
assert(milestones[1].percent === 50, 'Milestone 2 is 50%');
assert(milestones[2].percent === 20, 'Milestone 3 is 20%');
assert(sumMilestones === totalCents, `Milestone sum (${sumMilestones}) exactly equals total (${totalCents})`);

console.log(`\n🏁 Test Results: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);
