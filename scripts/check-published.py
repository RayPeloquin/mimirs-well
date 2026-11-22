"""Compare public Well pages with a Git revision. Run with Python 3 and Git.

    python scripts/check-published.py [revision]
"""
import hashlib
from pathlib import Path
import subprocess
import sys
from urllib.error import URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://raypeloquin.github.io/mimirs-well/"
PAGES = ("index.html", "catalog.html", "catalog.json", "ledger.html", "ledger-data.js")


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


def check(revision):
    commit = git("rev-parse", "--verify", "--end-of-options", revision + "^{commit}").decode().strip()
    print(f"Comparing {SITE} with {commit}", flush=True)
    passed = True
    for path in PAGES:
        try:
            expected = git("show", f"{commit}:{path}")
            route = "" if path == "index.html" else path
            request = Request(SITE + route + "?rev=" + commit, headers={"Cache-Control": "no-cache"})
            with urlopen(request, timeout=20) as response:
                actual = response.read()
        except (OSError, URLError, subprocess.CalledProcessError) as error:
            print(f"ERROR {path}: {error}")
            passed = False
            continue
        if actual == expected:
            print(f"MATCH {path}")
        else:
            print(f"DIFFERENT {path}")
            for label, data in (("git", expected), ("web", actual)):
                print(f"  {label} SHA-256 {hashlib.sha256(data).hexdigest()}")
            passed = False
    return 0 if passed else 1


if __name__ == "__main__":
    if len(sys.argv) > 2:
        sys.exit(__doc__)
    try:
        sys.exit(check(sys.argv[1] if len(sys.argv) == 2 else "HEAD"))
    except (OSError, subprocess.CalledProcessError) as error:
        sys.exit(str(error))
