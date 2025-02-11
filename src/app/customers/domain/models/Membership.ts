import { GenericEntity } from '../../../generics/domain/model/GenericEntity';
import { EMembership } from './EMembership';

export interface Membership extends GenericEntity {
  name?: EMembership;
  description?: string;
}
