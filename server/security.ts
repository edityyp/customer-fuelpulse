import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import type { Role } from '../shared/types';

export function generateReceiptToken(bytes = 32): string { return randomBytes(bytes).toString('base64url'); }
export function sha256(data: Buffer | string): string { return createHash('sha256').update(data).digest('hex'); }
export function safeEqual(a: string, b: string): boolean { const ab=Buffer.from(a); const bb=Buffer.from(b); return ab.length===bb.length && timingSafeEqual(ab,bb); }
export function maskMobile(value?: string | null): string { if(!value) return 'Not provided'; const digits=value.replace(/\D/g,''); return `${'*'.repeat(Math.max(0,digits.length-4))}${digits.slice(-4)}`; }
export function maskInvoice(value?: string | null): string { if(!value) return 'Unknown'; return `${'•'.repeat(Math.max(0,value.length-4))}${value.slice(-4)}`; }
const rank: Record<Role,number>={USER:1,MANAGER:2,OWNER:3};
export function assertRole(actual:Role,required:Role):void{if(rank[actual]<rank[required]){const error=new Error('Forbidden');(error as Error & {statusCode?:number}).statusCode=403;throw error;}}
export function canAccessUserResource(actor:{user_id:string;role:Role;station_id?:string},ownerUserId:string):boolean{return actor.role==='OWNER'||actor.user_id===ownerUserId;}
export function canManageStation(actor:{role:Role;station_id?:string},stationId:string):boolean{return actor.role==='OWNER'||(actor.role==='MANAGER'&&actor.station_id===stationId);}
