# Backend API Documentation

## Endpoint: `/users/register`

### Description
This endpoint is used to register a new user in the system. It validates the input data, hashes the user's password, and stores the user information in the database. Upon successful registration, a JSON Web Token (JWT) is returned along with the user details.

### Method
`POST`

### URL
`/users/register`

### Request Body
The request body should be in JSON format and include the following fields:

| Field       | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| `fullName`  | Object | Yes      | Contains `firstName` and `lastName` of the user. |
| `firstName` | String | Yes      | The first name of the user (min length: 3).      |
| `lastName`  | String | Yes      | The last name of the user (min length: 3).       |
| `email`     | String | Yes      | The email address of the user (must be valid).   |
| `password`  | String | Yes      | The password for the user (min length: 5).       |

Example request body:
```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

### Response

#### Success Response
- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "johndoe@example.com"
    }
  }
  ```

#### Error Responses
1. **Validation Error**
   - **Status Code:** `422 Unprocessable Entity`
   - **Body:**
     ```json
     {
       "errors": [
         {
           "msg": "Invalid email",
           "param": "email",
           "location": "body"
         }
       ]
     }
     ```

2. **Server Error**
   - **Status Code:** `500 Internal Server Error`
   - **Body:**
     ```json
     {
       "error": "An unexpected error occurred"
     }
     ```

### Notes
- Ensure that the `Content-Type` header is set to `application/json` when making the request.
- The `fullName` object must include both `firstName` and `lastName`.
- The `email` field must be unique.
- Passwords are hashed before being stored in the database.

## Endpoint: `/users/login`

### Description

This endpoint is used to authenticate an existing user. It validates the input data, checks the user's credentials, and returns a JSON Web Token (JWT) along with the user details if the credentials are valid.

### Method

`POST`

### URL

`/users/login`

### Request Body

The request body should be in JSON format and include the following fields:

| Field      | Type   | Required | Description                                    |
| ---------- | ------ | -------- | ---------------------------------------------- |
| `email`    | String | Yes      | The email address of the user (must be valid). |
| `password` | String | Yes      | The password for the user (min length: 5).     |

Example request body:

```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

### Response

#### Success Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "fullName": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "email": "johndoe@example.com"
    }
  }
  ```

#### Error Responses

1. **Validation Error**

   - **Status Code:** `422 Unprocessable Entity`
   - **Body:**
     ```json
     {
       "errors": [
         {
           "msg": "Invalid email",
           "param": "email",
           "location": "body"
         }
       ]
     }
     ```

2. **Invalid Credentials**

   - **Status Code:** `401 Unauthorized`
   - **Body:**
     ```json
     {
       "message": "Invalid credentials"
     }
     ```

3. **Server Error**
   - **Status Code:** `500 Internal Server Error`
   - **Body:**
     ```json
     {
       "error": "An unexpected error occurred"
     }
     ```

---

### Notes

- Ensure that the `Content-Type` header is set to `application/json` when making the request.
- The `email` field must be registered in the system.
- Passwords are securely compared using hashing.

## Endpoint: `/users/profile`

### Description
This endpoint is used to retrieve the profile details of the authenticated user. The user must be logged in and provide a valid JWT token for authentication.

### Method
`GET`

### URL
`/users/profile`

### Headers
| Header            | Value              | Required | Description                          |
|--------------------|--------------------|----------|--------------------------------------|
| `Authorization`   | `Bearer <token>`   | Yes      | The JWT token of the authenticated user. |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "_id": "user-id",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "johndoe@example.com"
  }
  ```

#### Error Responses
1. **Unauthorized**
   - **Status Code:** `401 Unauthorized`
   - **Body:**
     ```json
     {
       "message": "Unauthorized"
     }
     ```

2. **Server Error**
   - **Status Code:** `500 Internal Server Error`
   - **Body:**
     ```json
     {
       "error": "An unexpected error occurred"
     }
     ```

---

## Endpoint: `/users/logout`

### Description
This endpoint is used to log out the authenticated user. It clears the user's authentication token and adds it to a blacklist to prevent reuse.

### Method
`GET`

### URL
`/users/logout`

### Headers
| Header            | Value              | Required | Description                          |
|--------------------|--------------------|----------|--------------------------------------|
| `Authorization`   | `Bearer <token>`   | Yes      | The JWT token of the authenticated user. |

### Response

#### Success Response
- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Error Responses
1. **Unauthorized**
   - **Status Code:** `401 Unauthorized`
   - **Body:**
     ```json
     {
       "message": "Unauthorized"
     }
     ```

2. **Server Error**
   - **Status Code:** `500 Internal Server Error`
   - **Body:**
     ```json
     {
       "error": "An unexpected error occurred"
     }
     ```

---

### Notes
- Ensure that the `Authorization` header is set with a valid JWT token for both `/users/profile` and `/users/logout` endpoints.
- The logout process invalidates the token by adding it to a blacklist.