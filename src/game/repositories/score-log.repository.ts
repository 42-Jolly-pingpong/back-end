import { DataSource, Repository } from 'typeorm';
import { ScoreLog } from 'src/game/entities/score-log.entity';
import { Injectable } from '@nestjs/common';

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
}
