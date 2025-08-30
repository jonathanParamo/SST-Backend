import { IsEmail, IsNotEmpty, Matches, MinLength, IsIn } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsIn(['admin', 'siso', 'ingeniero', 'obrero'], { message: 'Rol no válido' })
  role: string;
}
