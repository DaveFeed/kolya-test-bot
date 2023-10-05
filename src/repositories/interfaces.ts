import { QuickDB } from 'quick.db';
import { User } from 'src/domain/dto';

export interface IRepositories {
    users: QuickDB<User>;
}
