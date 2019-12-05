/**
 * @export public
 * @doc_name 本地存储模块
 * @doc_index 6
 * @doc_directory host
 * @module miot/host/storage
 * @description 本地轻量级存储服务, 键值对格式
 */
//@native
import native, { Utils } from "../native";
export default {
  /**
   * 获取一个key 保存的字符串，如果已经调用 set 则返回对应的值，未调用 set 则返回空字串 ''
   * 如果value已过期，则会reject
   * @param {string} key 
   * @returns {*}
   * @example
   * import {Host} from 'miot'
   * ...
   * var value = await Host.storage.get('prop1')
   * //or
   * Host.storage.get('prpp1')
   * .then(val => {
   *  //load val success}
   *  console.log('load value:', val)
   * )
   * .catch(err => {
   *  //load val error 
   *  if (err === 'expired') {console.log('value for key already expired')}
   * })
   * ...
   */
  get(key) {
    //@native :=> Promise.resolve(null);
    //@mark andr done
    return new Promise((resolve, reject) => {
      native.MIOTHost.loadInfoCallback(key, value => {
        if (value) {
          let res = JSON.parse(value);
          if (res.expire > 0) {
            if (res.expire + res.time > new Date().getTime()) {
              resolve(res.value);
            } else {
              reject("expired");
            }
          } else {
            resolve(res.value);
          }
        } else {
          resolve(value);
        }
      });
    });
    //@native end
  },
  /**
   * 和 get 相对应，持久化一个 key=value 的数据
   * @param {string} key 获取 value 时传入的唯一标识
   * @param {object} val 要保存的数据
   * @param {object} [opt={ expire: 0 }] opt.expire 有效期 从保存的时候开始 expire ms以内数据有效。 
   * @returns {void}
   * @example
   * import {Host} from 'miot'
   * ...
   * Host.storage.set('key1','value1')
   * //or
   * Host.storage.set('key1','value1', {expire:3600})
   * ...
   */
  set(key, val, opt = { expire: 0 }) {
    //@native begin 
    //@mark andr done
    let value = {
      "value": val,
      "expire": opt ? opt.expire : 0,
      "time": new Date().getTime()
    };
    native.MIOTHost.saveInfo(key, JSON.stringify(value));
    //@native end
  },
  /**
   * 获取所有 keys 的 values
   * @param {array} keys
   * @return {promise<Array<json>>} 返回的promise传出的值是values数组，和传入的keys对应 [{key,value}]
   * @example
   * import {Host} from 'miot'
   * ...
   * Host.storage.load(['key1','key2']).then(res => console.log('success'))
   * ...
   * 
   */
  load(keys) {
    //@native :=> promise
    if (Utils.typeName(keys) !== "array") {
      return Promise.reject("传入参数不是数组");
    }
    let promiseArray = keys.map(key => {
      return this.get(key);
    });
    return Promise.all(promiseArray);
    //@native end
  },
  /**
   * 保存所有 keyValues 的数据，例如{key1:value1 , key2:value2 , key3:value3}
   * 每个 key 可单独更新数据，如果调用 set(key2,value4) 则只更新 key2，key1和 key3的值保持不变
   * @param {{key:value}} keyValues - 需要存储的数据
   * @param {object} [opt={ expire: 0 }] opt.expire 有效期 从保存的时候开始 expire ms以内数据有效。
   * @returns {void}
   * @example
   * import {Host} from 'miot'
   * ...
   * Host.storage.save({'key1':'val1','key2':'val2'})
   * //or
   * Host.storage.save({'key1':'val1','key2':'val2'}, {expire:3600})
   * ...
   * 
   */
  save(keyValues, opt = { expire: 0 }) {
    for (let key in keyValues) {
      this.set(key, keyValues[key], opt);
    }
  }
};