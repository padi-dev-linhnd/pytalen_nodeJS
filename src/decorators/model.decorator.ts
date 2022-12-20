import { Container } from 'typedi'
import { getModelFromTableName } from '@lib/db'

export function ModelContainer(property: string) {
  return function (object: any, propertyName: string, index?: number) {
    const item = getModelFromTableName(property)
    Container.registerHandler({ object, propertyName, index, value: () => item })
  }
}
