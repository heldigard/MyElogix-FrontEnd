import { ContactPerson } from './ContactPerson';
import { Neighborhood } from './Neighborhood';
import { CityBasic } from './CityBasic';
import { DeliveryZoneBasic } from './DeliveryZoneBasic';
import type { GenericEntity } from '../../../generics/domain/model/GenericEntity'

export interface BranchOffice extends GenericEntity {
  customerId?: number;
  address?: string;
  contactPerson?: ContactPerson;
  city?: CityBasic;
  neighborhood?: Neighborhood;
  deliveryZone?: DeliveryZoneBasic;
}
