import { GenericNamed } from '../../../generics/domain/model/GenericNamed';
import { Neighborhood } from './Neighborhood';

export interface DeliveryZone extends GenericNamed {
  neighborhoodList?: Neighborhood[];
}
