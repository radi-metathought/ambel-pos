# Migration Guide - Secure Token Storage

## 🔄 Migrating from localStorage to Secure Token Storage

This guide helps you migrate from the old localStorage-based token storage to the new secure token storage system.

---

## ⚠️ Breaking Changes

### Token Storage Keys Changed

| Old Key | New Key | Storage Location |
|---------|---------|------------------|
| `adminToken` | `adminToken` | Memory + SessionStorage (+ LocalStorage if Remember Me) |
| `auth_token` | `authToken` | Memory + SessionStorage (+ LocalStorage if Remember Me) |
| `adminAuth` | N/A (handled internally) | SessionStorage |
| `adminUser` | `adminUser` | SessionStorage (was localStorage) |
| `user` | `user` | SessionStorage (was localStorage) |

### API Changes

#### Before
```typescript
// Old way - direct localStorage access
localStorage.setItem('adminToken', token);
const token = localStorage.getItem('adminToken');
localStorage.removeItem('adminToken');
```

#### After
```typescript
// New way - secure token storage
import { apiService } from '../services';

apiService.setAdminToken(token);
const token = apiService.getAuthToken();
apiService.clearAdminToken();
```

---

## 📝 Step-by-Step Migration

### Step 1: Update Authentication Calls

#### Before
```typescript
// Old login code
const response = await fetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('adminToken', data.token);
localStorage.setItem('adminUser', JSON.stringify(data.user));
```

#### After
```typescript
// New login code
import { authService } from '../services';

await authService.adminLogin({ email, password }, rememberMe);
// Token and user data are stored automatically
```

### Step 2: Update Token Retrieval

#### Before
```typescript
// Old way
const token = localStorage.getItem('adminToken');
if (token) {
  // Use token
}
```

#### After
```typescript
// New way
import { apiService } from '../services';

const token = apiService.getAuthToken();
if (token) {
  // Use token
}
```

### Step 3: Update Authentication Checks

#### Before
```typescript
// Old way
const isAuthenticated = !!localStorage.getItem('adminToken');
```

#### After
```typescript
// New way
import { authService } from '../services';

const isAuthenticated = authService.isAdminAuthenticated();
```

### Step 4: Update Logout Logic

#### Before
```typescript
// Old way
localStorage.removeItem('adminToken');
localStorage.removeItem('adminAuth');
localStorage.removeItem('adminUser');
```

#### After
```typescript
// New way
import { authService } from '../services';

authService.adminLogout();
// Clears all tokens and user data automatically
```

### Step 5: Update User Data Access

#### Before
```typescript
// Old way
const userStr = localStorage.getItem('adminUser');
const user = userStr ? JSON.parse(userStr) : null;
```

#### After
```typescript
// New way
import { authService } from '../services';

const user = authService.getAdminUser();
```

---

## 🔧 Component Migration Examples

### Example 1: Login Component

#### Before
```typescript
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      navigate('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* form fields */}
    </form>
  );
};
```

#### After
```typescript
import { authService } from '../services';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      await authService.adminLogin({ email, password }, rememberMe);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* form fields */}
      <input
        type="checkbox"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      />
      <label>Remember Me</label>
    </form>
  );
};
```

### Example 2: Protected Route

#### Before
```typescript
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('adminToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

#### After
```typescript
import { authService } from '../services';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAdminAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

### Example 3: User Profile Component

#### Before
```typescript
const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('adminUser');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return <div>{user?.name}</div>;
};
```

#### After
```typescript
import { authService } from '../services';

const UserProfile = () => {
  const user = authService.getAdminUser();

  return <div>{user?.name}</div>;
};
```

### Example 4: API Request with Token

#### Before
```typescript
const fetchData = async () => {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch('/api/data', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

#### After
```typescript
import { apiService } from '../services';

const fetchData = async () => {
  // Token is automatically added to headers
  return await apiService.get('/api/data');
};
```

---

## 🧹 Cleanup Old Code

### Find and Replace

Use your IDE's find and replace feature:

1. **Find**: `localStorage.getItem('adminToken')`
   **Replace**: `apiService.getAuthToken()`

2. **Find**: `localStorage.setItem('adminToken', token)`
   **Replace**: `apiService.setAdminToken(token)`

3. **Find**: `localStorage.removeItem('adminToken')`
   **Replace**: `apiService.clearAdminToken()`

4. **Find**: `localStorage.getItem('adminUser')`
   **Replace**: `authService.getAdminUser()`

### Remove Unused Code

After migration, remove these patterns:

```typescript
// ❌ Remove these
localStorage.setItem('adminAuth', 'true');
localStorage.getItem('adminAuth');
localStorage.removeItem('adminAuth');

