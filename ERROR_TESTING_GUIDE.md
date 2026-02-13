# Testing Error States - Manual Test Guide

## 🧪 Error State Testing Checklist

### 1. Network Errors

#### Test: No Internet Connection
**Steps:**
1. Turn off Wi-Fi and mobile data
2. Open Rewards screen
3. Expected: Error screen with "Connection Error" message
4. Tap "Try Again" button
5. Expected: Loading indicator shows, then error again

**Pass Criteria:**
- ✅ Error emoji (🔌) displays
- ✅ Clear error message shown
- ✅ "Try Again" button works
- ✅ No app crash

---

#### Test: API Timeout
**Steps:**
1. Set API timeout to 1ms (in dev mode)
2. Navigate to Rewards screen
3. Expected: Timeout error or mock data fallback

**Pass Criteria:**
- ✅ App doesn't freeze
- ✅ Error handled gracefully
- ✅ Mock data shows in dev mode

---

### 2. Data Loading Errors

#### Test: Empty Rewards List
**Steps:**
1. Mock API returns empty array
2. Navigate to Rewards screen
3. Expected: Empty state screen

**Pass Criteria:**
- ✅ Empty emoji (🎁) displays
- ✅ "No Rewards Yet" message shown
- ✅ "Refresh" button available
- ✅ Pull-to-refresh works

---

#### Test: Malformed API Response
**Steps:**
1. Mock API returns invalid JSON
2. Navigate to Rewards screen
3. Expected: Error handling kicks in

**Pass Criteria:**
- ✅ Error logged to console
- ✅ User sees friendly error message
- ✅ No white screen of death

---

### 3. Storage Errors

#### Test: AsyncStorage Read Failure
**Steps:**
1. Simulate storage permission denied
2. Launch app
3. Expected: App still loads, uses default state

**Pass Criteria:**
- ✅ Error logged (console)
- ✅ App continues to function
- ✅ Claimed rewards reset to empty

---

#### Test: AsyncStorage Write Failure
**Steps:**
1. Fill device storage to 100%
2. Claim a reward
3. Expected: Error logged, UI still updates

**Pass Criteria:**
- ✅ Error logged to console
- ✅ Reward shows as claimed in current session
- ✅ No crash or freeze

---

### 4. UI Component Errors

#### Test: Modal Close After Claim
**Steps:**
1. Open reward modal
2. Claim reward
3. Close modal
4. Re-open same reward
5. Expected: Shows "Claimed" badge

**Pass Criteria:**
- ✅ Modal closes smoothly
- ✅ State persists correctly
- ✅ Badge appears on re-open

---

#### Test: Rapid Tapping
**Steps:**
1. Tap reward card 10 times quickly
2. Expected: Modal opens only once

**Pass Criteria:**
- ✅ No duplicate modals
- ✅ No state corruption
- ✅ Smooth performance

---

### 5. Ad Integration Errors

#### Test: Ad Failed to Load
**Steps:**
1. Disable ad network
2. Open Rewards screen
3. Expected: No banner, but screen works

**Pass Criteria:**
- ✅ Screen doesn't break
- ✅ Content displays normally
- ✅ Error logged silently

---

#### Test: Interstitial Ad Failure
**Steps:**
1. Trigger interstitial ad
2. Ad fails to load
3. Expected: User flow continues

**Pass Criteria:**
- ✅ Modal still opens
- ✅ No blocking error
- ✅ User can claim reward

---

### 6. Navigation Errors

#### Test: Deep Link to Invalid Reward
**Steps:**
1. Open app with invalid reward ID in URL
2. Expected: Graceful fallback

**Pass Criteria:**
- ✅ No crash
- ✅ Redirect to rewards list
- ✅ Error logged

---

### 7. Performance Under Stress

#### Test: Large Rewards List
**Steps:**
1. Mock API returns 100+ rewards
2. Scroll through list
3. Expected: Smooth 60fps scrolling

**Pass Criteria:**
- ✅ No lag or stutter
- ✅ Images load progressively
- ✅ Memory stays reasonable

---

#### Test: Rapid Screen Switching
**Steps:**
1. Navigate: Home → Rewards → Home → Rewards (10 times fast)
2. Expected: No memory leaks

**Pass Criteria:**
- ✅ Smooth transitions
- ✅ No state corruption
- ✅ Memory doesn't spike

---

## 🔍 How to Test

### Development Mode
```bash
# Start with full error logging
npx expo start

# Enable network inspection
npx expo start --dev-client
```

### Simulate Errors
```typescript
// In src/core/api/client.ts - Add test flag
const FORCE_ERROR = false;  // Toggle to test error states

if (FORCE_ERROR && __DEV__) {
  return Promise.reject(new Error('Simulated network error'));
}
```

### Monitor Console
Watch for error logs:
```
🚨 Error Logged
Message: ...
Context: { screen: 'Rewards', action: '...' }
```

---

## ✅ Test Results Template

| Test Case | Pass | Notes |
|-----------|------|-------|
| No Internet Connection | ⏳ | |
| API Timeout | ⏳ | |
| Empty Rewards List | ⏳ | |
| Malformed Response | ⏳ | |
| Storage Read Failure | ⏳ | |
| Storage Write Failure | ⏳ | |
| Modal State | ⏳ | |
| Rapid Tapping | ⏳ | |
| Ad Load Failure | ⏳ | |
| Deep Link Invalid | ⏳ | |
| Large List Performance | ⏳ | |
| Rapid Navigation | ⏳ | |

**Legend:**
- ✅ = Passed
- ❌ = Failed
- ⏳ = Not tested yet
- ⚠️ = Needs improvement

---

## 🐛 Common Issues to Watch For

1. **White Screen**: Usually component crash → Check ErrorBoundary
2. **Frozen UI**: Blocking operation → Add timeout/loading state
3. **Stale Data**: Cache not invalidating → Force refresh
4. **Memory Leak**: useEffect cleanup missing → Add return cleanup
5. **Race Condition**: Multiple requests → Cancel previous requests

---

## 📝 Reporting Errors

When you find an error:
1. Note the test case name
2. Describe steps to reproduce
3. Share console error logs
4. Screenshot if visual issue
5. Device/OS info

---

**Next Step:** Run through this checklist and report any failures! 🚀
