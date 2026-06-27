import { Model, ModelStatic, WhereOptions, FindOptions } from 'sequelize';

export class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findById(id: number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async findOne(where: WhereOptions): Promise<T | null> {
    return this.model.findOne({ where });
  }

  async create(data: any): Promise<T> {
    return this.model.create(data);
  }

  async update(id: number, data: any): Promise<boolean> {
    const [affectedRows] = await this.model.update(data, {
      where: { id } as WhereOptions,
    });
    return affectedRows > 0;
  }

  async delete(id: number): Promise<number> {
    return this.model.destroy({
      where: { id } as WhereOptions,
    });
  }

  async count(where?: WhereOptions): Promise<number> {
    return this.model.count({ where });
  }

  async exists(where: WhereOptions): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }
}