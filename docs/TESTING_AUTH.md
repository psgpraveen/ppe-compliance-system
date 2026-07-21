# Authentication Testing Guide

## Manual Testing Steps

1. **Setup DB:** 
   - Ensure `database/schema.sql` and `database/seed.sql` are applied in your PostgreSQL instance. 
   - The default admin user is `admin@example.com` with password `Admin@123`.
2. **Start Backend:**
   - Run `npm run dev` in the `backend/` folder.
3. **Start Frontend:**
   - Run `npm run dev` in the `frontend/` folder.
4. **Test Login (Frontend):**
   - Navigate to `http://localhost:3000/login`.
   - Leave inputs empty and submit to verify **Zod validation errors**.
   - Enter `admin@example.com` and a wrong password to verify **Error Handling**.
   - Enter `admin@example.com` and `Admin@123`. You should see a success toast and be redirected to `/dashboard`.
5. **Test Protected Route:**
   - Visit `/dashboard`. Ensure you see the "Welcome, System (ADMIN)" message.
   - Click "Logout". You should be redirected back to `/login`.
   - Try manually visiting `/dashboard` while logged out. You should be instantly redirected to `/login`.

## Expected Results
- **Login Success**: Returns `accessToken`, `refreshToken`, and `user` object. LocalStorage stores tokens.
- **Login Failure**: Returns 401 Unauthorized with message "Invalid email or password."
- **Me Endpoint**: Returns 200 with the user's profile JSON. Returns 401 if the token is missing or invalid.

## Postman Collection

You can import the following JSON into Postman:

```json
{
	"info": {
		"name": "PPE Compliance Auth",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Login",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"email\": \"admin@example.com\",\n    \"password\": \"Admin@123\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:5000/api/v1/auth/login",
					"protocol": "http",
					"host": ["localhost"],
					"port": "5000",
					"path": ["api", "v1", "auth", "login"]
				}
			}
		},
		{
			"name": "Get Me",
			"request": {
				"method": "GET",
				"header": [
					{
						"key": "Authorization",
						"value": "Bearer {{jwt_token}}",
						"type": "text"
					}
				],
				"url": {
					"raw": "http://localhost:5000/api/v1/auth/me",
					"protocol": "http",
					"host": ["localhost"],
					"port": "5000",
					"path": ["api", "v1", "auth", "me"]
				}
			}
		}
	]
}
```
