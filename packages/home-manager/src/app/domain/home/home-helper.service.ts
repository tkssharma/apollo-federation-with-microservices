import {
  Injectable, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { CONTRACT_API_USER_AUTHORIZATION, CONTRACT_NOT_EXISTS } from '@app/app.constants';
import { UserMetaData } from '@auth/interface/user';
import { CreateContractParams, SearchDtoParams } from './contract.dto';
import Contract from '../contract/contract.entity';
import { CsvDataTemplate } from '../shared/interface/csv-data-template';

const COLUMNS = [
  "id",
  "organization_id",
  "supplier_id",
  "supplier_name",
  "description",
  "title",
  "document",
  "document_originalname",
  "is_deleted",
  "ends_at",
  "starts_at",
  "payment_date",
  "payment_terms",
  "payment_frequency",
  "amount",
  "currency",
  "created_at",
  "updated_at",
  "contract_type",
  "is_alarm_set",
  "alarm_date",
  "is_reminder_set",
  "is_alarm_set",
  "alarm_date",
  "tags",
  "stakeholders",
  "cancellation_period",
  "status",
];
@Injectable()
export default class ContractHelperService {
  constructor(
    @InjectRepository(Contract) private contractRepo: Repository<Contract>,
  ) { }

  public async validateAuthorization(id: string, user: UserMetaData) {
    // check if contract id exists
    const savedContract = await this.contractRepo.findOne({ where: { id, is_deleted: false } });
    if (!savedContract) {
      throw new NotFoundException(CONTRACT_NOT_EXISTS);
    }
    if (savedContract.organization_id === user.organization_id) {
      return savedContract;
    }
    throw new UnauthorizedException(CONTRACT_API_USER_AUTHORIZATION);
  }

  public async transformAndValidateProfile(contract: CsvDataTemplate): Promise<CreateContractParams> {
    try {
      return ({
        supplier_name: contract.supplier_name,
        title: contract.title,
        supplier_id: contract.supplier_id,
        payment_frequency: contract.payment_frequency,
        currency: contract.currency,
        amount: contract.amount ? parseInt(contract.amount, 10) : undefined,
        payment_date: contract.payment_date || undefined,
        payment_terms: contract.payment_terms,
        contract_type: contract.contract_type,
        ends_at: contract.ends_at || undefined,
        starts_at: contract.starts_at || undefined,
        description: contract.description,
      });
    } catch (err) {
      throw err;
    }
  }
  public async validate(contract: CreateContractParams): Promise<null | string> {
    try {
      const contractObj = new CreateContractParams();
      contractObj.supplier_name = contract.supplier_name;
      contractObj.title = contract.title;
      contractObj.supplier_id = contract.supplier_id;
      contractObj.payment_frequency = contract.payment_frequency;
      contractObj.currency = contract.currency;
      contractObj.amount = contract.amount;
      contractObj.payment_date = contract.payment_date;
      contractObj.payment_terms = contract.payment_terms;
      contractObj.contract_type = contract.contract_type;
      contractObj.ends_at = contract.ends_at;
      contractObj.starts_at = contract.starts_at;
      contractObj.description = contract.description;
      const errors = await validate(contractObj);
      if (errors.length > 0) {
        return this.formateErrors(errors);
      }
      return null;
    } catch (err) {
      throw err;
    }
  }
  public formateErrors(errors: any): string {
    return errors.map((error: any) => {
      if (error.children && error.children.length > 0) {
        // tslint:disable-next-line:forin
        for (const key in error.children[0].constraints) {
          return error.children[0].constraints[key];
        }
      }
      // tslint:disable-next-line:forin
      for (const key in error.constraints) {
        return error.constraints[key];
      }
    }).join(',');
  }

  public async SearchQueryBuilder(
    filter: SearchDtoParams,
    user: UserMetaData
  ): Promise<{ contracts: Contract[] }> {
    try {
      const {
        supplier_id,
        contract_type,
        start_date,
        end_date,
        currency,
        contract_value_from,
        contract_value_to
      } = filter;

      let query = `
        SELECT ${COLUMNS.join(",")}
        FROM contracts
        WHERE organization_id = '${user.organization_id}'
        AND is_deleted = false
      `;

      if (supplier_id) {
        const supplierQuery = `supplier_id = '${supplier_id}'`
        query = `${query} AND ${supplierQuery}`
      }

      if (contract_type) {
        const contractQuery = `contract_type ILIKE '%${contract_type}%'`;
        query = `${query} AND ${contractQuery}`
      }

      if (start_date) {
        const startDateQuery = `starts_at >= '${start_date}'`;
        query = `${query} AND ${startDateQuery}`
      }

      if (end_date) {
        const endDateQuery = `ends_at <= '${end_date}'`;
        query = `${query} AND ${endDateQuery}`
      }

      if (currency) {
        const currencyQuery = `currency = '${currency}'`;
        query = `${query} AND ${currencyQuery}`
      }

      if (contract_value_from) {
        const contractValueFromQuery = `amount >= ${contract_value_from}`
        query = `${query} AND ${contractValueFromQuery}`
      }

      if (contract_value_to) {
        const contractValueToQuery = `amount <= ${contract_value_to}`
        query = `${query} AND ${contractValueToQuery}`
      }

      const contracts = await this.contractRepo.query(query);

      return {
        contracts,
      };
    } catch (err) {
      throw err;
    }
  }
}
