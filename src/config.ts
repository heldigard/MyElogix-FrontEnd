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
import { MetricUnitGateway } from './app/delivery-orders/domain/models/gateways/MetricUnitGateway'
import { MetricUnitGatewayImpl } from './app/delivery-orders/infrastructure/driven_adapters/metric-unit/MetricUnitGatewayImpl.service'
import { MeasureDetailGateway } from './app/delivery-orders/domain/models/gateways/MeasureDetailGateway'
import { MeasureDetailGatewayImpl } from './app/delivery-orders/infrastructure/driven_adapters/measure-detail/MeasureDetailGatewayImpl.service'
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
      provide: CustomerGateway,
      useClass: CustomerGatewayImpl,
    },
    {
      provide: CustomerBasicGateway,
      useClass: CustomerBasicGatewayImpl,
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
  ],
};
