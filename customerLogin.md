```mermaid
sequenceDiagram
    participant Browser
    participant NestJS as Auth Controller
    participant AuthSvc as Auth Service
    participant DirectusSvc as Directus Service
    participant DirectusAPI as Directus API
    participant ExFilter as Exception Filter

    %% GET Request Flow - Display Login Form
    Browser->>NestJS: GET /auth/login
    NestJS-->>Browser: Render login.hbs

    %% POST Request Flow - Submit Login
    Browser->>NestJS: POST /auth/login (email, password)
    NestJS->>AuthSvc: login(email, password)
    AuthSvc->>DirectusSvc: login(email, password)
    DirectusSvc->>DirectusAPI: Authentication request
    
    alt Success
        DirectusAPI-->>DirectusSvc: Return access_token, refresh_token
        DirectusSvc-->>AuthSvc: Return auth data
        AuthSvc-->>NestJS: Return auth data
        NestJS->>Browser: Set cookies (access_token, refresh_token)
        NestJS->>Browser: Redirect to /product
    else Invalid Credentials
        DirectusAPI-->>DirectusSvc: INVALID_CREDENTIALS error
        DirectusSvc-->>AuthSvc: Throw HttpException
        AuthSvc-->>NestJS: Throw HttpException
        NestJS->>ExFilter: Handle exception
        ExFilter-->>Browser: Redirect to /auth/login with error message
    end
