import { FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { PaginatedDataDto } from './dto/paginated-data.dto';

export class Paginator<Entity> {
  repository: Repository<Entity>;

  constructor(repository: Repository<Entity>) {
    this.repository = repository;
  }

  public async paginate(
    page = 1,
    size?: number,
    customQuery?: SelectQueryBuilder<Entity> | FindManyOptions<Entity>,
  ): Promise<PaginatedDataDto<Entity>> {
    if (!customQuery) {
      customQuery = this.repository.createQueryBuilder();
    }

    const offset = size && (page - 1) * size;

    const isQueryBuilder = customQuery instanceof SelectQueryBuilder;

    const [data, count] = (await isQueryBuilder)
      ? await this.findCountWithQb(
          customQuery as SelectQueryBuilder<Entity>,
          offset,
          size,
        )
      : await this.findCountWithFindOptions(
          customQuery as FindManyOptions<Entity>,
          offset,
          size,
        );

    const pageSize = size || count;

    return {
      total: count,
      currentPage: page,
      lastPage: Math.ceil(count / pageSize) || 1,
      pageSize,
      data,
    };
  }

  private async findCountWithQb(
    customQuery: SelectQueryBuilder<Entity>,
    offset?: number,
    size?: number,
  ) {
    return await customQuery.skip(offset).take(size).getManyAndCount();
  }

  private async findCountWithFindOptions(
    findOptions: FindManyOptions<Entity> = {},
    offset?: number,
    size?: number,
  ) {
    return this.repository.findAndCount({
      ...findOptions,
      skip: offset,
      take: size,
    });
  }
}
