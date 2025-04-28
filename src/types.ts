// Temel tip tanımlamaları
export interface BaseModel {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Notification tipi
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  read: boolean;
  createdAt: string;
}

// User tipi
export interface User {
  id: string;
  name: string;
  email: string;
  role: any; // UserRole tipini kullanıyoruz, ancak döngüsel bağımlılık oluşmaması için any olarak tanımlıyoruz
  avatar?: string;
}

// Diğer tip tanımlamaları ileride eklenecek
