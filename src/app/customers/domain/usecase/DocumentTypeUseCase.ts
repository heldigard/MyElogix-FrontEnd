import { Injectable } from '@angular/core';
import { GenericNamedUseCase } from '../../../generics/domain/usecase/GenericNamedUseCase';
import { DocumentType } from '../models/DocumentType';
import { DocumentTypeGateway } from '../models/gateways/DocumentTypeGateway';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeUseCase extends GenericNamedUseCase<
  DocumentType,
  DocumentTypeGateway
> {
  constructor(protected override gateway: DocumentTypeGateway) {
    super(gateway);
  }
}
