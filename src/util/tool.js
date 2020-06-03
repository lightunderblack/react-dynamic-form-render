import { MAX_CACHE_CHARACTER_LENGTH } from '../constant/attrType';

const _sessionStorage = {
  add (key, value) {
    try {
      const jsonString = JSON.stringify(value);
      if (jsonString.length > MAX_CACHE_CHARACTER_LENGTH) {
        console.error(`dynamicFormRender cache size exceed ${MAX_CACHE_CHARACTER_LENGTH}`);
        return false;
      } else {
        sessionStorage.setItem(key, jsonString);
        return true;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  get (key) {
    const value = sessionStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error(e);
        return null;
      }
    } else {
      return null;
    }
  },
  remove (key) {
    sessionStorage.removeItem(key);
  },
  clear () {
    //清除所有huan c缓存
    sessionStorage.clear();
  }
};

export default {
  sessionStorage: _sessionStorage,
  /**计算字符串的字节数 */
  byteSizeOfString (str, charset) {
    var total = 0, charCode, i, len;
    charset = charset ? charset.toLowerCase() : '';

    if (charset === 'utf-16' || charset === 'utf16'){
      for(i = 0, len = str.length; i < len; i++){
        charCode = str.charCodeAt(i);
        if(charCode <= 0xffff){
          total += 2;
        }else{
          total += 4;
        }
      }
    } else{
      for (i = 0, len = str.length; i < len; i++){
        charCode = str.charCodeAt(i);
        if(charCode <= 0x007f) {
          total += 1;
        }else if(charCode <= 0x07ff){
          total += 2;
        }else if(charCode <= 0xffff){
          total += 3;
        }else{
          total += 4;
        }
      }
    }

    return total;
  },
};