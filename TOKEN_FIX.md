# Invalid Token Issue - Fixed

## Problem
User reported getting "Invalid token" error when trying to create an ITR form.

## Root Cause
The auth middleware (`server/middleware/auth.js`) was using `process.env.JWT_SECRET` directly, but the auth controller (`server/controllers/authController.js`) was using a fallback value. This mismatch caused tokens signed with the fallback secret to be invalid when verified without it.

## Fix Applied

### 1. **JWT Secret Consistency**
Added the same fallback secret in the auth middleware:

**File**: `server/middleware/auth.js`

```javascript
// Use the same fallback as authController
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me-32chars-minimum-xxxxxxxx';

const auth = async (req, res, next) => {
  // ... rest of the code
  const decoded = jwt.verify(token, JWT_SECRET);  // Now uses same secret
```

### 2. **Enhanced Logging**
Added comprehensive logging to help debug auth issues:

```javascript
- Log when no token is provided
- Log token verification attempts
- Log successful authentications with user email
- Log detailed error information including:
  - Error name
  - Error message
  - Partial token (for debugging)
- Distinguish between TokenExpiredError and JsonWebTokenError
```

### 3. **Frontend Improvements**
Added warning log when no access token is found in localStorage:

**File**: `src/services/api.ts`

```typescript
private getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.warn('No access token found in localStorage');
  }
  // ...
}
```

## Additional Updates

### ITR Filing Deadline Updated
Changed the ITR filing deadline from July 31st, 2024 to November 30th, 2025:

- **`server/env.example`**: `ITR_FILING_DEADLINE=2025-11-30`
- **`src/pages/Dashboard/UserDashboard.tsx`**: 
  - Updated reminder message to "ITR filing deadline: November 30th, 2025"
  - Updated countdown to 42 days (from October 19, 2025)

## How to Test

1. **Clear browser storage** to start fresh:
   ```javascript
   localStorage.clear();
   ```

2. **Register or Login** to get a fresh token:
   - The token will be signed with the correct secret
   - Token will be saved to localStorage

3. **Try creating an ITR form**:
   - Navigate to ITR Forms page
   - Click "Create New ITR Form"
   - Fill in the required details
   - Submit

4. **Check server logs** for auth debugging:
   ```
   Verifying token...
   Token decoded successfully: { userId: '...' }
   Auth successful for user: user@example.com
   ```

## Common Issues and Solutions

### Issue: Still getting "Invalid token"
**Solutions**:
1. Clear localStorage and login again
2. Check that backend server restarted properly
3. Verify the token in browser DevTools (Application → LocalStorage)
4. Check server logs for specific error messages

### Issue: "Token expired"
**Solution**: 
- Tokens expire after 15 minutes by default
- Use the refresh token endpoint or login again
- Consider increasing JWT_EXPIRES_IN in .env file

### Issue: "No token provided"
**Solution**:
- Make sure you're logged in
- Check that accessToken exists in localStorage
- Verify AuthContext is wrapping the component

## Server Configuration

### JWT Settings (Default for Development)
```javascript
JWT_SECRET = 'dev-jwt-secret-change-me-32chars-minimum-xxxxxxxx'
JWT_REFRESH_SECRET = 'dev-refresh-secret-change-me-32chars-minimum-yyyyyyyy'
JWT_EXPIRES_IN = '15m'
JWT_REFRESH_EXPIRES_IN = '7d'
```

### For Production
Create a `.env` file in the `server` directory with:
```env
JWT_SECRET=your-very-secure-random-32-char-secret
JWT_REFRESH_SECRET=your-very-secure-refresh-32-char-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## API Endpoints Requiring Authentication

All these endpoints now work correctly with the fixed auth middleware:

- `GET /api/tax` - Get all tax forms
- `POST /api/tax` - Create new tax form
- `GET /api/tax/:id` - Get specific tax form
- `PUT /api/tax/:id` - Update tax form
- `POST /api/tax/:id/submit` - Submit form for review
- `GET /api/tax/:id/summary` - Get tax summary
- `GET /api/documents` - Get documents
- `POST /api/documents/upload` - Upload document
- `GET /api/notifications` - Get notifications
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

## Next Steps

If authentication issues persist:

1. **Check browser console** for:
   - "No access token found in localStorage" warning
   - Network errors in the failed requests

2. **Check server logs** for:
   - "Auth failed: No token provided"
   - "Auth failed: User not found or inactive"
   - Specific JWT errors (TokenExpiredError, JsonWebTokenError)

3. **Verify token format**:
   - Should start with "Bearer "
   - JWT format: `xxxxx.yyyyy.zzzzz` (three parts separated by dots)

4. **Test with curl**:
   ```bash
   curl -X GET http://localhost:5000/api/auth/profile \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

## Files Changed

1. `server/middleware/auth.js` - Fixed JWT secret and added logging
2. `server/controllers/authController.js` - Enhanced registration logging
3. `src/services/api.ts` - Added token warning
4. `src/pages/Dashboard/UserDashboard.tsx` - Updated deadline
5. `server/env.example` - Updated ITR deadline
