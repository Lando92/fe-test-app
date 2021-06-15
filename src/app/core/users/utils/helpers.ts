import {ParamMap} from '@angular/router';
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function parseQueryParams(queryParams: ParamMap, fields = {
  page: 'page',
  pageSize: 'limit'
}) {
  const page = parseNumberQueryValue(queryParams, fields.page, 0);
  const pageSize = parseNumberQueryValue(queryParams, fields.pageSize, 20);
  return {page, pageSize};
}


export function parseNumberQueryValue(params: ParamMap, field: string, defaultValue: number): number {
  return parseInt(params.get(field), 20) ? parseInt(params.get(field), 10) : defaultValue;
}

export function getQueryParams(params: ParamMap, omit: string[]): any {
  return params.keys.reduce((curr, key) => {
    if (omit && omit.length && omit.find(k => k === key)) {
      return curr;
    }
    const param = params.getAll(key);
    if (param) {
      curr[key] = param.length === 1 ? param[0] : param;
    }
    return curr;
  }, {});
}

export function ValidateString(control: FormControl) {
  const pattern = /[\\!"\\.\\{\\}\\[\]]/g; // can change regex with your requirement if validation fails, return error name & value of true
  if (pattern.test(control.value)) {
    return { validString: {value: true} };
  }
  // otherwise, if the validation passes, we simply return null
  return null;
}
