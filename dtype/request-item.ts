export interface RequestItemCreate {
  name: string;
}

export interface RequestItemDelete {
  id: string;
}

export interface RequestItemUpdate {
  id: string;
  name: string;
}

export interface RequestItemGet {
  batch: number;
  page: number;
}

//interface agenda

export interface RequestAgendaDelete {
  id: string;
}

export interface RequestAgendaGet {
  all?: boolean;
  batch: number;
  page: number;
}

export interface RequestAgendaById {
  id: string;
}

export interface RequestAgendaSearch {
  title: string | null;
  date: string | null;
  on: string | null;
  kota_name: string | null;
  kategori_name: string | null;
  topik_name: string | null;
  biaya_name: string | null;
  kalangan_name: string | null;
  page: number;
  batch: number;
}

export interface RequestAgendaCreate {
  image: FileList;
  image_public_id: string;
  image_url: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  activity_time: string;
  pembicara: string;
  penyelenggara: string;
  on: string;
  location_detail: string | null;
  location_url: string | null;
  via_name: string | null;
  via_link: string | null;
  kota_name: string | null;
  kategori_name: string;
  topik_name: string;
  biaya_name: string;
  kalangan_name: string;
  published: boolean;
}

export interface RequestAgendaUpdate {
  id: string;
  title?: string | null;
  description?: string | null;
  date?: Date | null;
  time?: string | null;
  activity_time?: string | null;
  pembicara?: string | null;
  penyelenggara?: string | null;

  image?: FileList | null;
  image_public_id?: string | null;
  image_url?: string | null;
  on?: string | null;

  location_detail?: string | null;
  location_url?: string | null;

  via_name?: string | null;
  via_link?: string | null;

  kota_name?: string | null;

  kategori_name?: string | null;

  topik_name?: string | null;

  biaya_name?: string | null;

  kalangan_name?: string | null;

  published?: string | null;
}

export interface RequestUserGet {
  page: number;
  batch: number;
}

export interface RequestUserUpdate {
  id: string;
  role: string;
}

export interface RequestUserDelete {
  id: string;
}
