
export default class Filter {
  static resetFieldsFilter = (f: Filter): Filter => {
    for (const key in f.fieldsFilter) {
      f.fieldsFilter[key] = "";
    }
    return f;
  }
  static withLimit = (arg0: number): Filter => {
    const f = new Filter();
    f.limit = arg0;
    return f;
  }
  limit?: number = 5;
  page?: number = 0;
  orderType?: string;
  orderBy?: string;
  contains?: boolean;
  exacts?: boolean;
  day?: number;
  year?: number;
  month?: number;
  module?: string;
  fieldsFilter: Record<string, any> = {};
  dayTo?: number;
  monthTo?: number;
  yearTo?: number;
  maxValue?: number;
  availabilityCheck?: boolean;


  public static queryString = (filter?: Filter) => {
    if (!filter) return '';
    let q: string[] = [];
    if (filter.page && filter.page >= 0) {
      q.push(`page=${filter.page}`);
    }
    if (filter.limit && filter.limit >= 0) {
      q.push(`limit=${filter.limit}`);
    }
    if (filter.orderBy) {
      q.push(`order=${filter.orderBy}`);
    }
    if (filter.orderType && (filter.orderType === 'asc' || filter.orderType === 'desc')) {
      q.push(`orderDesc=${filter.orderType === 'desc' ? 'true' : 'false'}`);
    }
    if (filter.fieldsFilter)
      for (const key in filter.fieldsFilter) {
        if (Object.prototype.hasOwnProperty.call(filter.fieldsFilter, key)) {
          const element = filter.fieldsFilter[key];
          q.push(`filter=${encodeURIComponent(key)}:${encodeURIComponent(element)}`);
        }
      }
    return '?' + q.join('&');
  }

}
