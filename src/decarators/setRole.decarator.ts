import { SetMetadata } from '@nestjs/common';
import { EnumRole } from '@prisma/client';

export const setRole = (...role: EnumRole[]) => SetMetadata('roles', role);