// ✅ Replaced by
authService.isAdminAuthenticated();
```

---

## ✅ Migration Checklist

- [ ] Update all login/authentication calls
- [ ] Replace localStorage token access with apiService methods
- [ ] Replace localStorage user data access with authService methods
- [ ] Update protected routes to use authService.isAdminAuthenticated()
- [ ] Update logout functionality to use authService.adminLogout()
- [ ] Add "Remember Me" checkbox to login forms
- [ ] Test login with Remember Me = false (session-based)
- [ ] Test login with Remember Me = true (persistent)
- [ ] Test logout functionality
- [ ] Test token expiration handling
- [ ] Remove old localStorage cleanup code
- [ ] Update documentation

---

## 🧪 Testing After Migration

### Test Session-Based Login
```typescript
// 1. Login without Remember Me
await authService.adminLogin({ email, password }, false);

// 2. Verify token exists
console.log(authService.isAdminAuthenticated()); // true

// 3. Close and reopen browser tab
// Token should be lost

// 4. Verify token is gone
console.log(authService.isAdminAuthenticated()); // false
```

### Test Persistent Login
```typescript
// 1. Login with Remember Me
await authService.adminLogin({ email, password }, true);

// 2. Verify token exists
console.log(authService.isAdminAuthenticated()); // true

// 3. Close and reopen browser
// Token should persist

// 4. Verify token still exists
console.log(authService.isAdminAuthenticated()); // true
```

### Test Logout
```typescript
// 1. Login
await authService.adminLogin({ email, password }, true);

// 2. Logout
authService.adminLogout();

// 3. Verify all tokens cleared
console.log(authService.isAdminAuthenticated()); // false
console.log(authService.getAdminUser()); // null
console.log(apiService.getAuthToken()); // null
```

---

## 🐛 Common Issues and Solutions

### Issue 1: "Token not found after page refresh"

**Cause**: Using session-based storage (Remember Me = false)

**Solution**: Either:
- Use Remember Me feature for persistent login
- Re-authenticate on page refresh
- Implement token refresh mechanism

### Issue 2: "User data is null"

**Cause**: User data is now in sessionStorage, not localStorage

**Solution**: Use `authService.getAdminUser()` instead of direct localStorage access

### Issue 3: "API requests not authenticated"

**Cause**: Token not being sent with requests

**Solution**: Use `apiService` methods instead of fetch/axios directly

```typescript
// ❌ Wrong
fetch('/api/data');

// ✅ Correct
apiService.get('/api/data');
```

### Issue 4: "Old tokens still in localStorage"

**Cause**: Migration from old implementation

**Solution**: The new implementation automatically cleans up old tokens on logout. Or manually clear:

```typescript
// Clear all old tokens
localStorage.removeItem('adminToken');
localStorage.removeItem('adminAuth');
localStorage.removeItem('adminUser');
localStorage.removeItem('auth_token');
```

---

## 📊 Migration Impact

### Before Migration
- ❌ Tokens in plain localStorage (XSS vulnerable)
- ❌ No token expiration handling
- ❌ Manual token management everywhere
- ❌ No encryption
- ❌ No "Remember Me" feature

### After Migration
- ✅ Tokens in secure storage (memory + encrypted sessionStorage)
- ✅ Automatic token expiration
- ✅ Centralized token management
- ✅ Encrypted storage
- ✅ Optional persistent login with "Remember Me"
- ✅ Better security against XSS attacks

---

## 🎯 Next Steps

After completing the migration:

1. **Review all authentication flows**
2. **Test thoroughly in development**
3. **Update user documentation**
4. **Deploy to staging for testing**
5. **Monitor for issues**
6. **Deploy to production**

---

## 📞 Need Help?

If you encounter issues during migration:

1. Check the [Security Guide](./SECURITY.md) for detailed security information
2. Review the [API Integration Summary](./API_INTEGRATION_SUMMARY.md)
3. See [Quick Start Guide](./QUICK_START.md) for usage examples
4. Check the [examples.ts](./src/services/examples.ts) file

---

**Migration Complete!** 🎉 Your application now uses secure token storage with better protection against XSS attacks and improved user experience with the Remember Me feature.
