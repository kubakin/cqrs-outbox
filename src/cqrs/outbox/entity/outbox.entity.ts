import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn()
  id: string;
  @Column({ type: 'integer', generated: 'increment' })
  number: number;
  @Column('varchar')
  name: string;
  @Column('simple-json')
  data: any;
  @Column()
  createdAt: Date;
  @Column('boolean')
  published: boolean;
  @Column({ nullable: true })
  publishedAt?: Date;

  constructor(id: string, name: string, data: any, createdAt: Date) {
    this.id = id;
    this.name = name;
    this.data = data;
    this.createdAt = createdAt;
    this.published = false;
  }

  publish() {
    this.published = true;
    this.publishedAt = new Date();
  }
}
