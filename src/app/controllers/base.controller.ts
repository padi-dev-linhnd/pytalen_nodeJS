import { CommonEnum } from '@enum/common.enum'
import { ApiResponse } from '@interfaces/response.interface'
import { HttpError } from 'routing-controllers'

export enum TYPE_RES {
  JSON,
  SEND,
}

export class BaseController {
  protected code = CommonEnum.CODE_SUCCESS
  protected data = {}
  protected message = 'Success'
  protected stack = 'stack'
  protected typeRes: TYPE_RES = TYPE_RES.JSON
  protected exception: HttpError

  public setCode(code: number): this {
    this.code = code

    return this
  }

  public setData<T>(data: T): this {
    this.data = data

    return this
  }

  public setMessage(message: string): this {
    this.message = message

    return this
  }

  getResponse(res: any, status: boolean) {
    const result: ApiResponse = {
      status: status,
      code: this.code,
      data: this.data,
      message: this.message,
    }
    if (this.typeRes === TYPE_RES.JSON) {
      return res.status(this.code).json(result)
    }

    if (this.typeRes === TYPE_RES.SEND) {
      return res.status(this.code).send(result)
    }
  }
  responseSuccess(res: any) {
    return this.getResponse(res, true)
  }

  responseErrors(res: any): {
    errors: Object
  } {
    return this.getResponse(res, false)
  }
}
