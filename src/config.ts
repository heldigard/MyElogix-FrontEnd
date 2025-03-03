import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  RouterLink,
  RouterOutlet,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { APPROUTES } from './app/app.routes';
import { CustomerBasicGateway } from './app/customers/domain/models/gateways/CustomerBasicGateway';
import { CustomerGateway } from './app/customers/domain/models/gateways/CustomerGateway';
import { CustomerBasicGatewayImpl } from './app/customers/infrastructure/driven_adapters/customer-basic/CustomerBasicGatewayImpl.service';
import { CustomerGatewayImpl } from './app/customers/infrastructure/driven_adapters/customer/CustomerGatewayImpl.service';
import { ProductGateway } from './app/delivery-orders/domain/models/gateways/ProductGateway';
import { StatusGateway } from './app/delivery-orders/domain/models/gateways/StatusGateway';
import { ProductGatewayImpl } from './app/delivery-orders/infrastructure/driven_adapters/product/ProductGatewayImpl.service';
import { StatusGatewayImpl } from './app/delivery-orders/infrastructure/driven_adapters/status/StatusGatewayImpl.service';
import { DeliveryOrderBasicGateway } from './app/delivery_order/domain/gateway/DeliveryOrderBasicGateway';
import { DeliveryOrderGateway } from './app/delivery_order/domain/gateway/DeliveryOrderGateway';
import { DeliveryOrderBasicGatewayImpl } from './app/delivery_order/infrastructure/delivery-order-basic/DeliveryOrderBasicGatewayImpl.service';
import { DeliveryOrderGatewayImpl } from './app/delivery_order/infrastructure/delivery-order/DeliveryOrderGatewayImpl.service';
import { ProductOrderGateway } from './app/product-order/domain/gateway/ProductOrderGateway';
import { ProductOrderGatewayImpl } from './app/product-order/infrastructure/ProductOrderGatewayImpl.service';
import { CoreModule } from './app/UI/core/core.module';
import { LoaderModule } from './app/UI/modules/loader/loader.module';
import { environment } from './environments/environment';
import { MetricUnitGateway } from './app/delivery-orders/domain/models/gateways/MetricUnitGateway';
import { MetricUnitGatewayImpl } from './app/delivery-orders/infrastructure/driven_adapters/metric-unit/MetricUnitGatewayImpl.service';
import { MeasureDetailGateway } from './app/delivery-orders/domain/models/gateways/MeasureDetailGateway';
import { MeasureDetailGatewayImpl } from './app/delivery-orders/infrastructure/driven_adapters/measure-detail/MeasureDetailGatewayImpl.service';
import { CityGateway } from './app/customers/domain/models/gateways/CityGateway';
import { CityGatewayImpl } from './app/customers/infrastructure/driven_adapters/city/CityGatewayImpl.service';
import { NeighborhoodGateway } from './app/customers/domain/models/gateways/NeighborhoodGateway';
import { NeighborhoodGatewayImpl } from './app/customers/infrastructure/driven_adapters/neighborhood/NeighborhoodGatewayImpl.service';
import { MembershipGateway } from './app/customers/domain/models/gateways/MembershipGateway';
import { MembershipGatewayImpl } from './app/customers/infrastructure/driven_adapters/membership/MembershipGatewayImpl.service';
import { DeliveryZoneGateway } from './app/customers/domain/models/gateways/DeliveryZoneGateway';
import { DeliveryZoneGatewayImpl } from './app/customers/infrastructure/driven_adapters/delivery-zone/DeliveryZoneGatewayImpl.service';
import { DocumentTypeGateway } from './app/customers/domain/models/gateways/DocumentTypeGateway';
import { DocumentTypeGatewayImpl } from './app/customers/infrastructure/driven_adapters/document-type/DocumentTypeGatewayImpl.service';
import { ProductTypeGateway } from './app/delivery-orders/domain/models/gateways/ProductTypeGateway';
import { ProductTypeGatewayImpl } from './app/delivery-orders/infrastructure/driven_adapters/product-type/ProductTypeGatewayImpl.service';
import { ProductCategoryGateway } from './app/delivery-orders/domain/models/gateways/ProductCategoryGateway';
import { ProductCategoryGatewayImpl } from './app/delivery-orders/infrastructure/driven_adapters/product-category/ProductCategoryGatewayImpl.service';
import { UserModelGateway } from './app/users/domain/models/gateways/UserModelGateway';
import { UserModelGatewayImpl } from './app/users/infrastructure/driven_adapters/user/UserModelGatewayImpl.service';
import { RoleModelGateway } from './app/users/domain/models/gateways/RoleModelGateway';
import { RoleModelGatewayImpl } from './app/users/infrastructure/driven_adapters/role/RoleModelGatewayImpl.service';
export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      RouterOutlet,
      CoreModule,
      LoaderModule,
      RouterLink,
      BrowserModule,
      FontAwesomeModule,
    ),
    environment.production
      ? provideRouter(
          APPROUTES,
          withPreloading(PreloadAllModules), // Enable preloading for all modules
          withComponentInputBinding(), // Enable component input binding
        )
      : provideRouter(
          APPROUTES,
          withPreloading(PreloadAllModules),
          withComponentInputBinding(),
          // withDebugTracing(),
        ),
    provideAnimations(),
    {
      provide: DeliveryOrderBasicGateway,
      useClass: DeliveryOrderBasicGatewayImpl,
    },
    {
      provide: DeliveryOrderGateway,
      useClass: DeliveryOrderGatewayImpl,
    },
    {
      provide: ProductOrderGateway,
      useClass: ProductOrderGatewayImpl,
    },
    {
      provide: StatusGateway,
      useClass: StatusGatewayImpl,
    },
    {
      provide: CityGateway,
      useClass: CityGatewayImpl,
    },
    {
      provide: NeighborhoodGateway,
      useClass: NeighborhoodGatewayImpl,
    },
    {
      provide: MembershipGateway,
      useClass: MembershipGatewayImpl,
    },
    {
      provide: DeliveryZoneGateway,
      useClass: DeliveryZoneGatewayImpl,
    },
    {
      provide: DocumentTypeGateway,
      useClass: DocumentTypeGatewayImpl,
    },
    {
      provide: CustomerGateway,
      useClass: CustomerGatewayImpl,
    },
    {
      provide: CustomerBasicGateway,
      useClass: CustomerBasicGatewayImpl,
    },
    {
      provide: ProductTypeGateway,
      useClass: ProductTypeGatewayImpl,
    },
    {
      provide: ProductCategoryGateway,
      useClass: ProductCategoryGatewayImpl,
    },
    {
      provide: ProductGateway,
      useClass: ProductGatewayImpl,
    },
    {
      provide: MetricUnitGateway,
      useClass: MetricUnitGatewayImpl,
    },
    {
      provide: MeasureDetailGateway,
      useClass: MeasureDetailGatewayImpl,
    },
    {
      provide: UserModelGateway,
      useClass: UserModelGatewayImpl,
    },
    {
      provide: RoleModelGateway,
      useClass: RoleModelGatewayImpl,
    },
  ],
};
