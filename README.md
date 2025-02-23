# Real-Time Chat System

WebSocket-based chat system with private messaging and group chat functionality.

## Features

- Private 1:1 messaging – Users can send direct messages to each other.
- Group chat creation/joining – Users can create or join groups to chat with multiple people.
- Message history storage (SQLite) – All messages are saved in a database for later access.
- REST API endpoints – Provides API routes to manage users, groups, and messages.
- WebSocket real-time communication – Enables instant message delivery without page refresh.
- User Presence Status: Show online users – Bonus

## Tech Stack

- Node.js/Express.js
- WebSocket (ws library)
- SQLite (with Knex.js)

## Setup Instructions

### Prerequisites

- Node.js
- npm
- SQLite3

### Installation

1. Clone repository: https://github.com/Amr-azab/Real-time-chat.git

```bash
git clone https://github.com/Amr-azab/Real-time-chat.git
```
```bash
cd Real-time-chat
```

2. Install dependencies:

```bash
npm install
```

3. Run database migrations:

```bash
knex migrate:latest
```

4. Start the server:

```bash
npm start
```

## WebSocket Usage

**Connect to WebSocket endpoint:**

```arduino
ws://localhost:5000

```

## Message Formats

### Connect to Server

```json
{
  "type": "connect",
  "username": "your_username"
}
```

### Send Private Message

```json
{
  "type": "private_message",
  "sender": "amr",
  "receiver": "mohamed",
  "message": "Hello!"
}
```

### Create Group

```json
{
  "type": "create_group",
  "username": "amr",
  "group_name": "developers"
}
```

### Join Group

```json
{
  "type": "join_group",
  "username": "mohamed",
  "group_name": "developers"
}
```

### Send Group Message

```json
{
  "type": "group_message",
  "sender": "amr",
  "group_name": "developers",
  "message": "Hello team!"
}
```

### Create User

```json
{
  "type": "create_user",
  "username": "yousef"
}
```

## REST API Examples

### 1. Get Users

```http
GET /api/users

```

### Response

```json
[
  {
    "id": 1,
    "username": "amr"
  },
  {
    "id": 2,
    "username": "mohamed"
  }
]
```

### 2. Create User

```http
GET /api/users

```

### Request Body

```json
{
  "username": "amr"
}
```

### Response

```json
{
  "id": 1,
  "username": "amr"
}
```

### 3. Get Groups

```http
GET /api/groups


```

### Response

```json
[
  {
    "id": 1,
    "group_name": "developers"
  }
]
```

### 4. Create Group

```http
POST /api/groups



```

### Request Body

```json
{
  "group_name": "developers"
}
```

### Response

```json
{
  "id": 1,
  "group_name": "developers"
}
```

### 5. Join Group

```http
POST /api/groups/join




```

### Request Body

```json
{
  "username": "amr",
  "group_name": "developers"
}
```

### Response

```json
{
  "message": "User amr joined group developers"
}
```

### 6. Get Private Messages

```http
GET /api/messages/private/{username}


```

**Username:** `amr`

### Response

```json
{
  "success": true,
  "totalMessages": 3,
  "messages": [
    {
      "id": 7,
      "sender": "amr",
      "receiver": "mohamed",
      "group_name": null,
      "message": "I am fine",
      "timestamp": "2025-02-22 20:07:48"
    },
    {
      "id": 6,
      "sender": "amr",
      "receiver": "mohamed",
      "group_name": null,
      "message": "Hello, mo!",
      "timestamp": "2025-02-22 20:07:48"
    },
    {
      "id": 3,
      "sender": "mohamed",
      "receiver": "amr",
      "group_name": null,
      "message": "how are you!",
      "timestamp": "2025-02-22 20:07:48"
    }
  ]
}
```

### 7. Get Group Messages

```http
GET /api/messages/group/{group_name}

```

**group_name:** `Developers`

### Response

```json
{
  "success": true,
  "totalMessages": 4,
  "messages": [
    {
      "id": 11,
      "sender": "john",
      "receiver": null,
      "group_name": "Developers",
      "message": "Hello, my name is john cena !",
      "timestamp": "2025-02-22 10:37:36"
    },
    {
      "id": 7,
      "sender": "amr",
      "receiver": null,
      "group_name": "Developers",
      "message": "Hello, Developers!",
      "timestamp": "2025-02-22 10:13:08"
    },
    {
      "id": 6,
      "sender": "amr",
      "receiver": null,
      "group_name": "Developers",
      "message": "Hello, Developers!",
      "timestamp": "2025-02-22 10:09:26"
    },
    {
      "id": 3,
      "sender": "amr",
      "receiver": null,
      "group_name": "Developers",
      "message": "Welcome to Developers group!",
      "timestamp": "2025-02-22 09:32:43"
    }
  ]
}
```
