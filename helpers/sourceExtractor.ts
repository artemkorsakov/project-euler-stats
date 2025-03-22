import { Source, PersonalTask } from './types';
import { extractPercentage } from './parsers';

export function extractSources(source: string): Source {
	const tasks = source
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
            const [task, percentage] = line.split(';').map(part => part.trim());
            return new PersonalTask(task, extractPercentage(percentage));
        });

    return new Source(tasks);
}
