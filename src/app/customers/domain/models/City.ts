import { GenericNamed } from '../../../generics/domain/model/GenericNamed';
import { Neighborhood } from './Neighborhood';

export interface City extends GenericNamed {
  neighborhoodList?: Neighborhood[];
}
