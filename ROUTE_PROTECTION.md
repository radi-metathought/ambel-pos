# Route Protection Guide

## 🔒 Protected Routes Implementation

All admin routes (`/admin/*`) are now protected and require authentication. Unauthorized users are automatically redirected to the login page.

---

## 🛡️ How It Works

### Route Protection Flow

```
User tries to access /admin/dashboard
         │
         ▼
    Is authenticated?
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    ▼         ▼
  Allow   Redirect to /admin
  Access  (Save attempted URL)
    │         │
    ▼         ▼
 Show      Show Login
 Page      Page
              │
              ▼
         User logs in
              │
              ▼
         Redirect back to
         original URL
```

---

## 📁 Implementation Files

### 1. **ProtectedRoute Component** (`src/components/ProtectedRoute.tsx`)

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAdminAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login, save attempted location
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

**Features:**
- ✅ Checks authentication status
- ✅ Redirects to `/admin` if not authenticated
- ✅ Saves attempted location for post-login redirect
- ✅ Uses `replace` to prevent back button issues

### 2. **App.tsx Routes**

```typescript
<Routes>
  {/* Public: Login Page */}
  <Route path="/admin" element={<AdminLogin />} />
  
  {/* Protected: All Dashboard Routes */}
  <Route
    path="/admin/dashboard"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  >
    <Route index element={<OverviewPage />} />
    <Route path="products" element={<ProductsPage />} />
    {/* ... more routes */}
  </Route>
</Routes>
```

### 3. **Enhanced AdminLogin Component**

```typescript
const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (authService.isAdminAuthenticated()) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    // ... login logic
    
    // Redirect to original page or dashboard
    const from = location.state?.from?.pathname || '/admin/dashboard';
    navigate(from, { replace: true });
  };
};
```

**Features:**
- ✅ Auto-redirects already authenticated users
- ✅ Redirects to original page after login
- ✅ Falls back to dashboard if no original page

---

## 🎯 Protected Routes

### Public Routes (No Authentication Required)
- `/admin` - Login page
- `/` - Main app dashboard
- `/orders` - Orders page
- `/stock` - Stock page
- `/table` - Table page

### Protected Routes (Authentication Required)
- `/admin/dashboard` - Admin overview
- `/admin/dashboard/products` - Products management
- `/admin/dashboard/categories` - Categories management
- `/admin/dashboard/purchase-stock` - Purchase stock
- `/admin/dashboard/branch` - Branch management
- `/admin/dashboard/tables` - Tables management
- `/admin/dashboard/employees` - Employees management
- `/admin/dashboard/exchange-rate` - Exchange rate
- `/admin/dashboard/currency-management` - Currency management
- `/admin/dashboard/other-expense` - Other expenses
- `/admin/dashboard/reports` - Reports
- `/admin/dashboard/users` - Users management
- `/admin/dashboard/tax-settings` - Tax settings
- `/admin/dashboard/settings` - General settings

---

## 🔄 User Experience Flow

### Scenario 1: Direct Access to Protected Route

```
1. User visits: /admin/dashboard/products
2. Not authenticated → Redirect to /admin
3. Login page shows
4. User logs in successfully
5. Redirect to /admin/dashboard/products (original page)
```

### Scenario 2: Already Authenticated

```
1. User visits: /admin (login page)
2. Already authenticated → Auto-redirect to /admin/dashboard
3. Dashboard shows immediately
```

### Scenario 3: Logout

```
1. User clicks logout
2. authService.adminLogout() called
3. All tokens cleared
4. User redirected to /admin
5. Cannot access protected routes until login again
```

---

## 🧪 Testing Route Protection

### Test 1: Access Protected Route Without Login

```bash
1. Clear all tokens (logout)
2. Try to access: http://localhost:5173/admin/dashboard
3. Expected: Redirect to /admin (login page)
```

### Test 2: Login and Redirect

```bash
1. Try to access: http://localhost:5173/admin/dashboard/products
2. Redirected to: /admin
3. Login with credentials
4. Expected: Redirect to /admin/dashboard/products
```

### Test 3: Already Logged In

```bash
1. Login successfully
2. Try to access: http://localhost:5173/admin
3. Expected: Auto-redirect to /admin/dashboard
```

### Test 4: Session Expiration

```bash
1. Login without "Remember Me"
2. Close browser
3. Reopen browser
4. Try to access: /admin/dashboard
5. Expected: Redirect to /admin (token expired)
```

### Test 5: Persistent Login

```bash
1. Login with "Remember Me" checked
2. Close browser
3. Reopen browser
4. Try to access: /admin/dashboard
5. Expected: Access granted (token persists)
```

---

## 🛠️ Customization

### Change Redirect Destination

