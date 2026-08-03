# Installing Bun

[Bun](https://bun.com) is a fast, all-in-one JavaScript/TypeScript runtime and package manager. This project currently uses **npm** (see `package.json` scripts), so Bun isn't required to build or run the app — this guide is for anyone who wants Bun available locally (e.g. to try `bun install` / `bun run` as a faster alternative, or for unrelated tooling).

## macOS & Linux

```bash
curl -fsSL https://bun.com/install | bash
```

> **Linux:** requires the `unzip` package (`sudo apt install unzip`). Kernel 5.6+ is recommended; Bun degrades gracefully on kernels as old as 3.10 (RHEL 7). Check your kernel with `uname -r`.

## Windows

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

Requires Windows 10 version 1809 or later.

## Package managers

```bash
npm install -g bun        # npm
brew install oven-sh/bun/bun   # Homebrew
scoop install bun          # Scoop
```

## Docker

```bash
docker pull oven/bun
docker run --rm --init --ulimit memlock=-1:-1 oven/bun
```

## Verify

```bash
bun --version
bun --revision
```

If you see `command not found`, add `~/.bun/bin` to your `PATH`:

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

## Upgrading / uninstalling

```bash
bun upgrade          # self-upgrade (use `brew upgrade bun` / `scoop update bun` if installed that way)
rm -rf ~/.bun         # uninstall (macOS/Linux)
```

Full reference: [bun.com/docs/installation](https://bun.com/docs/installation).
