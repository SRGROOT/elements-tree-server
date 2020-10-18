import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { Repository } from 'typeorm';
import { ElementEntity } from './entities/Element.entity';
import { ElementDTO } from './models/ElementModel';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ElementEntity)
    private readonly elementRepository: Repository<ElementEntity>,
  ) {}

  async getByparentId(id: number) {
    return await this.elementRepository.query(
      `
    SELECT 
      E.id,
      E.type,
      E.parent_id,
      E.atributes
    FROM element_entity E
    WHERE E.parent_id ${id === null ? 'is NULL' : `= ${id}`}
    ORDER BY E.id DESC
    `,
    );
  }

  async getById(id: number = null): Promise<any> {
    const element = await this.elementRepository.query(
      `
    SELECT
      E.id,
      E.type,
      E.parent_id,
      E.atributes
    FROM element_entity E
    WHERE ${id ? `E.id=${id}` : 'E.parent_id IS NULL'}
    `,
    );

    if (!element.length) return {};

    const children = this.getByparentId(id || element[0]?.id);

    return Promise.all([element, children]).then(values => {
      return {
        ...values[0][0],
        children: values[1],
      };
    });
  }

  async createElement(newElement: ElementDTO) {
    return this.elementRepository.save(newElement).then(res => {
      return {
        ...res,
        children: [],
      };
    });
  }

  async updateElement(element: ElementDTO) {
    await this.elementRepository
      .createQueryBuilder()
      .update()
      .set({ type: element.type, atributes: element.atributes })
      .where('id = :id', { id: element.id })
      .execute();

    return this.getById(element.id);
  }

  async deleteElements(id: number) {
    const entitites = await this.elementRepository.query(`
    WITH RECURSIVE elements (id , type, parent_id, atributes) AS (
      SELECT E.id , E.type, E.parent_id, E.atributes
          FROM element_entity E WHERE E.id = ${id}
      union all
      SELECT E.id , E.type, E.parent_id, E.atributes
          FROM element_entity E INNER JOIN elements ON( elements.id = E.parent_id))
      SELECT * from elements`);

    return this.elementRepository.delete(entitites);
  }

  async fillChildren(array: any[]) {
    //TODO перенести в агрегатные функции

    return Promise.all(
      array.map(async element => {
        const children = await this.getByparentId(element.id);
        const filledChildren = await this.fillChildren(children);

        return {
          ...element,
          children: filledChildren,
        };
      }),
    );
  }

  async getJson() {
    return this.fillChildren(await this.getByparentId(null));
  }
}
