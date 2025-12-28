# Secondbrain 🧠

A powerful backend API for managing and sharing your personal knowledge base. Save, organize, and selectively share your content collection with others through unique shareable links.

## Overview

Secondbrain is a content management platform that allows users to create their own personal "second brain" - a curated collection of links, articles, and resources. Users can organize their content privately and optionally share their entire collection with others via unique, generated share links.

## Features

- **User Authentication**: Secure signup and signin with JWT-based authentication
- **Password Security**: Bcrypt password hashing for enhanced security
- **Content Management**: Create, read, and delete personal content items
- **Shareable Brain**: Generate unique links to share your entire content collection publicly
- **Access Control**: Middleware-protected routes ensure data privacy
- **Input Validation**: Zod schema validation for robust data integrity

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Validation**: Zod

## API Endpoints

### Authentication

#### Sign Up
```http
POST /api/v1/signup
Content-Type: application/json

{
  "username": "string (3-55 chars)",
  "password": "string (5-25 chars)"
}
```

#### Sign In
```http
POST /api/v1/signin
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```
**Response**: Returns JWT token for authenticated requests

### Content Management (Protected Routes)

#### Add Content
```http
POST /api/v1/content
Authorization: Bearer <token>
Content-Type: application/json

{
  "link": "string",
  "type": "string",
  "title": "string"
}
```

#### Get All Content
```http
GET /api/v1/content
Authorization: Bearer <token>
```
**Response**: Returns all content items with populated user information

#### Delete Content
```http
DELETE /api/v1/content
Authorization: Bearer <token>
Content-Type: application/json

{
  "contentId": "string"
}
```

### Brain Sharing

#### Share/Unshare Brain
```http
POST /api/v1/brain/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "share": true/false
}
```
**Response**: Returns unique hash for sharing (if share=true)

#### Access Shared Brain (Public)
```http
GET /api/v1/brain/:shareLink
```
**Response**: Returns username and all content from the shared brain

## Installation

1. Clone the repository
```bash
git clone https://github.com/agananya03/Secondbrain.git
cd Secondbrain
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (create a `.env` file)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Build TypeScript
```bash
npm run build
```

5. Start the server
```bash
npm start
```

## Project Structure

```
Secondbrain/
├── src/
│   ├── index.ts        # Main application file with routes
│   ├── db.ts           # Database models and schemas
│   ├── middleware.ts   # Authentication middleware
│   └── utils.ts        # Utility functions (hash generation)
├── package.json
├── tsconfig.json
└── README.md
```

## Database Models

- **User**: Stores user credentials and authentication data
- **Content**: Stores user's saved content items (links, titles, types, tags)
- **Link**: Manages shareable brain links with unique hashes

## Security Features

- JWT-based authentication for secure API access
- bcrypt password hashing (salt rounds: 5)
- Middleware protection on sensitive routes
- Input validation using Zod schemas

## Future Enhancements

- [ ] Add tags functionality for content organization
- [ ] Implement content search and filtering
- [ ] Add pagination for content retrieval
- [ ] Support multiple content types (videos, documents, etc.)
- [ ] Add rate limiting for API endpoints
- [ ] Implement refresh token mechanism
- [ ] Add user profile management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Agananya** - [GitHub Profile](https://github.com/agananya03)

---

Built with ❤️ using TypeScript and Express.js
