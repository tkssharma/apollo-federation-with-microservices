import { SetMetadata } from '@nestjs/common';
import { Roles } from '../interface/roles';

export const RolesAllowed = (...roles: Roles[]) => SetMetadata('roles', roles);
