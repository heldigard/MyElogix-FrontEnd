import { inject, Injectable } from '@angular/core';
import { GenericNamedService } from '../../../generics/insfrastructure/services/generic-named.service';
import { DocumentType } from '../../domain/models/DocumentType';
import { DocumentTypeGateway } from '../../domain/models/gateways/DocumentTypeGateway';
import { DocumentTypeUseCase } from '../../domain/usecase/DocumentTypeUseCase';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService extends GenericNamedService<
  DocumentType,
  DocumentTypeGateway,
  DocumentTypeUseCase
> {
  constructor() {
    super(inject(DocumentTypeUseCase));
  }
}
