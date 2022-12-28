export interface BaseRepositoryInterface {
  findById(id: number): Promise<any>
  getAll(): Promise<any[]>
  findByCondition(args: object): Promise<any>

  User_Login(dataReq: any): Promise<any>
  User_Logout(accessToken: string): Promise<any>
}
