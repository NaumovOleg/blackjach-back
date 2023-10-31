import { GetClientList } from '@domains/interfaces/use-cases';
import { ClientRepo } from '@domains/interfaces/repositories';

export class GetClientListUC implements GetClientList {
  constructor(private clientRepository: ClientRepo) {}

  exec() {
    return this.clientRepository.getList();
  }
}
