import type { FuelReceipt, UserProfile, Vehicle } from '../shared/types';
export interface RedemptionRow{id:string;receipt_id:string;user_id:string;vehicle_id:string;status:'SUCCESS'|'FAILED'|'REVIEW_REQUIRED';idempotency_key:string;points_awarded:number;created_at:string}
export interface PointsLedgerRow{id:string;user_id:string;vehicle_id:string;receipt_id:string;points:number;type:'EARN'|'REDEEM'|'ADJUST';description:string;created_at:string}
export interface AppSettings{receipt_validity_minutes:number;points_per_litre:number;mobile_mismatch_policy:'REJECT'|'REVIEW';require_vehicle_on_receipt:boolean;allowed_clock_skew_seconds:number}
export class InMemoryStore{
 users=new Map<string,UserProfile>(); vehicles=new Map<string,Vehicle>(); receipts=new Map<string,FuelReceipt>(); redemptions=new Map<string,RedemptionRow>(); ledger=new Map<string,PointsLedgerRow>(); attemptsByUser=new Map<string,number[]>(); imageHashes=new Map<string,Set<string>>();
 settings:AppSettings={receipt_validity_minutes:20,points_per_litre:1,mobile_mismatch_policy:'REJECT',require_vehicle_on_receipt:true,allowed_clock_skew_seconds:90};
 findReceiptByInvoice(stationId:string,invoice:string){return [...this.receipts.values()].find(r=>r.station_id===stationId&&r.invoice_number===invoice)}
 findReceiptByToken(token:string){return [...this.receipts.values()].find(r=>r.receipt_token===token)}
 successfulRedemption(receiptId:string){return [...this.redemptions.values()].find(r=>r.receipt_id===receiptId&&r.status==='SUCCESS')}
 redemptionByIdempotency(userId:string,key:string){return [...this.redemptions.values()].find(r=>r.user_id===userId&&r.idempotency_key===key)}
 pointsBalance(userId:string){return [...this.ledger.values()].filter(l=>l.user_id===userId).reduce((sum,l)=>sum+l.points,0)}
}
