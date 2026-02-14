# 🔔 Push Notifications - Complete Implementation Guide

## Overview
This guide will help you set up push notifications between your Travel Rewards app and Smart-Link-Updater backend.

---

## ✅ **Already Complete (App Side)**

1. ✅ Notification API client created (`src/core/api/notifications.ts`)
2. ✅ Auto-registration on app start (in `useNotifications` hook)
3. ✅ Permission handling already implemented
4. ✅ Notification navigation already working

---

## 📋 **Step-by-Step Implementation**

### **Step 1: Test Current Notifications (5 minutes)**

The app already has local notifications working. Test them now:

1. Start your app:
   ```bash
   cd /home/deepak-openclaw/.openclaw/workspace/travel-rewards-app
   npm start
   ```

2. Open app in Expo Go on your **physical device**
3. Go to **Settings** → Enable notifications
4. Tap **Test Notification**
5. You should receive a notification in 2 seconds

✅ If this works, permissions are set up correctly!

---

### **Step 2: Add Backend Endpoints (15-20 minutes)**

You need to add 3 endpoints to your Smart-Link-Updater backend:

#### **Option A: I Can Do It For You**
I can:
1. Clone your Smart-Link-Updater repo
2. Add the notification endpoints
3. Test them locally
4. Create a PR for you to review

#### **Option B: You Do It Manually**

Add these files to `Smart-Link-Updater/backend/app/`:

**File 1: `backend/app/push_notifications.py`**
```python
import httpx
from typing import List, Dict, Any

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

async def send_push_notification(
    tokens: List[str],
    title: str,
    body: str,
    data: Dict[str, Any] = None
) -> Dict[str, Any]:
    """Send push notification to multiple Expo tokens"""
    messages = []
    for token in tokens:
        messages.append({
            "to": token,
            "sound": "default",
            "title": title,
            "body": body,
            "data": data or {},
            "priority": "high",
            "channelId": "default"
        })
    
    results = {"success": [], "failed": []}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                EXPO_PUSH_URL,
                json=messages,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                for i, result in enumerate(data.get("data", [])):
                    if result.get("status") == "ok":
                        results["success"].append(tokens[i])
                    else:
                        results["failed"].append({
                            "token": tokens[i],
                            "error": result.get("message", "Unknown error")
                        })
            else:
                results["failed"] = [{"error": f"HTTP {response.status_code}"}]
                
        except Exception as e:
            results["failed"] = [{"error": str(e)}]
    
    return results

async def notify_new_rewards(push_tokens_dict: dict, count: int = None):
    """Send notification about new rewards to all registered devices"""
    tokens_list = [data["token"] for data in push_tokens_dict.values()]
    
    if not tokens_list:
        return {"success": False, "message": "No tokens registered"}
    
    title = "New Rewards Available! 🎁"
    body = f"{count} new rewards added!" if count else "Check out the latest rewards"
    
    return await send_push_notification(
        tokens=tokens_list,
        title=title,
        body=body,
        data={"screen": "Rewards"}
    )
```

**File 2: Add to `backend/app/main.py`**

Add these imports at the top:
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .push_notifications import notify_new_rewards
```

Add these models:
```python
class PushTokenRequest(BaseModel):
    token: str
    device_type: str  # 'ios' or 'android'
    app_version: Optional[str] = None

class PushTokenResponse(BaseModel):
    success: bool
    message: str
    token_id: Optional[str] = None
```

Add in-memory storage (temporary - replace with MongoDB later):
```python
# Global storage for push tokens (replace with MongoDB)
push_tokens = {}
```

Add these endpoints:
```python
@app.post("/api/notifications/register", response_model=PushTokenResponse)
async def register_push_token(request: PushTokenRequest):
    """Register or update a device's push notification token"""
    try:
        token_id = request.token[:20]
        push_tokens[token_id] = {
            "token": request.token,
            "device_type": request.device_type,
            "app_version": request.app_version,
            "registered_at": datetime.utcnow().isoformat(),
            "last_updated": datetime.utcnow().isoformat()
        }
        
        return PushTokenResponse(
            success=True,
            message="Push token registered successfully",
            token_id=token_id
        )
    except Exception as e:
        return PushTokenResponse(
            success=False,
            message=f"Failed to register token: {str(e)}"
        )