```typescript
// In ProtectedRoute.tsx
if (!isAuthenticated) {
  // Change '/admin' to your login page
  return <Navigate to="/login" state={{ from: location }} replace />;
}
```

### Add Role-Based Protection

```typescript
const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAdminAuthenticated();
  const user = authService.getAdminUser();

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

// Usage
<Route
  path="/admin/dashboard/users"
  element={
    <ProtectedRoute requiredRole="super_admin">
      <UsersPage />
    </ProtectedRoute>
  }
/>
```

### Add Loading State

```typescript
const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const isAuthenticated = authService.isAdminAuthenticated();

  useEffect(() => {
    // Simulate checking authentication
    setTimeout(() => setChecking(false), 100);
  }, []);

  if (checking) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
```

---

## 🔐 Security Best Practices

### ✅ DO

1. **Always validate on backend**
   ```typescript
   // Frontend protection is not enough
   // Backend must verify token on every request
   ```

2. **Use HTTPS in production**
   ```typescript
   // Encrypt all network traffic
   ```

3. **Implement token refresh**
   ```typescript
   if (apiService.isTokenExpiringSoon()) {
     await refreshToken();
   }
   ```

4. **Clear tokens on logout**
   ```typescript
   authService.adminLogout(); // Clears all tokens
   ```

5. **Use secure token storage**
   ```typescript
   // Already implemented with secureTokenStorage
   ```

### ❌ DON'T

1. **Don't rely solely on frontend protection**
   ```typescript
   // ❌ Bad: Only checking on frontend
   // ✅ Good: Backend validates every request
   ```

2. **Don't store sensitive data in tokens**
   ```typescript
   // ❌ Bad: Token contains password
   // ✅ Good: Token contains only user ID
   ```

3. **Don't forget to handle token expiration**
   ```typescript
   // ❌ Bad: No expiration handling
   // ✅ Good: Auto-logout on expiration
   ```

---

## 🐛 Troubleshooting

### Issue 1: Infinite Redirect Loop

**Symptom**: Page keeps redirecting between login and dashboard

**Cause**: Authentication check is inconsistent

**Solution**:
```typescript
// Make sure authService.isAdminAuthenticated() is reliable
console.log('Is authenticated:', authService.isAdminAuthenticated());
console.log('Token:', apiService.getAuthToken());
```

### Issue 2: Not Redirecting After Login

**Symptom**: User stays on login page after successful login

**Cause**: Navigation not working

**Solution**:
```typescript
// Check if navigate is called
const handleSubmit = async (e) => {
  await authService.adminLogin(credentials);
  console.log('Navigating to:', from);
  navigate(from, { replace: true });
};
```

### Issue 3: Redirect URL Not Preserved

**Symptom**: Always redirects to dashboard, not original page

**Cause**: Location state not passed correctly

**Solution**:
```typescript
// In ProtectedRoute
return <Navigate to="/admin" state={{ from: location }} replace />;

// In AdminLogin
const from = location.state?.from?.pathname || '/admin/dashboard';
```

### Issue 4: Can Access Protected Routes Without Login

**Symptom**: Protected routes accessible without authentication

**Cause**: ProtectedRoute not wrapping the routes

**Solution**:
```typescript
// Make sure routes are wrapped
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>  {/* ← Must wrap here */}
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 📊 Route Protection Status

| Route | Protected | Redirect To | Notes |
|-------|-----------|-------------|-------|
| `/admin` | ❌ No | N/A | Login page (public) |
| `/admin/dashboard` | ✅ Yes | `/admin` | Requires authentication |
| `/admin/dashboard/*` | ✅ Yes | `/admin` | All sub-routes protected |
| `/` | ❌ No | N/A | Main app (public) |
| `/orders` | ❌ No | N/A | Main app (public) |
| `/stock` | ❌ No | N/A | Main app (public) |
| `/table` | ❌ No | N/A | Main app (public) |

---

## ✨ Summary

### What Was Implemented:

1. ✅ **ProtectedRoute Component** - Checks authentication
2. ✅ **Route Protection** - All `/admin/dashboard/*` routes protected
3. ✅ **Auto-Redirect** - Redirects to login if not authenticated
4. ✅ **Post-Login Redirect** - Returns to original page after login
5. ✅ **Already Logged In** - Auto-redirects from login page
6. ✅ **Secure Token Storage** - Uses secure token storage system

### Security Benefits:

- 🔒 **Unauthorized access prevented**
- 🛡️ **Token-based authentication**
- 🔐 **Secure token storage**
- ⏰ **Automatic token expiration**
- 🧹 **Clean logout process**

### User Experience:

- ✅ **Seamless redirects**
- ✅ **Remembers attempted page**
- ✅ **No unnecessary login prompts**
- ✅ **Clear error messages**

---

**Your admin routes are now fully protected!** 🎉
