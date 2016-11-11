EMACS = $(shell command -v emacs || { echo "emacs not found." >&2; exit 1; })

SRC = index.org

all: build

build:
	@$(EMACS) $(SRC) -f org-ioslide-export-to-html --kill
