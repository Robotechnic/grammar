import ghpages from 'gh-pages';
import { execSync } from 'child_process';

// build project
execSync('npm run format', { stdio: 'inherit' });
execSync('npm run lint --fix', { stdio: 'inherit' });
execSync('npm run check', { stdio: 'inherit' });
execSync('npm run build', { stdio: 'inherit' });

ghpages.publish(
	'build',
	{
		branch: 'gh-pages',
		dotfiles: false,
		message: 'Automatic deployment with gh-pages',
		remote: 'origin',
		verbose: true,
		push: true,
		silent: false
	},
	(err) => {
		if (err) {
			console.error(err);
		}
		// clean folder after deploy
		execSync('rm -rf build', { stdio: 'inherit' });
	}
);
