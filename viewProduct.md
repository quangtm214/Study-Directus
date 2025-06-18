```mermaid
sequenceDiagram
    participant Browser
    participant NestJS as Product Controller
    participant Middleware as DirectusTokenMiddleware
    participant ProdSvc as Product Service
    participant DirectusSvc as Directus Service
    participant DirectusAPI as Directus API
    participant ExFilter as Exception Filter

    %% GET Request Flow - View Products
    Browser->>NestJS: GET /product
    NestJS->>Middleware: Process request
    Middleware->>Middleware: Extract access_token from cookies
    
    alt Has Valid Token
        Middleware->>DirectusSvc: setToken(access_token)
        DirectusSvc-->>Middleware: Token set
        Middleware-->>NestJS: Continue
        NestJS->>ProdSvc: getProducts()
        ProdSvc->>DirectusSvc: getClient()
        DirectusSvc-->>ProdSvc: Return client
        ProdSvc->>DirectusAPI: readItems('product', {fields, filter})
        DirectusAPI-->>ProdSvc: Return product data
        ProdSvc-->>NestJS: Return products
        NestJS-->>Browser: Render product.hbs with products
    else Token Error
        Middleware->>DirectusSvc: setToken(access_token)
        DirectusSvc-->>Middleware: Token error
        Middleware-->>NestJS: Continue (without token)
        NestJS->>ProdSvc: getProducts()
        ProdSvc->>DirectusSvc: getClient()
        DirectusSvc-->>ProdSvc: Return client (unauthenticated)
        ProdSvc->>DirectusAPI: readItems('product', {fields, filter})
        DirectusAPI-->>ProdSvc: TOKEN_EXPIRED error
        ProdSvc->>ExFilter: Throw HttpException(TOKEN_EXPIRED)
        ExFilter->>DirectusSvc: refreshToken(refresh_token from cookies)
        
        alt Token Refresh Success
            DirectusSvc->>DirectusAPI: Refresh token request
            DirectusAPI-->>DirectusSvc: New access_token
            DirectusSvc-->>ExFilter: Return new tokens
            ExFilter->>Browser: Set new access_token cookie
            ExFilter->>Browser: Redirect to /product
        else Token Refresh Failure
            DirectusSvc->>DirectusAPI: Refresh token request
            DirectusAPI-->>DirectusSvc: Token error
            DirectusSvc-->>ExFilter: Throw error
            ExFilter->>Browser: Clear auth cookies
            ExFilter->>Browser: Redirect to /auth/login
        end
    end