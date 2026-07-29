const list = document.getElementById('starred-repositories');

function showMessage(message, isError = false) {
  if (!list) {
    return;
  }

  list.innerHTML = '';
  const item = document.createElement('li');
  item.textContent = message;
  item.classList.toggle('status-error', isError);
  list.appendChild(item);
}

function renderRepositories(repositories) {
  if (!list) {
    return;
  }

  list.innerHTML = '';

  if (!Array.isArray(repositories) || repositories.length === 0) {
    showMessage('No starred repositories to show yet.');
    return;
  }

  const fragment = document.createDocumentFragment();

  repositories.forEach((repo) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const description = document.createElement('p');
    const meta = document.createElement('div');
    const stars = document.createElement('span');
    const language = document.createElement('span');
    const updated = document.createElement('span');

    link.href = repo.url || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = repo.name || 'Untitled repository';

    description.textContent = repo.description || 'No description provided.';

    stars.textContent = `⭐ ${repo.stargazers_count ?? 0}`;
    language.textContent = `● ${repo.language || 'Unknown'}`;

    const updatedDate = repo.updated_at
      ? new Date(repo.updated_at)
      : null;
    const updatedLabel = Number.isNaN(updatedDate?.getTime())
      ? 'Updated recently'
      : `Updated ${updatedDate.toLocaleDateString('en', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}`;
    updated.textContent = updatedLabel;

    meta.className = 'meta';
    meta.append(stars, language, updated);
    item.append(link, description, meta);
    fragment.appendChild(item);
  });

  list.appendChild(fragment);
}

async function loadRepositories() {
  if (!list) {
    console.error('The repositories list container is missing.');
    return;
  }

  try {
    const response = await fetch('events.json', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Unable to load repository data (${response.status}).`);
    }

    const repositories = await response.json();

    if (!Array.isArray(repositories)) {
      throw new Error('Expected an array of repositories.');
    }

    renderRepositories(repositories);
  } catch (error) {
    console.error(error);
    showMessage('Unable to load starred repositories right now.', true);
  }
}

loadRepositories();
