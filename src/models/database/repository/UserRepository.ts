import { Filter } from 'mongodb';
import { BaseRepository } from './BaseRepository';
import { UserSchema } from '../schemas/UserSchema';
import { COLLECTIONS } from '../collections';

/**
 * Kullanıcı repository sınıfı
 */
export class UserRepository extends BaseRepository<UserSchema> {
  /**
   * UserRepository constructor
   */
  constructor() {
    super(COLLECTIONS.USERS);
  }

  /**
   * E-posta adresine göre kullanıcı getirir
   * @param email Kullanıcı e-posta adresi
   * @returns Kullanıcı veya null
   */
  async findByEmail(email: string): Promise<UserSchema | null> {
    return this.findOne({ email } as Filter<UserSchema>);
  }

  /**
   * Kullanıcının şifresini günceller
   * @param id Kullanıcı ID'si
   * @param password Yeni şifre
   * @returns Güncellenen kullanıcı sayısı
   */
  async updatePassword(id: string, password: string): Promise<number> {
    return this.update(id, { 
      password,
      passwordLastChanged: new Date()
    } as Partial<UserSchema>);
  }

  /**
   * Kullanıcının rolüne göre kullanıcıları getirir
   * @param role Kullanıcı rolü
   * @returns Kullanıcı listesi
   */
  async findByRole(role: string): Promise<UserSchema[]> {
    return this.findAll({ role } as Filter<UserSchema>);
  }

  /**
   * Kullanıcının durumuna göre kullanıcıları getirir
   * @param status Kullanıcı durumu
   * @returns Kullanıcı listesi
   */
  async findByStatus(status: string): Promise<UserSchema[]> {
    return this.findAll({ status } as Filter<UserSchema>);
  }

  /**
   * Kullanıcının projesine göre kullanıcıları getirir
   * @param projectId Proje ID'si
   * @returns Kullanıcı listesi
   */
  async findByProject(projectId: string): Promise<UserSchema[]> {
    return this.findAll({ 
      projects: { $in: [projectId] } 
    } as Filter<UserSchema>);
  }
}
