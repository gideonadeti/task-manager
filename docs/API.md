# Taskflow API Documentation

## Overview

The Taskflow API is a RESTful API that provides endpoints for managing tasks and groups. All endpoints require authentication via Clerk and return JSON responses.

**Base URL**: `https://your-domain.com/api` (development: `http://localhost:3000/api`)

## Authentication

All API endpoints require authentication using Clerk. The user must be authenticated and a valid session token must be present in the request.

**Authentication Method**: Clerk session token (handled automatically via middleware)

**Unauthenticated Response**:

- **Status Code**: `401 Unauthorized`
- **Response Body**:

```json
{
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Unauthorized. Authentication required."
  }
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional, structure varies by error type
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_ERROR` | 401 | User is not authenticated |
| `AUTHORIZATION_ERROR` | 403 | User doesn't have permission to access the resource |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `NOT_FOUND_ERROR` | 404 | Requested resource not found |
| `CONFLICT_ERROR` | 409 | Resource conflict (e.g., duplicate name) |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

### Validation Error Details

Validation errors include detailed field-level errors:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Task title is required"
      },
      {
        "field": "priority",
        "message": "Priority must be low, medium, or high"
      }
    ]
  }
}
```

## Tasks API

### Get All Tasks

Retrieve all tasks for the authenticated user.

**Endpoint**: `GET /api/tasks`

**Request Headers**:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

**Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "tasks": [
    {
      "id": "clx123abc",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "priority": "high",
      "dueDate": "2024-01-15T10:00:00.000Z",
      "completed": false,
      "groupId": "clx456def",
      "userId": "user_2abc123",
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

**Error Responses**:

- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

---

### Create Task

Create a new task.

**Endpoint**: `POST /api/tasks`

**Request Headers**:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "groupId": "clx456def",
  "dueDate": "2024-01-15T10:00:00.000Z"
}
```

**Field Descriptions**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `title` | string | Yes | 1-200 characters, trimmed | Task title |
| `description` | string | No | Max 1000 characters, trimmed | Task description |
| `priority` | enum | Yes | `"low"`, `"medium"`, or `"high"` | Task priority level |
| `groupId` | string | Yes | Non-empty string | ID of the group this task belongs to |
| `dueDate` | string/Date | No | Valid ISO 8601 datetime string or Date object | Task due date |

**Response**:

- **Status Code**: `201 Created`
- **Response Body**:

```json
{
  "task": {
    "id": "clx123abc",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "high",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "completed": false,
    "groupId": "clx456def",
    "userId": "user_2abc123",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  }
}
```

**Error Responses**:

- `400 Bad Request`: Validation error
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Group not found
- `403 Forbidden`: User doesn't own the specified group
- `500 Internal Server Error`: Server error

**Example Validation Error**:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Task title is required"
      },
      {
        "field": "priority",
        "message": "Priority must be low, medium, or high"
      }
    ]
  }
}
```

---

### Update Task

Update an existing task. All fields are optional.

**Endpoint**: `PUT /api/tasks/:taskId`

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskId` | string | Yes | ID of the task to update |

**Request Headers**:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

**Request Body** (all fields optional):

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "medium",
  "groupId": "clx789ghi",
  "dueDate": "2024-01-20T10:00:00.000Z"
}
```

**Field Descriptions**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `title` | string | No | 1-200 characters, trimmed | Task title |
| `description` | string | No | Max 1000 characters, trimmed | Task description |
| `priority` | enum | No | `"low"`, `"medium"`, or `"high"` | Task priority level |
| `groupId` | string | No | Non-empty string | ID of the group this task belongs to |
| `dueDate` | string/Date | No | Valid ISO 8601 datetime string or Date object | Task due date |

**Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "task": {
    "id": "clx123abc",
    "title": "Updated task title",
    "description": "Updated description",
    "priority": "medium",
    "dueDate": "2024-01-20T10:00:00.000Z",
    "completed": false,
    "groupId": "clx789ghi",
    "userId": "user_2abc123",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-12T14:30:00.000Z"
  }
}
```

**Error Responses**:

- `400 Bad Request`: Validation error
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own the task
- `404 Not Found`: Task not found
- `500 Internal Server Error`: Server error

---

### Toggle Task Completion Status

Toggle the completion status of a task.

**Endpoint**: `PATCH /api/tasks/:taskId`

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskId` | string | Yes | ID of the task to update |

**Request Headers**:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "previousStatus": false
}
```

