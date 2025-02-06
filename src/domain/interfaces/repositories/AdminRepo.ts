
export interface AdminRepo {
  login(idUniversidad:number, user:string, password:string): Promise<String | undefined>;
}
