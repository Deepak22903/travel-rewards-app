# Push Notifications Implementation - Step by Step Guide

## 🎯 Goal
Enable push notifications in your Travel Rewards app that notify users when new rewards are added via your Smart-Link-Updater backend.

---

## 📋 **Phase 1: Backend Setup (Smart-Link-Updater)** 

### Step 1.1: Add Token Storage Endpoint

Add this to your Smart-Link-Updater backend (`backend/app/main.py`):

```python
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Add these models
class PushTokenRequest(BaseModel):
    token: str
    device_type: str  # 'ios' or 'android'
    app_version: Optional[str] = None

class PushTokenResponse(BaseModel):
    success: bool
    message: str
    token_id: Optional[str] = None

# Create notifications router
notifications_router = APIRouter(prefix="/notifications", tags=["notifications"])

# In-memory storage for now (replace with MongoDB later)
push_tokens = {}

@notifications_router.post("/register", response_model=PushTokenResponse)
async def register_push_token(request: PushTokenRequest):
    """Register or update a device's push notification token"""
    try:
        token_id = request.token[:20]  # Use first 20 chars as ID
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

@notifications_router.delete("/unregister/{token}")
async def unregister_push_token(token: str):
    """Unregister a device's push notification token"""
    token_id = token[:20]
    if token_id in push_tokens:
        del push_tokens[token_id]
        return {"success": True, "message": "Token unregistered"}
    return {"success": False, "message": "Token not found"}

@notifications_router.get("/tokens/count")
async def get_tokens_count():
    """Get count of registered tokens"""
    return {
        "success": True,
        "count": len(push_tokens),
        "tokens": list(push_tokens.keys())
    }

# Add router to main app
# In your main FastAPI app initialization:
# app.include_router(notifications_router)
```

### Step 1.2: Add Notification Sender

Create `backend/app/push_notifications.py`:

```python
import httpx
from typing import List, Dict, Any
import asyncio

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

async def send_push_notification(
    tokens: List[str],
    title: str,
    body: str,
    data: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Send push notification to multiple Expo tokens
    """
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

async def notify_new_rewards(count: int = None):
    """
    Send notification to all registered devices about new rewards
    """
    from .main import push_tokens  # Import from your main app
    
    tokens_list = [data["token"] for data in push_tokens.values()]
    
    if not tokens_list:
        return {"success": False, "message": "No tokens registered"}
    
    title = "New Rewards Available! 🎁"
    body = f"{count} new rewards" if count else "Check out the latest rewards"
    
    return await send_push_notification(
        tokens=tokens_list,
        title=title,
        body=body,
        data={"screen": "Rewards"}
    )
```

### Step 1.3: Add Notification Endpoint

Add to `backend/app/main.py`:

```python
from .push_notifications import notify_new_rewards

@notifications_router.post("/send/new-rewards")
async def send_new_rewards_notification(count: Optional[int] = None):
    """Manually trigger new rewards notification"""
    result = await notify_new_rewards(count)
    return result
```

### Step 1.4: Auto-notify on Rewards Update

Modify your rewards update task to trigger notifications:

```python
# In your celery task or wherever you update rewards
async def update_rewards_task():
    # ... your existing reward update logic ...
    
    # After successfully updating rewards
    new_rewards_count = len(new_rewards)
    
    # Send push notifications
    await notify_new_rewards(new_rewards_count)
```

---

## 📱 **Phase 2: App Integration**

### Step 2.1: Create Notification Service

Create `/home/deepak-openclaw/.openclaw/workspace/travel-rewards-app/src/core/api/notifications.ts`:

<function_calls>
<invoke name="write">
<parameter name="content">/**
 * Notifications API
 * Handle push notification token registration with backend
 */

import client from './client';
import { getExpoPushToken } from '../notifications/permissions';
import { Platform } from 'react-native';
import { APP_CONFIG } from '../constants/config';

interface TokenRegistrationResponse {
  success: boolean;
  message: string;
  token_id?: string;
}

/**
 * Register push notification token with backend
 */
export const registerPushToken = async (): Promise<boolean> => {
  try {
    const token = await getExpoPushToken();
    
    if (!token) {
      console.log('No push token available');
      return false;
    }

    const response = await client.post<TokenRegistrationResponse>(
      '/notifications/register',
      {
        token,
        device_type: Platform.OS,
        app_version: APP_CONFIG.APP_VERSION,
      }
    );

    if (response.data.success) {
      console.log('✅ Push token registered:', response.data.token_id);
      return true;
    } else {
      console.error('❌ Token registration failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('Error registering push token:', error);
    return false;
  }
};

/**
 * Unregister push notification token
 */
export const unregisterPushToken = async (): Promise<boolean> => {
  try {
    const token = await getExpoPushToken();
    
    if (!token) {
      return false;
    }

    const response = await client.delete<TokenRegistrationResponse>(
      `/notifications/unregister/${token}`
    );

    if (response.data.success) {
      console.log('✅ Push token unregistered');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error unregistering push token:', error);
    return false;
  }
};

/**
 * Test notification sending (for development)
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    const response = await client.post('/notifications/send/new-rewards', {
      count: 3,
    });

    return response.data.success;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};
