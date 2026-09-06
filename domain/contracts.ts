import { z } from 'zod';

export type EntityId<T extends string> = string & { readonly entity: T };

export const quantitySchema = z.object({
  value: z.number().nonnegative(),
  unit: z.enum(['kg', 'tonne']),
});
export type Quantity = z.infer<typeof quantitySchema>;

export const moneySchema = z.object({
  amountMinor: z.number().int(),
  currency: z.literal('INR'),
});
export type Money = z.infer<typeof moneySchema>;

export const roleIds = ['farmer', 'fpo', 'buyer', 'storage', 'transport', 'quality', 'admin'] as const;
export const roleIdSchema = z.enum(roleIds);
export type RoleId = z.infer<typeof roleIdSchema>;

export type PermissionCode =
  | 'produce:write' | 'agreement:write' | 'procurement:write'
  | 'service:write' | 'operations:write' | 'admin:review';
export type RestrictionCode = 'unverified' | 'suspended';

export type ActorSummary = {
  id: EntityId<'actor'>;
  role: RoleId;
  displayName: string;
};

export type ActorContext = {
  userId: EntityId<'user'>;
  activeActorId: EntityId<'actor'>;
  availableActors: ActorSummary[];
  permissions: PermissionCode[];
  restrictions: RestrictionCode[];
  locale: 'en-IN';
  timeZone: 'Asia/Kolkata';
};

export type QueryResult<T> =
  | { status: 'success'; data: T }
  | { status: 'not_found' }
  | { status: 'forbidden'; reason: string };

export type CommandResult<T> =
  | { status: 'success'; data: T }
  | { status: 'validation_error'; fields: Record<string, string> }
  | { status: 'forbidden'; reason: string }
  | { status: 'conflict'; reason: string };

export interface QueryPort<Params, Result> {
  execute(params: Params, context: ActorContext): Promise<QueryResult<Result>>;
}

export interface CommandPort<Input, Result> {
  execute(input: Input, context: ActorContext): Promise<CommandResult<Result>>;
}

