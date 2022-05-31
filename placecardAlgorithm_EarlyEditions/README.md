![Placecard logo](placecard/../placecardClient/src/assets/logo.png)

# Placecard
A web application designed for automating the seating arrangement process.

# Development Guidelines

## Code Commits
We try to make code commits as small as possible so that we don't push out large changes in abundance for one commit. Doing so will minimize the possible number of conflicts while ensuring that our code is tested well in small bits. 

## Feature Branches
Each feature will be given its own branch and merged to master when completed and reviewed. Rebase branches against the master branch before opening pull requests.

## git commands
To checkout a new branch from your current branch and change directly to the new branch:

```
git checkout -b <branch-name>
```

If you need to push your local branch to the remote repository run this command after the branch's first commit:
```
git push -u origin <branch-name>
```
To rebase a branch:
```
git pull --rebase origin <branch-name>
```