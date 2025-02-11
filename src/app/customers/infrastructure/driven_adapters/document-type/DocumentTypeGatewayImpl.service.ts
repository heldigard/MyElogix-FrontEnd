import { Injectable } from '@angular/core';
import { GenericNamedGatewayImpl } from '../../../../generics/insfrastructure/GenericNamedGatewayImpl';
import { DocumentType } from '../../../domain/models/DocumentType';
import { DocumentTypeGateway } from '../../../domain/models/gateways/DocumentTypeGateway';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeGatewayImpl
  extends GenericNamedGatewayImpl<DocumentType>
  implements DocumentTypeGateway
{
  constructor() {
    super('/document-type');
  }
}
