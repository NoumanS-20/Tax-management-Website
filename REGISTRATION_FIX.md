# Registration Issue - Fixed

## Problem
User reported getting "invalid response from server" when trying to create an account.

## Root Causes Identified

### 1. **Strict Rate Limiting**
The auth rate limiter was set to only 5 requests per 15 minutes, which is too strict for development and testing.

**Location**: `server/middleware/security.js`

**Fix Applied**:
```javascript
// Changed from 5 to 20 requests per 15 minutes
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  20, // limit each IP to 20 requests per windowMs (relaxed for development)
  'Too many authentication attempts, please try again later.'
);
```

### 2. **Poor Error Handling**
The frontend API service wasn't providing detailed error messages when server responses failed to parse.

**Location**: `src/services/api.ts`

**Fix Applied**:
```typescript
private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let data;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('Failed to parse server response:', error);
    throw new Error(`Invalid response from server (Status: ${response.status}). Please check server logs.`);
  }
  
  if (!response.ok) {
    throw new Error(data.message || `Server error (Status: ${response.status})`);
  }
  
  return data;
}
```

### 3. **Enhanced Server Logging**
Added detailed logging to the registration controller to help debug issues.

**Location**: `server/controllers/authController.js`

**Additions**:
- Log registration attempts
- Log when users already exist
- Log successful user saves
- Log detailed error information including error name, code, and stack trace

## How to Test

1. **Make sure both servers are running**:
   - Frontend: `npm run dev` (runs on http://localhost:5173)
   - Backend: `cd server && node app.js` (runs on http://localhost:5000)

2. **Try to register a new account**:
   - Go to http://localhost:5173/register
   - Fill in all required fields:
     - First Name
     - Last Name
     - Email
     - Phone (10-digit Indian number starting with 6-9)
     - PAN Number (format: ABCDE1234F)
     - Password (minimum 6 characters)
     - Confirm Password
   - Check the "I agree to Terms of Service and Privacy Policy" checkbox
   - Click "Create Account"

3. **Check server logs** in the terminal where you ran `node app.js`:
   - You should see: `Registration attempt: { email: '...', firstName: '...' }`
   - Followed by: `User saved successfully: ...`
   - And: `Registration successful for: ...`

4. **If registration fails**, check the error message in the browser console and server logs for details.

## Common Issues and Solutions

### Issue: "User with this email already exists"
**Solution**: Use a different email address or delete the existing user from MongoDB.

### Issue: "Invalid PAN number"
**Solution**: Ensure PAN is in correct format: 5 uppercase letters + 4 digits + 1 uppercase letter (e.g., ABCDE1234F)

### Issue: "Please enter a valid Indian mobile number"
**Solution**: Phone must be 10 digits starting with 6-9 (e.g., 9876543210)

### Issue: Connection errors
**Solution**: 
- Make sure MongoDB is running
- Ensure backend server is running on port 5000
- Check that Vite proxy is configured correctly in `vite.config.ts`

## Server Configuration

### MongoDB Connection
Default: `mongodb://localhost:27017/swifttax`
Can be overridden with `MONGODB_URI` environment variable

### CORS Configuration
Development: Allows all origins
Production: Only allows whitelisted domains (configure in `server/middleware/security.js`)

### Rate Limits
- General API: 100 requests per 15 minutes
- Auth endpoints: 20 requests per 15 minutes (increased from 5)
- File uploads: 10 uploads per hour

## Next Steps

If issues persist:
1. Check MongoDB connection
2. Review server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Test the API endpoint directly using Postman or curl
5. Check network tab in browser DevTools for request/response details
