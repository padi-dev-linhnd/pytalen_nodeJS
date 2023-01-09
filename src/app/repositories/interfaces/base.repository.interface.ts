export interface BaseRepositoryInterface {
  bulkcreate(array: []): Promise<any[]>
  findById(id: number): Promise<any>
  getAll(): Promise<any[]>
  findByCondition(args: object): Promise<any>
}
