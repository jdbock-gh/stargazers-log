const list = document.getElementById('starred-repositories');

async function loadRepositories() {
  try {
    const response = await fetch('events.json');
    const repositories = await response.json();

    if (!Array.isArray(repositories)) {
      throw new Error('Expected an array of repositories.');
    }

    list.innerHTML = repositories
      .map((repo) => {
        const updated = new Date(repo.updated_at).toLocaleDateString('en', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        return `
          <li>
            <a href="${repo.url}" target="_blank" rel="noreferrer">${repo.name}</a>
            <p>${repo.description}</p>
            <div class="meta">
              <span>⭐ ${repo.stargazers_count}</span>
              <span>● ${repo.language}</span>
              <span>Updated ${updated}</span>
            </div>
          </li>
        `;
      })
      .join('');
  } catch (error) {
    list.innerHTML = '<li>Unable to load starred repositories right now.</li>';
    console.error(error);
  }
}

loadRepositories();
