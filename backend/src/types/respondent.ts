export interface IRespondent {
  id?: number;
  serial_no: string;
  school_name: string;
  supervisor_name: string;
  collection_date: string; // YYYY-MM-DD format
  age: number;
  stay_with: number;
  guardian_occupation: number;
  guardian_occupation_other?: string;
  guardian_education: number;
  religion: number;
  family_size: number;
  older_siblings: number;
  siblings_have_partners?: number;
  parents_give_pocket_money: number;
  pocket_money_adequate?: number;
  financial_support_source: number;
  guardian_visits: number;
  school_visitor?: number;
  has_rh_info: number;
  rh_teacher?: number;
  rh_parents?: number;
  rh_health_worker?: number;
  rh_friends?: number;
  rh_media?: number;
  topic_sexuality?: number;
  topic_abstinence?: number;
  topic_condoms?: number;
  topic_sti_hiv?: number;
  topic_relationships?: number;
  info_adequate: number;
  created_at?: string;
  updated_at?: string;
}

export interface IRespondentCreateRequest {
  serial_no: string;
  school_name: string;
  supervisor_name: string;
  collection_date: string;
  age: number;
  stay_with: number;
  guardian_occupation: number;
  guardian_occupation_other?: string;
  guardian_education: number;
  religion: number;
  family_size: number;
  older_siblings: number;
  siblings_have_partners?: number;
  parents_give_pocket_money: number;
  pocket_money_adequate?: number;
  financial_support_source: number;
  guardian_visits: number;
  school_visitor?: number;
  has_rh_info: number;
  rh_teacher?: number;
  rh_parents?: number;
  rh_health_worker?: number;
  rh_friends?: number;
  rh_media?: number;
  topic_sexuality?: number;
  topic_abstinence?: number;
  topic_condoms?: number;
  topic_sti_hiv?: number;
  topic_relationships?: number;
  info_adequate: number;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
