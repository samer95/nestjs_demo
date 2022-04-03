import { Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateBlockInput } from './dto/create-block.input';
import { Block } from './entities/block.entity';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(Block)
    private blocksRepository: Repository<Block>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private connection: Connection,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  async create(createBlockInput: CreateBlockInput): Promise<Block> {
    const { transactions, ...blockData } = plainToInstance(
      CreateBlockInput,
      createBlockInput,
      { excludeExtraneousValues: true },
    );

    // TODO: make sure if the block number is a unique value
    const existedCount = await this.blocksRepository.count({
      where: { b_number: blockData.b_number },
    });
    if (existedCount > 0) {
      return null;
    }

    const newBlock = await this.blocksRepository.save(
      this.blocksRepository.create(blockData),
    );

    const transactionsData = transactions.map(trans => {
      const newObj = new Transaction();
      newObj.block_id = newBlock.id;
      newObj.t_hash = trans;
      return newObj;
    });

    await this.connection.transaction(
      async manager => await manager.save(transactionsData),
    );

    return newBlock;
  }

  findAll(): Promise<Block[]> {
    return this.blocksRepository.find();
  }

  findOne(id: number): Promise<Block> {
    return this.blocksRepository.findOneOrFail(id);
  }

  getTransactions(id: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({ block_id: id });
  }
}
