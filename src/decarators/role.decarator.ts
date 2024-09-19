import { UseGuards } from '@nestjs/common';
import { RoleCheck } from 'src/guards/role.guard';

export const Role = () => UseGuards(RoleCheck);
