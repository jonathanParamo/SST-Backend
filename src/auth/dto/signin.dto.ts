import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class SigninDto {
  @IsEmail({}, { message: 'El correo no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