@app.delete("/api/notifications/unregister/{token}")
async def unregister_push_token(token: str):
    """Unregister a device's push notification token"""
    token_id = token[:20]
    if token_id in push_tokens:
        del push_tokens[token_id]
        return {"success": True, "message": "Token unregistered"}
    return {"success": False, "message": "Token not found"}

@app.get("/api/notifications/tokens/count")
async def get_tokens_count():
    """Get count of registered tokens (admin only)"""
    return {
        "success": True,
        "count": len(push_tokens),
        "tokens": list(push_tokens.keys())
    }

@app.post("/api/notifications/send/new-rewards")
async def send_new_rewards_notification(count: Optional[int] = None):
    """Manually trigger new rewards notification"""
    result = await notify_new_rewards(push_tokens, count)
    return result
```

---

### **Step 3: Deploy Backend Changes (5 minutes)**

Deploy your updated Smart-Link-Updater to Cloud Run:

```bash
cd /path/to/Smart-Link-Updater
./deployCommands.sh
```

Wait for deployment to complete (~2-3 minutes).

---

### **Step 4: Test End-to-End (10 minutes)**

#### 4.1: Register Device Token

1. **Restart your app** (so it registers the token)
2. Check Expo Go console - you should see:
   ```
   ✅ Push token registered with backend
   ```

#### 4.2: Verify Token Registered

Test from terminal:
```bash
curl https://smartlink-api-601738079869.us-central1.run.app/api/notifications/tokens/count
```

You should see:
```json
{
  "success": true,
  "count": 1,
  "tokens": ["ExponentPushToken..."]
}
```

#### 4.3: Send Test Notification

From terminal:
```bash
curl -X POST https://smartlink-api-601738079869.us-central1.run.app/api/notifications/send/new-rewards \
  -H 'Content-Type: application/json' \
  -d '{"count": 5}'
```

You should receive a notification on your device! 🎉

---

### **Step 5: Auto-Notify on Rewards Update (10 minutes)**

Find your rewards update task in Smart-Link-Updater and add notification trigger:

```python
# In backend/app/tasks.py or wherever you update rewards
from .main import push_tokens
from .push_notifications import notify_new_rewards

@celery_app.task
def update_rewards_task(post_id, source_urls):
    # ... your existing reward update logic ...
    
    # After successfully adding new rewards
    new_rewards_added = len(new_links)  # or however you track new rewards
    
    # Send push notifications to all users
    if new_rewards_added > 0:
        asyncio.create_task(
            notify_new_rewards(push_tokens, new_rewards_added)
        )
    
    return {"success": True, "new_rewards": new_rewards_added}
```

---

## 🧪 **Testing Checklist**

- [ ] Local notifications work (Settings → Test Notification)
- [ ] Token registers on app start
- [ ] Backend receives token (`/tokens/count` shows count)
- [ ] Manual notification works (`/send/new-rewards`)
- [ ] Tapping notification navigates to Rewards screen
- [ ] Auto-notification triggers when rewards update

---

## 🔧 **Troubleshooting**

### App doesn't register token?
- Check you're on a physical device (not simulator)
- Check console for errors
- Try deleting app and reinstalling

### Backend endpoint returns 404?
- Verify backend is deployed
- Check URL: `https://smartlink-api-601738079869.us-central1.run.app/api/notifications/register`
- Check backend logs

### Notification not received?
- Check device notification settings
- Verify token is valid (check backend `/tokens/count`)
- Test with Expo Push Notification Tool: https://expo.dev/notifications

---

## 📊 **What's Next?**

### Phase 2 (Optional Improvements):
1. **MongoDB Storage**: Replace in-memory `push_tokens` dict with MongoDB
2. **Token Refresh**: Handle token expiration and refresh
3. **User Preferences**: Let users choose notification frequency
4. **Scheduled Notifications**: Daily reminder at 9 AM
5. **Rich Notifications**: Add images/actions to notifications

---

## 🚀 **Quick Start Command**

To implement everything now, tell me:
1. **"Add backend code"** - I'll modify Smart-Link-Updater files
2. **"Test only"** - I'll guide you through testing current setup
3. **"Full setup"** - I'll do both backend + testing

Which would you like? 🎯
