import { Injectable } from '@nestjs/common';
// import { FirebaseService } from './firebase.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Expert } from './expert.entity';
import { ExpertCategory } from './expert.category.entity';
import { UpdateExpertDto } from '../admin/dto/update-expert.dto';

@Injectable()
export class ExpertGeneralService {
  constructor(
    @InjectRepository(Expert) private expertRepository: Repository<Expert>,
    @InjectRepository(ExpertCategory)
    private expertCategoryRepository: Repository<ExpertCategory>,
  ) {}

  async searchExpertByName(query: string) {
    console.log('Query: ', query);
    const experts = await this.expertRepository
      .createQueryBuilder('expert')
      .where('UPPER(firstName) LIKE :query OR UPPER(lastName) LIKE :query', {
        query: `%${query.toUpperCase()}%`,
      })
      .getMany();

    console.log('Experts: ', experts);

    const resultantExperts: Expert[] = [];
    for (const expert of experts) {
      resultantExperts.push(
        await this.expertRepository.findOne({
          where: {
            id: expert.id,
          },
        }),
      );
    }

    return resultantExperts;
  }
  async updateExpert(updateExpertDto: UpdateExpertDto, expertId) {
    const expert = await this.expertRepository.findOneOrFail({
      id: expertId,
    });

    const {
      firstName,
      lastName,
      phoneNumber,
      categoryId,
      fee,
      availableTime,
    } = updateExpertDto;

    const category = await this.expertCategoryRepository.findOneOrFail({
      where: {
        id: categoryId,
      },
    });

    expert.firstName = firstName;
    expert.lastName = lastName;
    expert.phoneNumber = phoneNumber;
    expert.category = category;
    expert.fee = fee;
    expert.availableTime = availableTime;

    return await this.expertRepository.save(expert);
  }

  async getExpertByCategory(categoryId) {
    const expertCategory = await this.expertCategoryRepository.findOneOrFail({
      id: categoryId,
    });

    const experts: Expert[] = await expertCategory.experts;
    // console.log("Experts: ", experts);

    const resultantExperts: Expert[] = [];
    for (const expert of experts) {
      resultantExperts.push(
        await this.expertRepository.findOne({
          where: {
            id: expert.id,
          },
        }),
      );
    }

    return resultantExperts;
  }

  async getExperts() {
    return await this.expertRepository.find();
  }

  async getExpertCategories() {
    return await this.expertCategoryRepository.find();
  }

  async setPreAssessmentQuestions(expertId: number, questions: string) {
    const expert = await this.expertRepository.findOneOrFail({
      where: {
        id: expertId,
      },
    });

    expert.preAssessmentQuestions = questions;

    return await this.expertRepository.save(expert);
  }

  async getPreAssessmentQuestions(expertId: number) {
    const expert = await this.expertRepository.findOneOrFail({
      where: {
        id: expertId,
      },
    });

    return { preAssessmentQuestions: expert.preAssessmentQuestions };
  }
}
