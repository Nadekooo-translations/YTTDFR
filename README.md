![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Nadekooo/YTTDFR/Build-YttdFr.yml)
[![Translation status](https://weblate.vinceh121.me/widget/your-turn-to-die/yttd-fr/fr/svg-badge.svg)](https://weblate.vinceh121.me/engage/your-turn-to-die/-/fr/)
![Weblate component license](https://img.shields.io/weblate/l/your-turn-to-die/yttd-fr?server=https%3A%2F%2Fweblate.vinceh121.me&label=licence)

[![Translation status](https://weblate.vinceh121.me/widgets/your-turn-to-die/fr/yttd-fr/open-graph.png)](https://weblate.vinceh121.me/engage/your-turn-to-die/fr/)


## [Comment contribuer ?](https://yttd.fr/contribuer/)

### Documentation technique

Tech stack :

- Your Turn To Die is made using RPGMaker MV, which is itself made using NW.js
- The CustomTranslationEngine plugin is used for localization
- Weblate is used for continuous translation
- Website (in the `www` directory) is made using Astro and Vue
- CI/CD is made using Github Actions along with Node.js scripts

Translations are stored in monolingual deep JSON files in the root of the repository.

#### Setting up a website developpment workspace

A .env is required to build the website. The .env.example files has most of the variables already defined.

You need to fill the `WEBLATE_TOKEN` environment variable with your Weblate API token [here](https://weblate.vinceh121.me/accounts/profile/#api)

## License

The French translation is provided under the CC BY SA license. See `LICENSE`.
