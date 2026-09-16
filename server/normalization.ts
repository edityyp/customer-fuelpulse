export function normalizeMobile(input: string): string {
  const digits=input.replace(/\D/g,'');
  if(digits.length===12&&digits.startsWith('91'))return digits.slice(2);
  if(digits.length===11&&digits.startsWith('0'))return digits.slice(1);
  if(digits.length===10)return digits;
  throw new Error('Invalid Indian mobile number');
}
export function normalizeVehicleNumber(input:string):string{const value=input.toUpperCase().replace(/[^A-Z0-9]/g,'');if(value.length<6||value.length>12)throw new Error('Invalid vehicle number');return value;}
export function normalizeInvoice(input:string):string{const value=input.trim().replace(/\s+/g,'');if(!value||value.length>64)throw new Error('Invalid invoice number');return value;}
export function rupeeAmount(value:string):number|undefined{const clean=value.replace(/[₹,\s]/g,'');const n=Number(clean);return Number.isFinite(n)?Number(n.toFixed(2)):undefined;}
