```mermaid
sequenceDiagram
    participant Browser
    participant NestJS as Auth Controller
    participant AuthSvc as Auth Service
    participant DirectusSvc as Directus Service
    participant DirectusAPI as Directus API
    participant ExFilter as Exception Filter

    %% GET Request Flow - Display Registration Form
    Browser->>NestJS: GET /auth/register
    NestJS-->>Browser: Render register-customer.hbs

    %% POST Request Flow - Submit Registration
    Browser->>NestJS: POST /auth/register (form data)
    NestJS->>AuthSvc: register(createUserDto)
    AuthSvc->>DirectusSvc: getClient()
    DirectusSvc-->>AuthSvc: Return client
    AuthSvc->>DirectusAPI: createUser(userData)
    
    alt Success
        DirectusAPI-->>AuthSvc: Return created user
        AuthSvc-->>NestJS: Return user data
        NestJS-->>Browser: Redirect to /auth/register?message=Đăng ký thành công!
    else Error
        DirectusAPI-->>AuthSvc: Return error
        AuthSvc->>AuthSvc: Format error with code
        AuthSvc-->>NestJS: Throw HttpException
        NestJS->>ExFilter: Process exception
        
        alt Record Not Unique
            ExFilter-->>Browser: Redirect with error "Email đã tồn tại"
        else Invalid Payload
            ExFilter-->>Browser: Redirect with error "Dữ liệu không hợp lệ"
        else Other Error
            ExFilter-->>Browser: Redirect with generic error message
        end
    end