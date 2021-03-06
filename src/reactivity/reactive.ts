import { isObject } from './../shared/index'
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export interface Target {
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
}

export function reactive<T>(raw: T) {
  return createReactiveObject(raw, mutableHandlers)
}

export function readonly<T>(raw: T) {
  return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReadonly<T>(raw: T) {
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

function createReactiveObject(raw: Target, baseHandlers: ProxyHandler<any>) {
  return new Proxy(raw, baseHandlers)
}

export function isReactive(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}

export const toReactive = <T>(value: T): T => isObject(value) ? reactive(value) : value
