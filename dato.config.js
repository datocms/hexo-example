const by = require('sort-by');

module.exports = (dato, root) => {
  root.createDataFile(
    'source/_data/homepage.yml', 'yaml',
    {
      siteName: dato.homepage.siteName,
      tagLine: dato.homepage.tagLine,
      description: dato.homepage.description,
    }
  );

  root.createDataFile(
    'source/_data/seasons.yml', 'yaml',
    dato.seasons.sort(by('name')).map(season => {
      return {
        title:        season.name,
        imageUrl:     season.image.url({ w: 400 }),
        thumbnailUrl: season.image.url({ h: 300 }),
        bgUrl:        season.image.url({ w: 5 }),
        weight:       season.position,
        overview:     season.overview
      };
    })
  );

  root.directory('source/_posts', dir => {
    dato.episodes.sort(by('id', 'episodeNumber')).forEach(episode => {
      dir.createPost(
        `${episode.slug()}.md`,
        'yaml',
        {
          frontmatter: {
            title:         episode.title,
            episodeNumber: episode.episodeNumber,
            paletteUrl:    episode.image && episode.image.url({ auto: 'enhance', palette: 'json' }),
            imageUrl:      episode.image && episode.image.url({ w: 500 }),
            thumbnailUrl:  episode.image && episode.image.url({ w: 500, h: 280, fit: 'crop', auto: 'enhance', fm: 'jpg' }),
            date:          episode.firstAired.toMap(),
            rating:        episode.rating,
            director:      episode.director,
            categories:    [episode.season.name]
          },
          content: episode.description
        }
      );
    });
  });

  const characters = dato.characters.sort(by('position'));

  root.createDataFile('source/_data/characters.yml', 'yaml',
    characters.map(character => {
      return {
        slug:         character.slug({ prefixWithId: false }),
        title:        character.name,
        actorName:    character.actorName,
        thumbnailUrl: character.image.url({ fit: 'crop', crop: 'faces', w: 200, h: 200 }),
      };
    })
  );

  root.directory('source/character/', dir => {
    characters.forEach(character => {
      dir.createPost(
        `${character.slug({ prefixWithId: false })}/index.md`,
        'yaml',
        {
          frontmatter: {
            layout:       'character',
            title:        character.name,
            actorName:    character.actorName,
            episodes:     parseInt(character.episode),
            imageUrl:     character.image.url({ w: 500, fm: 'jpg' }),
          },
          content: character.description
        }
      );
    });
  });
};
