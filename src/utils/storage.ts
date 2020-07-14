/**
 * 封装*本地存储方法
 */

export const Local = {
  getItem(key: string) {
    let value = '';
    try {
      value = JSON.parse(localStorage[key]);
    } catch (e) {
      value = localStorage[key] || '';
    }
    return value;
  },
  setItem(key: string, item: any) {
    let tmpl_item: string = typeof item === 'string' ? item : JSON.stringify(item);
    localStorage.setItem(key, tmpl_item);
  },
  removeItem(key: string) {
    localStorage.removeItem(key);
  },
  clearAll() {
    localStorage.clear();
  },
};

export const Session = {
  getItem(key: string) {
    let value = '';
    try {
      value = JSON.parse(sessionStorage[key]);
    } catch (e) {
      value = sessionStorage[key] || '';
    }
    return value;
  },
  setItem(key: string, item: any) {
    let tmpl_item: string = typeof item === 'string' ? item : JSON.stringify(item);
    sessionStorage.setItem(key, tmpl_item);
  },
  removeItem(key: string) {
    sessionStorage.removeItem(key);
  },
  clearAll() {
    sessionStorage.clear();
  },
};
