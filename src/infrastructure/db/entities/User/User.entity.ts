import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  activationLink: string;

  @Column({ default: false })
  isActivated: boolean;
}
