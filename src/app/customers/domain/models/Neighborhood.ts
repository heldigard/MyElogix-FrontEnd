import { GenericNamed } from '../../../generics/domain/model/GenericNamed';
import { CityBasic } from './CityBasic';
import { DeliveryZoneBasic } from './DeliveryZoneBasic';

export interface Neighborhood extends GenericNamed {
  city?: CityBasic;
  deliveryZone?: DeliveryZoneBasic;
}
