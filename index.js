const githubUsername = process.argv[2];
if (!githubUsername) {
  console.error("Please enter a GitHub username");
}

const fetchGithubUser = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    const data = await response.json();

    if (data.status == 404) {
      throw new Error("GitHub user does not exist");
    }
    if (data.length == 0) {
      console.log("No recent activity to display");
    } else {
      console.log(`${githubUsername} recent activity:`);
    }

    let message;
    await data.forEach((event) => {
      switch (event.type) {
        case "PushEvent":
          const commitCount = event.payload.commits.length;
          const commit = commitCount == 1 ? "commit" : "commits";
          message = `pushed ${commitCount} ${commit} to ${event.repo.name}`;
          break;
        case "IssueEvent":
          message = `created ${event.payload.ref_type} in ${event.repo.name}`;
          break;
        case "WatchEvent":
          message = `starred ${event.repo.name}`;
          break;
        case "ForkEvent":
          message = `forked ${event.repo.name}`;
          break;
      }
      console.log(`- ${message} on ${event.created_at.slice(0, 10)}`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

fetchGithubUser(githubUsername);
