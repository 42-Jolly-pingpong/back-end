import { DataSource, Repository } from 'typeorm';
import { ScoreLog } from 'src/game/entities/score-log.entity';
import { Injectable } from '@nestjs/common';
import { ScoreLogDto } from 'src/game/dto/score-log.dto';

@Injectable()
export class ScoreLogRepository extends Repository<ScoreLog> {
	constructor(private dataSource: DataSource) {
		super(ScoreLog, dataSource.createEntityManager());
	}

	saveScoreLog(roomName: string, startTime: Date, userId: number) {
		const log = this.create({
			roomName,
			elapsedTime: Date.now() - Date.parse(startTime.toString()),
			userId,
		});
		this.save(log);
	}

	async getScoreLog(roomName: string): Promise<ScoreLogDto[]> {
		const scoreLog: ScoreLogDto[] = await this.find({
			relations: { user: true },
			where: { roomName },
			order: { elapsedTime: 'ASC' },
		});
		return scoreLog;
	}
}
