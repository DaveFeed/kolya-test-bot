import { QuickDB } from 'quick.db';
import { User, Messages } from 'src/domain/dto';

export interface IRepositories {
    users: QuickDB<User>;
    messages: QuickDB<Messages>;
}
