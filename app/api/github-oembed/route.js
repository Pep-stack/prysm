import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
           // Parse GitHub URL to determine type and extract info
       const githubInfo = parseGitHubUrl(url);
       
       if (!githubInfo) {
         return NextResponse.json({ 
           error: 'Invalid GitHub URL',
           message: 'Please provide a valid GitHub repository, gist, issue, pull request, user profile, or organization URL'
         }, { status: 400 });
       }

    let githubData = null;

               // Fetch data based on URL type
           switch (githubInfo.type) {
             case 'repository':
               githubData = await fetchRepositoryData(githubInfo.owner, githubInfo.repo);
               break;
             case 'gist':
               githubData = await fetchGistData(githubInfo.gistId);
               break;
             case 'issue':
               githubData = await fetchIssueData(githubInfo.owner, githubInfo.repo, githubInfo.number);
               break;
             case 'pull_request':
               githubData = await fetchPullRequestData(githubInfo.owner, githubInfo.repo, githubInfo.number);
               break;
             case 'user':
               githubData = await fetchUserData(githubInfo.username);
               break;
             case 'organization':
               githubData = await fetchOrganizationData(githubInfo.orgname);
               break;
             default:
               return NextResponse.json({ error: 'Unsupported GitHub URL type' }, { status: 400 });
           }

    if (!githubData) {
      return NextResponse.json({ 
        error: 'Failed to fetch GitHub data',
        message: 'Could not retrieve data from GitHub API'
      }, { status: 500 });
    }

    // Return formatted response
    return NextResponse.json({
      ...githubData,
      original_url: url,
      github_info: githubInfo
    });

  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// Parse GitHub URL to extract type and identifiers
function parseGitHubUrl(url) {
  // Repository: https://github.com/owner/repo
  const repoMatch = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)(?:\/)?$/);
  if (repoMatch) {
    return {
      type: 'repository',
      owner: repoMatch[1],
      repo: repoMatch[2]
    };
  }

  // Gist: https://gist.github.com/username/gist-id
  const gistMatch = url.match(/gist\.github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (gistMatch) {
    return {
      type: 'gist',
      owner: gistMatch[1],
      gistId: gistMatch[2]
    };
  }

  // Issue: https://github.com/owner/repo/issues/123
  const issueMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
  if (issueMatch) {
    return {
      type: 'issue',
      owner: issueMatch[1],
      repo: issueMatch[2],
      number: issueMatch[3]
    };
  }

           // Pull Request: https://github.com/owner/repo/pull/123
         const prMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
         if (prMatch) {
           return {
             type: 'pull_request',
             owner: prMatch[1],
             repo: prMatch[2],
             number: prMatch[3]
           };
         }
       
         // User Profile: https://github.com/username
         const userMatch = url.match(/github\.com\/([^\/\?#]+)$/);
         if (userMatch) {
           return {
             type: 'user',
             username: userMatch[1]
           };
         }
       
         // Organization: https://github.com/orgname
         const orgMatch = url.match(/github\.com\/([^\/\?#]+)$/);
         if (orgMatch) {
           return {
             type: 'organization',
             orgname: orgMatch[1]
           };
         }
       
         return null;
}

// Fetch repository data from GitHub API
async function fetchRepositoryData(owner, repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Prysma-App'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    return {
      type: 'repository',
      title: data.name,
      description: data.description || 'GitHub Repository',
      author_name: data.owner?.login,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      html_url: data.html_url,
      provider_url: 'https://github.com',
      thumbnail_url: data.owner?.avatar_url,
      repository_id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching repository data:', error);
    return null;
  }
}

// Fetch gist data from GitHub API
async function fetchGistData(gistId) {
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Prysma-App'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const fileNames = Object.keys(data.files || {});
    
    return {
      type: 'gist',
      title: data.description || 'GitHub Gist',
      description: `Code snippet with ${fileNames.length} file(s)`,
      author_name: data.owner?.login,
      files: fileNames,
      html_url: data.html_url,
      provider_url: 'https://github.com',
      thumbnail_url: data.owner?.avatar_url,
      gist_id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching gist data:', error);
    return null;
  }
}

// Fetch issue data from GitHub API
async function fetchIssueData(owner, repo, number) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Prysma-App'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    return {
      type: 'issue',
      title: data.title,
      description: data.body ? data.body.substring(0, 200) + '...' : 'GitHub Issue',
      author_name: data.user?.login,
      state: data.state,
      comments: data.comments,
      html_url: data.html_url,
      provider_url: 'https://github.com',
      thumbnail_url: data.user?.avatar_url,
      issue_number: data.number,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching issue data:', error);
    return null;
  }
}

// Fetch pull request data from GitHub API
async function fetchPullRequestData(owner, repo, number) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Prysma-App'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    return {
      type: 'pull_request',
      title: data.title,
      description: data.body ? data.body.substring(0, 200) + '...' : 'GitHub Pull Request',
      author_name: data.user?.login,
      state: data.state,
      comments: data.comments,
      html_url: data.html_url,
      provider_url: 'https://github.com',
      thumbnail_url: data.user?.avatar_url,
      pr_number: data.number,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching pull request data:', error);
    return null;
  }
}

// Fetch user data from GitHub API
async function fetchUserData(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Prysma-App'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    return {
      type: 'user',
      title: data.name || data.login,
      description: data.bio || `GitHub user ${data.login}`,
      author_name: data.login,
      followers: data.followers,
      following: data.following,
      public_repos: data.public_repos,
      html_url: data.html_url,
      provider_url: 'https://github.com',
      thumbnail_url: data.avatar_url,
      user_id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      location: data.location,
      company: data.company,
      blog: data.blog
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Fetch organization data from GitHub API
async function fetchOrganizationData(orgname) {
  try {
    const response = await fetch(`https://api.github.com/orgs/${orgname}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Prysma-App'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    return {
      type: 'organization',
      title: data.name || data.login,
      description: data.description || `GitHub organization ${data.login}`,
      author_name: data.login,
      public_repos: data.public_repos,
      html_url: data.html_url,
      provider_url: 'https://github.com',
      thumbnail_url: data.avatar_url,
      org_id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      location: data.location,
      company: data.company,
      blog: data.blog,
      email: data.email
    };
  } catch (error) {
    console.error('Error fetching organization data:', error);
    return null;
  }
} 