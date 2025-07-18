export interface AuthLoginDto {
    email: string;
    password: string;
}

export interface CreateUserDto {
    first_name?: string;
    last_name?: string;
    email: string;
    password: string;
}