**Field Descriptions**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `previousStatus` | boolean | Yes | The current completion status before toggling |

**Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "message": "Task status updated successfully."
}
```

**Error Responses**:

- `400 Bad Request`: Validation error (missing or invalid `previousStatus`)
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own the task
- `404 Not Found`: Task not found
- `500 Internal Server Error`: Server error

---

### Delete Task

Delete a task.

**Endpoint**: `DELETE /api/tasks/:taskId`

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskId` | string | Yes | ID of the task to delete |

**Request Headers**:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

**Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "task": {
    "id": "clx123abc",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "high",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "completed": false,
    "groupId": "clx456def",
    "userId": "user_2abc123",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  }
}
```

**Error Responses**:

- `400 Bad Request`: Invalid task ID format
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own the task
- `404 Not Found`: Task not found
- `500 Internal Server Error`: Server error

---

## Bulk Operations

Bulk operations allow you to perform actions on multiple tasks simultaneously. These operations are implemented client-side and use the existing API endpoints multiple times in parallel.

**Note**: Bulk operations are not separate API endpoints. They are client-side features that call the standard task endpoints (`PATCH /api/tasks/:taskId`, `PUT /api/tasks/:taskId`, `DELETE /api/tasks/:taskId`) for each selected task in parallel.

### Supported Bulk Operations

1. **Bulk Mark Complete/Incomplete**: Toggle completion status for multiple tasks
   - Uses: `PATCH /api/tasks/:taskId` for each task
   - Request body: `{ "previousStatus": boolean }`

2. **Bulk Update Priority**: Change priority level for multiple tasks
   - Uses: `PUT /api/tasks/:taskId` for each task
   - Request body: `{ "priority": "low" | "medium" | "high" }`

3. **Bulk Update Group**: Move multiple tasks to a different group
   - Uses: `PUT /api/tasks/:taskId` for each task
   - Request body: `{ "groupId": string }`

4. **Bulk Delete**: Delete multiple tasks
   - Uses: `DELETE /api/tasks/:taskId` for each task

### Implementation Notes

- All bulk operations are executed in parallel using `Promise.all()`
- Each operation follows the same validation and error handling as individual operations
- If any operation fails, the client handles rollback via optimistic updates
- The client uses TanStack Query for state management and optimistic updates

---

## Groups API

### Get All Groups

Retrieve all groups for the authenticated user.

**Endpoint**: `GET /api/groups`

**Request Headers**:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

**Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "groups": [
    {
      "id": "clx456def",
      "name": "Work",
      "userId": "user_2abc123",
      "createdAt": "2024-01-05T08:00:00.000Z",
      "updatedAt": "2024-01-05T08:00:00.000Z"
    },
    {
      "id": "clx789ghi",
      "name": "Personal",
      "userId": "user_2abc123",
      "createdAt": "2024-01-06T09:00:00.000Z",
      "updatedAt": "2024-01-06T09:00:00.000Z"
    }
  ]
}
```

**Error Responses**:

- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

---

### Create Group

Create a new group.

**Endpoint**: `POST /api/groups`

**Request Headers**:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Work"
}
```

**Field Descriptions**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | string | Yes | 1-100 characters, trimmed | Group name |

**Response**:

- **Status Code**: `201 Created`
- **Response Body**:

```json
{
  "group": {
    "id": "clx456def",
    "name": "Work",
    "userId": "user_2abc123",
    "createdAt": "2024-01-05T08:00:00.000Z",
    "updatedAt": "2024-01-05T08:00:00.000Z"
  }
}
```

**Error Responses**:

- `400 Bad Request`: Validation error
- `401 Unauthorized`: User not authenticated
- `409 Conflict`: Group with the same name already exists for the user
- `500 Internal Server Error`: Server error

**Example Validation Error**:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "Group name is required"
      }
    ]
  }
}
```

**Example Conflict Error**:

```json
{
  "error": {
    "code": "CONFLICT_ERROR",
    "message": "A group with this name already exists"
  }
}
```

---

### Update Group

Update a group's name.

**Endpoint**: `PATCH /api/groups/:groupId`

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | Yes | ID of the group to update |

**Request Headers**:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Updated Group Name"
}
```

**Field Descriptions**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | string | Yes | 1-100 characters, trimmed | Group name |

**Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "group": {
    "id": "clx456def",
    "name": "Updated Group Name",
    "userId": "user_2abc123",
    "createdAt": "2024-01-05T08:00:00.000Z",
    "updatedAt": "2024-01-12T14:30:00.000Z"
  }
}
```

