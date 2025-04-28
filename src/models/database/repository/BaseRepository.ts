import { Collection, Db, Filter, FindOptions, ObjectId, OptionalUnlessRequiredId, UpdateFilter, UpdateOptions } from 'mongodb';
import { getDb } from '../connection';

/**
 * Temel repository sınıfı
 * Tüm model repository'leri için temel CRUD işlemlerini sağlar
 */
export class BaseRepository<T> {
  protected collectionName: string;
  protected db: Db | null = null;
  protected collection: Collection<T> | null = null;

  /**
   * Repository constructor
   * @param collectionName Koleksiyon adı
   */
  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Veritabanı bağlantısını başlatır
   */
  protected async initialize(): Promise<void> {
    if (!this.db) {
      this.db = await getDb();
      this.collection = this.db.collection<T>(this.collectionName);
    }
  }

  /**
   * Tüm belgeleri getirir
   * @param filter Filtreleme kriterleri
   * @param options Sorgu seçenekleri
   * @returns Belge listesi
   */
  async findAll(filter: Filter<T> = {}, options?: FindOptions<T>): Promise<T[]> {
    await this.initialize();
    return this.collection!.find(filter, options).toArray();
  }

  /**
   * ID'ye göre belge getirir
   * @param id Belge ID'si
   * @returns Belge veya null
   */
  async findById(id: string): Promise<T | null> {
    await this.initialize();
    return this.collection!.findOne({ 
      $or: [
        { _id: new ObjectId(id) }, 
        { id } 
      ]
    } as Filter<T>);
  }

  /**
   * Filtreye göre tek belge getirir
   * @param filter Filtreleme kriterleri
   * @returns Belge veya null
   */
  async findOne(filter: Filter<T>): Promise<T | null> {
    await this.initialize();
    return this.collection!.findOne(filter);
  }

  /**
   * Yeni belge oluşturur
   * @param data Belge verisi
   * @returns Oluşturulan belge
   */
  async create(data: OptionalUnlessRequiredId<T>): Promise<T> {
    await this.initialize();
    const result = await this.collection!.insertOne(data);
    return { ...data, _id: result.insertedId } as T;
  }

  /**
   * Belgeyi günceller
   * @param id Belge ID'si
   * @param data Güncellenecek veri
   * @param options Güncelleme seçenekleri
   * @returns Güncellenen belge sayısı
   */
  async update(id: string, data: Partial<T>, options?: UpdateOptions): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateOne(
      { $or: [{ _id: new ObjectId(id) }, { id }] } as Filter<T>,
      { $set: data } as UpdateFilter<T>,
      options
    );
    return result.modifiedCount;
  }

  /**
   * Belgeyi siler
   * @param id Belge ID'si
   * @returns Silinen belge sayısı
   */
  async delete(id: string): Promise<number> {
    await this.initialize();
    const result = await this.collection!.deleteOne({ 
      $or: [
        { _id: new ObjectId(id) }, 
        { id } 
      ]
    } as Filter<T>);
    return result.deletedCount;
  }

  /**
   * Filtreye göre belgeleri sayar
   * @param filter Filtreleme kriterleri
   * @returns Belge sayısı
   */
  async count(filter: Filter<T> = {}): Promise<number> {
    await this.initialize();
    return this.collection!.countDocuments(filter);
  }

  /**
   * Belgeleri toplu olarak oluşturur
   * @param data Belge verileri
   * @returns Oluşturulan belge sayısı
   */
  async createMany(data: OptionalUnlessRequiredId<T>[]): Promise<number> {
    await this.initialize();
    const result = await this.collection!.insertMany(data);
    return result.insertedCount;
  }

  /**
   * Filtreye göre belgeleri toplu olarak günceller
   * @param filter Filtreleme kriterleri
   * @param data Güncellenecek veri
   * @param options Güncelleme seçenekleri
   * @returns Güncellenen belge sayısı
   */
  async updateMany(filter: Filter<T>, data: Partial<T>, options?: UpdateOptions): Promise<number> {
    await this.initialize();
    const result = await this.collection!.updateMany(
      filter,
      { $set: data } as UpdateFilter<T>,
      options
    );
    return result.modifiedCount;
  }

  /**
   * Filtreye göre belgeleri toplu olarak siler
   * @param filter Filtreleme kriterleri
   * @returns Silinen belge sayısı
   */
  async deleteMany(filter: Filter<T>): Promise<number> {
    await this.initialize();
    const result = await this.collection!.deleteMany(filter);
    return result.deletedCount;
  }
}
