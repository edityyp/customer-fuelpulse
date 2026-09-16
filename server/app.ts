import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { InMemoryStore } from './store';
import { normalizeMobile, normalizeVehicleNumber } from './normalization';
import { parseReceiptOcr } from './ocrParser';
import { evaluateReceipt } from './verification';
import { assertRole, generateReceiptToken } from './security';
import type { FuelReceipt, Role, UserProfile, Vehicle } from '../shared/types';

export const store = new InMemoryStore();

function actor(req:{headers:Record<string,unknown>}):UserProfile{const role=String(req.headers['x-demo-role']??'USER').toUpperCase() as Role;const userId=String(req.headers['x-demo-user']??'demo-user');return store.users.get(userId)??{user_id:userId,name:'Customer',mobile_number:'9997874057',role,status:'ACTIVE',station_id:'kalash-firozabad'};}

export async function buildApp(){
  const app=Fastify({logger:false,bodyLimit:6_000_000});
  await app.register(helmet); await app.register(rateLimit,{max:120,timeWindow:'1 minute'});
  app.get('/api/health',async()=>({status:'ok',app:'FuelPulse Customer V2'}));
  app.post('/api/auth/register',async(req)=>{const body=z.object({name:z.string().min(2),mobile_number:z.string()}).parse(req.body);const mobile=normalizeMobile(body.mobile_number);const profile:UserProfile={user_id:randomUUID(),name:body.name,mobile_number:mobile,role:'USER',status:'ACTIVE'};store.users.set(profile.user_id,profile);return{profile,otpHandledBy:'Supabase phone auth in production'};});
  app.post('/api/user/vehicles',async(req)=>{const me=actor(req);const body=z.object({vehicle_number:z.string(),vehicle_type:z.enum(['Bike','Car','Truck','Auto','Other']),nickname:z.string().optional()}).parse(req.body);const number=normalizeVehicleNumber(body.vehicle_number);const duplicate=[...store.vehicles.values()].some(v=>v.user_id===me.user_id&&v.vehicle_number===number&&v.active);if(duplicate)return{error:'Vehicle already exists',statusCode:409};const vehicle:Vehicle={vehicle_id:randomUUID(),user_id:me.user_id,vehicle_number:number,vehicle_type:body.vehicle_type,nickname:body.nickname,active:true};store.vehicles.set(vehicle.vehicle_id,vehicle);return{vehicle};});
  app.post('/api/receipts/parse',async(req)=>{const body=z.object({text:z.string().min(1)}).parse(req.body);return{extracted:parseReceiptOcr(body.text),warning:'OCR is extraction only. Backend verification is required before points.'};});
  app.post('/api/receipts/redeem',async(req)=>{const me=actor(req);const body=z.object({vehicle_id:z.string(),station_id:z.string(),extracted:z.record(z.unknown()),idempotency_key:z.string().min(8)}).parse(req.body);const vehicle=store.vehicles.get(body.vehicle_id);if(!vehicle||vehicle.user_id!==me.user_id)throw Object.assign(new Error('Vehicle not found'),{statusCode:404});return evaluateReceipt(store,{user:me,vehicle,stationId:body.station_id,extracted:body.extracted,idempotencyKey:body.idempotency_key});});
  app.get('/api/manager/transactions',async(req)=>{const me=actor(req);assertRole(me.role,'MANAGER');const q=z.object({search:z.string().optional()}).parse(req.query);const rows=[...store.receipts.values()].filter(r=>!q.search||JSON.stringify(r).toLowerCase().includes(q.search.toLowerCase()));return{rows};});
  app.post('/api/owner/receipts/seed',async(req)=>{const me=actor(req);assertRole(me.role,'OWNER');const body=z.object({invoice_number:z.string(),station_id:z.string(),vehicle_number:z.string(),mobile_number:z.string().optional(),amount:z.number(),volume_litre:z.number(),transaction_at:z.string()}).parse(req.body);const receipt:FuelReceipt={id:randomUUID(),invoice_number:body.invoice_number,receipt_token:generateReceiptToken(),station_id:body.station_id,product:'Petrol',rate_per_litre:Number((body.amount/body.volume_litre).toFixed(2)),amount:body.amount,volume_litre:body.volume_litre,vehicle_number:normalizeVehicleNumber(body.vehicle_number),mobile_number:body.mobile_number?normalizeMobile(body.mobile_number):null,transaction_at:body.transaction_at,source:'MANUAL_SEED',status:'VERIFIED'};store.receipts.set(receipt.id,receipt);return{receipt};});
  app.setErrorHandler((error,_req,reply)=>{const status=(error as Error&{statusCode?:number}).statusCode??(error.name==='ZodError'?400:500);reply.code(status).send({error:status>=500?'Server error; retry safely':error.message});});
  return app;
}