**Error Responses**:

- `400 Bad Request`: Validation error
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own the group
- `404 Not Found`: Group not found
- `409 Conflict`: Group with the same name already exists for the user
- `500 Internal Server Error`: Server error

---

### Delete Group

Delete a group. This will also delete all tasks associated with the group (cascade delete).

**Endpoint**: `DELETE /api/groups/:groupId`

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | Yes | ID of the group to delete |

**Request Headers**:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

**Response**:

- **Status Code**: `200 OK`
- **Response Body**:

```json
{
  "group": {
    "id": "clx456def",
    "name": "Work",
    "userId": "user_2abc123",
    "createdAt": "2024-01-05T08:00:00.000Z",
    "updatedAt": "2024-01-05T08:00:00.000Z"
  }
}
```

**Note**: Deleting a group will cascade delete all associated tasks.

**Error Responses**:

- `400 Bad Request`: Invalid group ID format
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own the group
- `404 Not Found`: Group not found
- `500 Internal Server Error`: Server error

---

## Data Models

### Task Model

```typescript
{
  id: string;           // CUID, auto-generated
  title: string;        // 1-200 characters
  description: string | null;  // Max 1000 characters, optional
  priority: "low" | "medium" | "high";
  dueDate: Date | null;  // Optional ISO 8601 datetime
  completed: boolean;   // Default: false
  groupId: string;      // Foreign key to Group
  userId: string;       // Foreign key to User (Clerk user ID)
  createdAt: Date;      // Auto-generated timestamp
  updatedAt: Date;      // Auto-updated timestamp
}
```

### Group Model

```typescript
{
  id: string;           // CUID, auto-generated
  name: string;         // 1-100 characters
  userId: string;       // Foreign key to User (Clerk user ID)
  createdAt: Date;      // Auto-generated timestamp
  updatedAt: Date;      // Auto-updated timestamp
}
```

---

## Best Practices

### Request Headers

Always include the following headers in your requests:

```
Authorization: Bearer <clerk-session-token>
Content-Type: application/json
```

### Date Format

Dates should be provided in ISO 8601 format:

- Format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `"2024-01-15T10:00:00.000Z"`

### Rate Limiting

Currently, there are no explicit rate limits documented. However, it's recommended to:

- Implement client-side rate limiting for production use
- Handle `429 Too Many Requests` responses gracefully if implemented in the future

### Error Handling

Always check the response status code and handle errors appropriately:

1. Check for `2xx` status codes for success
2. Handle `4xx` errors (client errors) with appropriate user feedback
3. Handle `5xx` errors (server errors) with retry logic or fallback behavior

### Pagination

Currently, all list endpoints return all results. For large datasets, consider:

- Implementing pagination in the future
- Using query parameters like `?page=1&limit=50`

---

## Example Usage

### JavaScript/TypeScript with Fetch

```typescript
// Get all tasks
const response = await fetch('/api/tasks', {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Include cookies for Clerk auth
});

const data = await response.json();
if (!response.ok) {
  throw new Error(data.error.message);
}
console.log(data.tasks);

// Create a task
const newTask = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    title: 'New Task',
    description: 'Task description',
    priority: 'high',
    groupId: 'clx456def',
    dueDate: '2024-01-15T10:00:00.000Z',
  }),
});

const taskData = await newTask.json();
console.log(taskData.task);
```

### cURL Examples

```bash
# Get all tasks
curl -X GET https://your-domain.com/api/tasks \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=<clerk-session-cookie>"

# Create a task
curl -X POST https://your-domain.com/api/tasks \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=<clerk-session-cookie>" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "high",
    "groupId": "clx456def",
    "dueDate": "2024-01-15T10:00:00.000Z"
  }'

# Update a task
curl -X PUT https://your-domain.com/api/tasks/clx123abc \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=<clerk-session-cookie>" \
  -d '{
    "title": "Updated Task Title",
    "priority": "medium"
  }'

# Delete a task
curl -X DELETE https://your-domain.com/api/tasks/clx123abc \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=<clerk-session-cookie>"
```

---

## Versioning

Currently, the API does not have explicit versioning. All endpoints are under `/api/*`. Future versions may use path-based versioning (e.g., `/api/v1/tasks`) or header-based versioning.

---

## Support

For issues, questions, or contributions, please refer to the main [README.md](../README.md) file.
