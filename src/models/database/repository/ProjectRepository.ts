import { Filter } from 'mongodb';
import { BaseRepository } from './BaseRepository';
import { ProjectSchema, ProjectStatus } from '../schemas/ProjectSchema';
import { COLLECTIONS } from '../collections';

/**
 * Proje repository sınıfı
 */
export class ProjectRepository extends BaseRepository<ProjectSchema> {
  /**
   * ProjectRepository constructor
   */
  constructor() {
    super(COLLECTIONS.PROJECTS);
  }

  /**
   * Kullanıcının projelerini getirir
   * @param userId Kullanıcı ID'si
   * @returns Proje listesi
   */
  async findByUser(userId: string): Promise<ProjectSchema[]> {
    return this.findAll({ 
      'members.userId': userId 
    } as Filter<ProjectSchema>);
  }

  /**
   * Proje durumuna göre projeleri getirir
   * @param status Proje durumu
   * @returns Proje listesi
   */
  async findByStatus(status: ProjectStatus): Promise<ProjectSchema[]> {
    return this.findAll({ status } as Filter<ProjectSchema>);
  }

  /**
   * Aktif projeleri getirir
   * @returns Aktif proje listesi
   */
  async findActiveProjects(): Promise<ProjectSchema[]> {
    return this.findAll({ 
      status: ProjectStatus.ACTIVE 
    } as Filter<ProjectSchema>);
  }

  /**
   * Proje istatistiklerini günceller
   * @param id Proje ID'si
   * @param stats Proje istatistikleri
   * @returns Güncellenen proje sayısı
   */
  async updateStats(id: string, stats: Partial<ProjectSchema['stats']>): Promise<number> {
    return this.update(id, { 
      stats,
      updatedAt: new Date()
    } as Partial<ProjectSchema>);
  }

  /**
   * Projeye üye ekler
   * @param id Proje ID'si
   * @param member Proje üyesi
   * @returns Güncellenen proje sayısı
   */
  async addMember(id: string, member: ProjectSchema['members'][0]): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateOne(
      { $or: [{ _id: id }, { id }] } as Filter<ProjectSchema>,
      { $push: { members: member } }
    );
    return result.modifiedCount;
  }

  /**
   * Projeden üye çıkarır
   * @param id Proje ID'si
   * @param userId Kullanıcı ID'si
   * @returns Güncellenen proje sayısı
   */
  async removeMember(id: string, userId: string): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateOne(
      { $or: [{ _id: id }, { id }] } as Filter<ProjectSchema>,
      { $pull: { members: { userId } } }
    );
    return result.modifiedCount;
  }
}
