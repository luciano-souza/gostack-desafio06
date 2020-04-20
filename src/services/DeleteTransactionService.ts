import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    // Delete does not check if the entity exist on the database

    const transaction = await transactionsRepository.findOne({ id });

    if (!transaction) {
      throw new AppError('Transaction not found.');
    }

    await transactionsRepository.delete(id);

    // or use await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
