# EduFace

EduFace is a Raspberry Pi based face-recognition attendance system with a Node/Express backend and React frontend.

Important: This repository contains locally generated face encodings and runtime files. `encodings.pkl` and `unauthorized_logs/` are ignored by `.gitignore` by default. Do NOT commit sensitive data or student images to a public repository.

How to push to GitHub (quick):

1. Create an empty repository on GitHub (via web or `gh` CLI).
2. On this machine run:

```bash
cd /home/pi/EduFace
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

If you want me to push the repo for you, install and authenticate the GitHub CLI (`gh`) and give me permission to run it here, or provide a GitHub repo URL and credentials/token (not recommended for security).

