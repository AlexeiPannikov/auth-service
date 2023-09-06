import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {addDays} from "../../../../core/helpers/AddDays";
import {UserEntity} from "../User/User.entity";

@Entity("sessions")
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({generated: "uuid"})
    uuid: string

    @ManyToOne(() => UserEntity, (u: UserEntity) => u.id, {nullable: false})
    @JoinColumn({name: 'userId'})
    userId: number;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @Column()
    expiredAt: string;
}