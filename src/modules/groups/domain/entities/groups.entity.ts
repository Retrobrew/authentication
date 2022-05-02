import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../../users/domain/entities/user.entity';

@Entity()
export class Groups {
  @PrimaryKey()
  private _uuid: string;

  @Property()
  private _name: string;

  @Property()
  private _picture: string;

  @Property({ nullable: true })
  private _createdAt: Date;

  @Property({ nullable: true })
  private _description: string;

  @Property({ default: false })
  private _isProject: boolean;

  @ManyToOne(() => User)
  private _createdBy: User;  



  constructor(
    uuid: string, 
    name: string, 
    picture: string, 
    createdAt: Date, 
    description: string, 
    isProject: boolean, 
    createdBy: User
    ) {
    this._uuid = uuid
    this._name = name
    this._picture = picture
    this._createdAt = createdAt
    this._description = description
    this._isProject = isProject
    this._createdBy = createdBy
  }
  


    /**
     * Getter uuid
     * @return {string}
     */
	public get uuid(): string {
		return this._uuid;
	}

    /**
     * Getter name
     * @return {string}
     */
	public get name(): string {
		return this._name;
	}

    /**
     * Getter picture
     * @return {string}
     */
	public get picture(): string {
		return this._picture;
	}

    /**
     * Getter createdAt
     * @return {Date}
     */
	public get createdAt(): Date {
		return this._createdAt;
	}

    /**
     * Getter description
     * @return {string}
     */
	public get description(): string {
		return this._description;
	}

    /**
     * Getter isProject
     * @return {boolean}
     */
	public get isProject(): boolean {
		return this._isProject;
	}

    /**
     * Getter createdBy
     * @return {User}
     */
	public get createdBy(): User {
		return this._createdBy;
	}

    /**
     * Setter uuid
     * @param {string} value
     */
	public set uuid(value: string) {
		this._uuid = value;
	}

    /**
     * Setter name
     * @param {string} value
     */
	public set name(value: string) {
		this._name = value;
	}

    /**
     * Setter picture
     * @param {string} value
     */
	public set picture(value: string) {
		this._picture = value;
	}

    /**
     * Setter createdAt
     * @param {Date} value
     */
	public set createdAt(value: Date) {
		this._createdAt = value;
	}

    /**
     * Setter description
     * @param {string} value
     */
	public set description(value: string) {
		this._description = value;
	}

    /**
     * Setter isProject
     * @param {boolean} value
     */
	public set isProject(value: boolean) {
		this._isProject = value;
	}

    /**
     * Setter createdBy
     * @param {User} value
     */
	public set createdBy(value: User) {
		this._createdBy = value;
	}
  

}
