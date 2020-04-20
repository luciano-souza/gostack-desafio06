import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    // Check if there is sufficient funds
    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();
      if (total < value)
        throw new AppError(
          'There is no sufficient funds to complete this transaction.',
        );
    }

    // Get or Create the category
    const category_id = await this.getOrCreateCategoryIdByCategoryTitle(
      category,
    );

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }

  private async getOrCreateCategoryIdByCategoryTitle(
    title: string,
  ): Promise<string> {
    const categoriesRepository = getRepository(Category);

    let category = await categoriesRepository.findOne({
      where: { title },
    });

    // If the category does not exists create on DB
    if (!category) {
      category = categoriesRepository.create({
        title,
      });

      await categoriesRepository.save(category);
    }

    // return the category_id
    return category.id;
  }
}

export default CreateTransactionService;
