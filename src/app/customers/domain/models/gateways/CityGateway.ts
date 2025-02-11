import type { GenericGateway } from '../../../../generics/domain/gateway/GenericGateway';
import { GenericNamedGateway } from '../../../../generics/domain/gateway/GenericNamedGateway';
import { City } from '../City';

export abstract class CityGateway
  extends GenericNamedGateway<City>
  implements GenericGateway<City> {}
